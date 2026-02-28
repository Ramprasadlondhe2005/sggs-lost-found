export type UserRole = 'student' | 'guard' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  prn?: string;
  branch?: string;
  year?: number;
  phone?: string;
  avatar?: string;
}

export type ItemStatus = 'available' | 'claimed' | 'delivered';
export type ItemCategory = 'Electronics' | 'Documents' | 'Accessories' | 'Books' | 'Clothing' | 'Keys' | 'Other';

export interface LostItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  location: string;
  date: string;
  status: ItemStatus;
  image: string;
  reportedBy?: string;
}

export interface Claim {
  id: string;
  itemId: string;
  itemName: string;
  studentId: string;
  studentName: string;
  studentPrn: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'verified';
  date: string;
  verificationDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  date: string;
}
