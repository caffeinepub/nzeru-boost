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
export interface ExtendedDocumentMetadata {
    id: string;
    fileName: string;
    associatedStudent: Principal;
    examinationBoard?: string;
    blobId: string;
    uploadDate: Time;
    format: DocumentFormat;
}
export interface StudentProgress {
    studentPrincipal: Principal;
    bestScore?: QuizResult;
    averagePercentage: number;
    quizzesTaken: bigint;
    quizHistory: Array<QuizResult>;
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
export enum DocumentFormat {
    doc = "doc",
    pdf = "pdf",
    txt = "txt",
    docx = "docx"
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
    getDocumentMetadata(documentId: string): Promise<ExtendedDocumentMetadata>;
    getStudentDashboard(): Promise<StudentProgress>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listStudentDocuments(): Promise<Array<ExtendedDocumentMetadata>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitQuizResults(quizId: string, correctAnswers: bigint, totalQuestions: bigint): Promise<void>;
    uploadDocument(id: string, fileName: string, blobId: string, format: DocumentFormat, examinationBoard: string | null): Promise<void>;
}
