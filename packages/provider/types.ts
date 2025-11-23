export enum RegistrationStatus {
  Draft = 'DRAFT',
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED'
}

export enum DocType {
  GovtID = 'GOVT_ID',
  PAN = 'PAN',
  BankDetails = 'BANK_DETAILS',
  Selfie = 'SELFIE'
}

export interface ProviderDocument {
  type: DocType;
  file?: File;
  previewUrl?: string;
  status: 'empty' | 'uploading' | 'uploaded' | 'analyzing' | 'verified' | 'error';
  extractedData?: Record<string, any>;
  error?: string;
  source?: 'manual' | 'digilocker';
}

export interface ProviderProfile {
  phoneNumber: string;
  isPhoneVerified: boolean;
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  city: string;
  locality: string;
  documents: Record<DocType, ProviderDocument>;
  guidelinesAccepted: boolean;
  registrationStatus: RegistrationStatus;
}

export interface StepProps {
  data: ProviderProfile;
  updateData: (updates: Partial<ProviderProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}