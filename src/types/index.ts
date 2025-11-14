import { Timestamp } from 'firebase/firestore';

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  createdAt: Timestamp | Date;
}

// Status Enums
export enum AssignmentStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum PortionType {
  EQUAL = 'equal',
  AMOUNT = 'amount',
  PERCENT = 'percent',
}

// Bill Types
export interface Bill {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  bankName: string;
  accountNumber: string;
  accountOwner: string;
  createdAt: Timestamp | Date;
}

export interface BillItem {
  id: string;
  billId: string;
  name: string;
  amount: number;
  createdAt: Timestamp | Date;
}

export interface Assignment {
  id: string;
  billId: string;
  itemId: string;
  userId: string;
  status: AssignmentStatus;
  portionType: PortionType;
  portionValue: number | null;
  createdAt: Timestamp | Date;
}

export interface ActivityLog {
  id: string;
  billId: string;
  userId: string | null;
  action: string;
  metadata: Record<string, unknown>;
  createdAt: Timestamp | Date;
}

// Extended types with relations
export interface BillWithItems extends Bill {
  items: BillItem[];
  creator: User;
}

export interface BillItemWithAssignments extends BillItem {
  assignments: AssignmentWithUser[];
}

export interface AssignmentWithUser extends Assignment {
  user: User;
}

export interface ActivityLogWithUser extends ActivityLog {
  user: User | null;
}

// Form Types
export interface CreateBillFormData {
  title: string;
  description: string;
  bankName: string;
  accountNumber: string;
  accountOwner: string;
  items: {
    name: string;
    amount: number;
  }[];
}

export interface CreateAssignmentFormData {
  userId: string;
  portionType: PortionType;
  portionValue?: number;
}

// Summary Types
export interface BillSummary {
  totalAmount: number;
  userAmounts: {
    userId: string;
    userName: string;
    amount: number;
    status: AssignmentStatus;
  }[];
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

