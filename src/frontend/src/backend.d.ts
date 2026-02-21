import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface StudentProgress {
    studentPrincipal: Principal;
    bestScore?: QuizResult;
    averagePercentage: number;
    quizzesTaken: bigint;
    quizHistory: Array<QuizResult>;
}
export interface DocumentMetadata {
    id: string;
    fileName: string;
    associatedStudent: Principal;
    blobId: string;
    uploadDate: Time;
}
export interface QuizResult {
    feedback: string;
    score: bigint;
    totalQuestions: bigint;
    grade: string;
    correctAnswers: bigint;
    timestamp: bigint;
    quizId: string;
    percentage: number;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDocumentMetadata(documentId: string): Promise<DocumentMetadata>;
    getStudentDashboard(): Promise<StudentProgress>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listStudentDocuments(): Promise<Array<DocumentMetadata>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitQuizResults(quizId: string, correctAnswers: bigint, totalQuestions: bigint): Promise<void>;
    uploadDocument(id: string, fileName: string, blobId: string): Promise<void>;
}
