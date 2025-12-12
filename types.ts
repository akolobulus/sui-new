// --- 1. Views/Pages (Merged) ---
export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  RECORDS = 'RECORDS',
  VAULT = 'VAULT',
  INSURANCE = 'INSURANCE',
  DRUG_VERIFY = 'DRUG_VERIFY',
  ASSISTANT = 'ASSISTANT',
  PROFILE = 'PROFILE',
  DOCTORS = 'DOCTORS',
  DATA_DAO = 'DATA_DAO',
  GUARDIANS = 'GUARDIANS' // ✅ Added
}

// --- 2. Medical Records ---
export interface Attachment {
  name: string;
  url: string;
  type: string;
}

export interface HealthRecord {
  id: string;
  type: 'Prescription' | 'Lab Result' | 'Vaccination' | 'Diagnosis' | 'Other' | string;
  date: string;
  doctor: string;
  hospital: string;
  details: string;
  verified: boolean;
  attachments?: Attachment[];
}

// --- 3. Insurance ---
export interface PolicyPlan {
  id: string;
  type: 'Device' | 'Health' | 'Travel' | 'Student Shield';
  name: string;
  description: string;
  coverageAmount: number;
  premium: number;
  durationDays: number;
  icon: string;
  color: string;
}

export interface InsurancePolicy {
  id: string;
  type: string;
  name: string;
  coverageAmount: number;
  premium: number;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Pending' | string;
  icon: string;
}

export interface Claim {
  id: string;
  policyId: string;
  policyName: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  amount: number;
}

export interface Device {
  id: string;
  name: string;
  type: 'Phone' | 'Laptop' | 'Bike' | 'Other';
  serialNumber: string;
  imei?: string;
  purchaseDate: string;
  value: number;
  isInsured: boolean;
  image?: string;
}

// --- 4. Drug Verification ---
export interface DrugVerificationResult {
  batchNumber: string;
  productName: string;
  manufacturer: string;
  expiryDate: string;
  status: 'Valid' | 'Fake' | 'Expired' | 'Unknown';
  scanTimestamp: Date;
  producerAddress?: string;
}

// --- 5. Chat/AI ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// --- 6. Secure Vault ---
export interface VaultItem {
  id: string;
  title: string;
  category: 'Identity' | 'Medical' | 'Legal' | 'Financial' | 'Other' | string;
  dateAdded: string;
  fileSize: string;
  fileType: string;
  isEncrypted: boolean;
  cid?: string;
}

// --- 7. User Profile ---
export interface UserProfile {
  name: string;
  walletAddress: string;
  bloodType: string;
  allergies: string[];
  zkLoginProvider?: 'Google' | 'Apple';
}

// --- 8. Access Requests ---
export interface AccessRequest {
  id: string;
  requester?: string;
  doctorName: string;
  hospital?: string;
  purpose: string;
  status?: number;
  timestamp?: Date;
}