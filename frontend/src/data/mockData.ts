import { LostItem, Claim, User, Notification } from '@/types';

export const mockItems: LostItem[] = [
  { id: '1', name: 'iPhone 14 Pro', description: 'Black iPhone 14 Pro with clear case, found near library entrance', category: 'Electronics', location: 'Library', date: '2024-12-10', status: 'available', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=200&fit=crop' },
  { id: '2', name: 'Student ID Card', description: 'SGGS ID card belonging to CS department student', category: 'Documents', location: 'Canteen', date: '2024-12-09', status: 'claimed', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=200&fit=crop' },
  { id: '3', name: 'HP Laptop Charger', description: '65W HP laptop charger with blue tip', category: 'Electronics', location: 'Computer Lab', date: '2024-12-08', status: 'available', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=200&fit=crop' },
  { id: '4', name: 'Ray-Ban Sunglasses', description: 'Black wayfarer style Ray-Ban sunglasses', category: 'Accessories', location: 'Sports Ground', date: '2024-12-07', status: 'delivered', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=200&fit=crop' },
  { id: '5', name: 'Engineering Mathematics Book', description: 'Higher Engineering Mathematics by B.S. Grewal, 44th edition', category: 'Books', location: 'Reading Hall', date: '2024-12-06', status: 'available', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop' },
  { id: '6', name: 'Blue Hoodie', description: 'Navy blue hoodie with SGGS logo, size L', category: 'Clothing', location: 'Auditorium', date: '2024-12-05', status: 'available', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=200&fit=crop' },
  { id: '7', name: 'Car Keys (Hyundai)', description: 'Hyundai car keys with black leather keychain', category: 'Keys', location: 'Parking Lot', date: '2024-12-04', status: 'claimed', image: 'https://images.unsplash.com/photo-1553729459-afe8f2e2ed65?w=300&h=200&fit=crop' },
  { id: '8', name: 'USB Flash Drive', description: '32GB SanDisk USB drive, red color', category: 'Electronics', location: 'Workshop', date: '2024-12-03', status: 'available', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=200&fit=crop' },
];

export const mockClaims: Claim[] = [
  { id: 'c1', itemId: '1', itemName: 'iPhone 14 Pro', studentId: 's1', studentName: 'Rahul Sharma', studentPrn: '2021CS101', reason: 'This is my phone, I lost it near the library on Dec 10th. I can show purchase receipt.', status: 'pending', date: '2024-12-11' },
  { id: 'c2', itemId: '2', itemName: 'Student ID Card', studentId: 's2', studentName: 'Priya Patel', studentPrn: '2022IT045', reason: 'This is my college ID card with my photo and PRN on it.', status: 'approved', date: '2024-12-10', verificationDate: '2024-12-12' },
  { id: 'c3', itemId: '7', itemName: 'Car Keys (Hyundai)', studentId: 's3', studentName: 'Amit Kumar', studentPrn: '2021ME078', reason: 'These are my car keys, the keychain has my initials AK engraved.', status: 'pending', date: '2024-12-05' },
];

export const mockUsers: User[] = [
  { id: 's1', name: 'Rahul Sharma', email: 'rahul@sggs.ac.in', role: 'student', prn: '2021CS101', branch: 'Computer Science', year: 3, phone: '9876543210' },
  { id: 's2', name: 'Priya Patel', email: 'priya@sggs.ac.in', role: 'student', prn: '2022IT045', branch: 'Information Technology', year: 2, phone: '9876543211' },
  { id: 'g1', name: 'Rajesh Security', email: 'guard1@sggs.ac.in', role: 'guard' },
  { id: 'a1', name: 'Admin User', email: 'admin@sggs.ac.in', role: 'admin' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Claim Submitted', message: 'Your claim for iPhone 14 Pro has been submitted successfully.', type: 'info', read: false, date: '2024-12-11' },
  { id: 'n2', title: 'Claim Approved', message: 'Your claim for Student ID Card has been approved! Visit the security office.', type: 'success', read: false, date: '2024-12-10' },
  { id: 'n3', title: 'New Item Found', message: 'A new item matching your lost report has been found.', type: 'info', read: true, date: '2024-12-09' },
  { id: 'n4', title: 'Verification Reminder', message: 'Please visit the security office to verify your claim by Dec 15.', type: 'warning', read: false, date: '2024-12-08' },
];

export const categories: string[] = ['All', 'Electronics', 'Documents', 'Accessories', 'Books', 'Clothing', 'Keys', 'Other'];
