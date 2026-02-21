import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  module QuizResult {
    public func compare(a : QuizResult, b : QuizResult) : Order.Order {
      Text.compare(a.quizId, b.quizId);
    };
  };

  // Metadata for each uploaded document
  type DocumentMetadata = {
    id : Text;
    fileName : Text;
    uploadDate : Time.Time;
    associatedStudent : Principal;
    blobId : Text;
  };

  let documentMetadataStore = Map.empty<Text, DocumentMetadata>();

  type QuizResult = {
    quizId : Text;
    correctAnswers : Nat;
    totalQuestions : Nat;
    score : Nat;
    percentage : Float;
    grade : Text;
    feedback : Text;
    timestamp : Int;
  };

  type StudentProgress = {
    studentPrincipal : Principal;
    quizHistory : [QuizResult];
    bestScore : ?QuizResult;
    averagePercentage : Float;
    quizzesTaken : Nat;
  };

  // Persistent student data
  let studentProgressStore = Map.empty<Principal, StudentProgress>();

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Store new document with metadata
  public shared ({ caller }) func uploadDocument(id : Text, fileName : Text, blobId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload documents");
    };

    let metadata : DocumentMetadata = {
      id;
      fileName;
      uploadDate = Time.now();
      associatedStudent = caller;
      blobId;
    };
    documentMetadataStore.add(id, metadata);
  };

  // Record quiz result for student
  public shared ({ caller }) func submitQuizResults(quizId : Text, correctAnswers : Nat, totalQuestions : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit quiz results");
    };

    let percentage = if (totalQuestions > 0) {
      (correctAnswers.toFloat() / totalQuestions.toFloat()) * 100.0;
    } else {
      0.0;
    };

    let grade = switch (percentage) {
      case (p) {
        if (p >= 90.0) { "A" } else if (p >= 80.0) { "B" } else if (p >= 70.0) {
          "C";
        } else if (p >= 60.0) { "D" } else { "F" };
      };
    };

    let result : QuizResult = {
      quizId;
      correctAnswers;
      totalQuestions;
      score = 0;
      percentage;
      grade;
      feedback = generateFeedback(percentage);
      timestamp = Time.now();
    };

    updateStudentProgress(caller, result);
  };

  // Get student dashboard data
  public query ({ caller }) func getStudentDashboard() : async StudentProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access dashboard");
    };

    switch (studentProgressStore.get(caller)) {
      case (?progress) { progress };
      case (null) { Runtime.trap("Student progress not found") };
    };
  };

  func updateStudentProgress(student : Principal, newResult : QuizResult) {
    let currentProgress = switch (studentProgressStore.get(student)) {
      case (?progress) { progress };
      case (null) {
        {
          studentPrincipal = student;
          quizHistory = [];
          bestScore = null;
          averagePercentage = 0.0;
          quizzesTaken = 0;
        };
      };
    };

    let updatedHistory = currentProgress.quizHistory.concat([newResult]);
    let updatedBestScore = switch (currentProgress.bestScore) {
      case (?best) {
        if (newResult.percentage > best.percentage) {
          ?newResult;
        } else { ?best };
      };
      case (null) { ?newResult };
    };

    let updatedAveragePercentage = if (updatedHistory.size() == 0) {
      0.0;
    } else {
      updatedHistory.map(func(r) { r.percentage }).foldLeft(0.0, func(acc, p) { acc + p }) / updatedHistory.size().toFloat();
    };

    let updatedProgress : StudentProgress = {
      studentPrincipal = student;
      quizHistory = updatedHistory;
      bestScore = updatedBestScore;
      averagePercentage = updatedAveragePercentage;
      quizzesTaken = updatedHistory.size();
    };

    studentProgressStore.add(student, updatedProgress);
  };

  func generateFeedback(percentage : Float) : Text {
    if (percentage >= 90.0) {
      "Excellent work!";
    } else if (percentage >= 80.0) { "Great job!" } else if (percentage >= 70.0) {
      "Good effort. Keep practicing!";
    } else if (percentage >= 60.0) {
      "Study a little more and try again.";
    } else {
      "Don't give up. Review the material and retake the quiz.";
    };
  };

  public query ({ caller }) func getDocumentMetadata(documentId : Text) : async DocumentMetadata {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access documents");
    };

    switch (documentMetadataStore.get(documentId)) {
      case (?metadata) {
        // Verify ownership: only the document owner or admins can access
        if (caller != metadata.associatedStudent and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only access your own documents");
        };
        metadata;
      };
      case (null) { Runtime.trap("Document metadata not found") };
    };
  };

  public query ({ caller }) func listStudentDocuments() : async [DocumentMetadata] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list documents");
    };

    let allDocs = documentMetadataStore.values().toArray();
    let studentDocs = allDocs.filter(
      func(doc) { doc.associatedStudent == caller }
    );
    studentDocs;
  };
};
