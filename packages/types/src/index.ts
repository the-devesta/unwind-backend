export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'CLIENT';
export type ProjectRole = 'PROJECT_MANAGER' | 'CONTRIBUTOR' | 'VIEWER' | 'CLIENT_APPROVER';
export type PlanTier = 'FREE' | 'STARTER' | 'TEAM';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceScopedEntity extends BaseEntity {
  workspaceId: string;
  createdBy: string;
}

export interface UserProfile extends BaseEntity {
  firebaseUid: string;
  email: string;
  name: string;
  avatarUrl?: string;
  defaultWorkspaceId?: string;
}

export interface Workspace extends BaseEntity {
  name: string;
  slug: string;
  ownerId: string;
  planTier: PlanTier;
  logoUrl?: string;
}

export interface Client extends WorkspaceScopedEntity {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'LEAD';
}

export interface Quotation extends WorkspaceScopedEntity {
  publicToken: string;
  clientId: string;
  title: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED';
}

export interface Contract extends WorkspaceScopedEntity {
  publicToken: string;
  quotationId?: string;
  title: string;
  clauses: string[];
  signatureData?: string;
  status: 'DRAFT' | 'SENT' | 'SIGNED' | 'EXPIRED';
}

export interface Invoice extends WorkspaceScopedEntity {
  publicToken: string;
  clientId: string;
  razorpayOrderId?: string;
  totalAmount: number;
  gstAmount: number;
  status: 'UNPAID' | 'PAID' | 'OVERDUE';
}
