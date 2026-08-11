import { Timestamp } from "firebase-admin/firestore";

export interface UserDoc {
    uid: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    provider_id: string;
    plan: "free" | "pro";
    account_type: "user" | "admin";
    onboarding_completed: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp | null;
}

export interface UserDocResponse extends Omit<UserDoc, "createdAt" | "updatedAt"> {
    createdAt: string;
    updatedAt: string | null;
}