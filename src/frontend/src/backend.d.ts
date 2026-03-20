import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LessonExample {
    id: string;
    solution: string;
    problem: string;
}
export interface Lesson {
    id: string;
    title: string;
    explanation: string;
    examples: Array<LessonExample>;
    topicId: string;
}
export interface QuizResult {
    total: bigint;
    score: bigint;
    timestamp: bigint;
    topicId: string;
}
export interface MathTopic {
    id: string;
    title: string;
    icon: string;
    color: string;
    description: string;
}
export interface UserProgress {
    questionsAnswered: bigint;
    correctAnswers: bigint;
    quizHistory: Array<QuizResult>;
    startedTopics: Array<string>;
}
export interface UserProfile {
    name: string;
}
export interface PracticeQuestion {
    id: string;
    correctOption: bigint;
    question: string;
    explanation: string;
    options: Array<string>;
    topicId: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllTopics(): Promise<Array<MathTopic>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLessonsForTopic(topicId: string): Promise<Array<Lesson>>;
    getPracticeQuestionsForTopic(topicId: string): Promise<Array<PracticeQuestion>>;
    getQuizQuestions(topicId: string): Promise<Array<PracticeQuestion>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProgress(userId: Principal): Promise<UserProgress>;
    isCallerAdmin(): Promise<boolean>;
    markTopicStarted(topicId: string): Promise<void>;
    recordQuizResult(topicId: string, score: bigint, total: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedBackend(): Promise<void>;
    submitAnswer(questionId: string, selectedOption: bigint): Promise<boolean>;
}
