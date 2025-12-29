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
  reminders?: Reminder[];
  user?: {
    name?: string | null;
    image?: string | null;
  };
}

export interface Goal {
  id: string;
  text: string;
  expectedDate: string;
  status: "pending" | "in-progress" | "completed";
}

export interface Reminder {
  id: string;
  type:
    | "on_unlock"
    | "week_before"
    | "month_before"
    | "custom"
    | "recurring_monthly";
  customDays?: number;
  enabled: boolean;
  lastSent?: string;
  nextSend?: string;
  capsuleId: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export interface CapsuleFormData {
  title: string;
  description: string;
  unlockDate: string;
  isPublic: boolean;
  goals: Goal[];
  reminders?: Omit<Reminder, "id" | "capsuleId" | "lastSent" | "nextSend">[];
}
