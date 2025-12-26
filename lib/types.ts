export interface Capsule {
  id: string;
  title: string;
  description: string;
  unlockDate: string;
  userId: string;
  createdAt: string;
  isPublic: boolean;
  status?: "locked" | "unlocked";
  goals?: Goal[];
}

export interface Goal {
  id: string;
  text: string;
  expectedDate: string;
  status: "pending" | "in-progress" | "completed";
}

export interface User {
  uid: string;
  email?: string;
  username?: string;
}

export interface CapsuleFormData {
  title: string;
  description: string;
  unlockDate: string;
  isPublic: boolean;
  goals: Goal[];
}
