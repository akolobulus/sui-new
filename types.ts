
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
  type: 'Device' | 'Health' | 'Travel' | 'Student Shield';
  name: string;
  coverageAmount: number;
  premium: number;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Pending';
  icon: string;
}

export interface Claim {
  id: string;
  policyId: string;
  policyName: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
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

export interface DrugVerificationResult {
  batchNumber: string;
  productName: string;
  manufacturer: string;
  expiryDate: string;
  status: 'Valid' | 'Fake' | 'Expired' | 'Unknown';
  scanTimestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface VaultItem {
  id: string;
  title: string;
  category: 'Identity' | 'Medical' | 'Legal' | 'Financial' | 'Other';
  dateAdded: string;
  fileSize: string;
  fileType: string;
  isEncrypted: boolean;
  cid?: string; // IPFS Content Identifier
}

export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  RECORDS = 'RECORDS',
  INSURANCE = 'INSURANCE',
  ASSISTANT = 'ASSISTANT',
  PROFILE = 'PROFILE',
  DRUG_VERIFY = 'DRUG_VERIFY',
  VAULT = 'VAULT',
}

export interface UserProfile {
  name: string;
  walletAddress: string;
  bloodType: string;
  allergies: string[];
  zkLoginProvider?: 'Google' | 'Apple';
}

export interface AccessRequest {
  id: string;
  doctorName: string;
  hospital: string;
  purpose: string;
  timestamp: Date;
}
