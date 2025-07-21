// Core data types for Energy CRM

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'sales_rep' | 'sales_manager' | 'business_dev';
  territory: string;
  avatar?: string;
  active: boolean;
  lastLogin?: Date;
}

export interface Company {
  id: string;
  name: string;
  type: 'utility' | 'developer' | 'epc' | 'manufacturer' | 'consultant' | 'government';
  industrySegment: 'solar' | 'wind' | 'oil_gas' | 'storage' | 'grid' | 'efficiency';
  location: {
    city: string;
    state: string;
    country: string;
  };
  territory: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  revenue?: number;
  primaryContactId?: string;
  relationshipStatus: 'prospect' | 'active' | 'inactive' | 'competitor';
  createdDate: Date;
  lastContactDate?: Date;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  companyId: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  territory: string;
  assignedUserId: string;
  status: 'active' | 'inactive' | 'do_not_contact';
  createdDate: Date;
  lastContactDate?: Date;
  notes?: string;
}

export interface Deal {
  id: string;
  name: string;
  companyId: string;
  contactId: string;
  projectType: 'solar_residential' | 'solar_commercial' | 'solar_utility' | 'wind_onshore' | 'wind_offshore' | 'oil_gas_upstream' | 'oil_gas_midstream' | 'oil_gas_downstream' | 'energy_storage' | 'grid_infrastructure' | 'energy_efficiency';
  capacity?: number; // MW or other unit
  location: {
    city: string;
    state: string;
    country: string;
  };
  value: number;
  probability: number; // 0-100
  stage: 'lead' | 'qualification' | 'needs_analysis' | 'proposal' | 'negotiation' | 'contract_review' | 'closed_won' | 'closed_lost';
  closeDate: Date;
  assignedUserId: string;
  createdDate: Date;
  lastActivityDate?: Date;
  notes?: string;
}

export interface Activity {
  id: string;
  type: 'phone_call' | 'email' | 'meeting' | 'site_visit' | 'proposal_submission' | 'technical_review' | 'contract_discussion';
  subject: string;
  description: string;
  contactId?: string;
  dealId?: string;
  userId: string;
  date: Date;
  duration?: number; // minutes
  outcome?: 'positive' | 'neutral' | 'negative';
  nextSteps?: string;
  followUpDate?: Date;
  createdDate: Date;
}

export interface CRMState {
  users: User[];
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export type CRMAction = 
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'ADD_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY'; payload: Company }
  | { type: 'DELETE_COMPANY'; payload: string }
  | { type: 'ADD_DEAL'; payload: Deal }
  | { type: 'UPDATE_DEAL'; payload: Deal }
  | { type: 'DELETE_DEAL'; payload: string }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_ACTIVITY'; payload: Activity }
  | { type: 'DELETE_ACTIVITY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_DATA'; payload: Partial<CRMState> };