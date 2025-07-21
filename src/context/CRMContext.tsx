import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CRMState, CRMAction } from '../types';
import { mockUsers, mockCompanies, mockContacts, mockDeals, mockActivities } from '../data/mockData';

const initialState: CRMState = {
  users: [],
  companies: [],
  contacts: [],
  deals: [],
  activities: [],
  currentUser: null,
  loading: false,
  error: null,
};

function crmReducer(state: CRMState, action: CRMAction): CRMState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        ),
      };
    
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload),
      };
    
    case 'ADD_COMPANY':
      return { ...state, companies: [...state.companies, action.payload] };
    
    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map(company =>
          company.id === action.payload.id ? action.payload : company
        ),
      };
    
    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(company => company.id !== action.payload),
      };
    
    case 'ADD_DEAL':
      return { ...state, deals: [...state.deals, action.payload] };
    
    case 'UPDATE_DEAL':
      return {
        ...state,
        deals: state.deals.map(deal =>
          deal.id === action.payload.id ? action.payload : deal
        ),
      };
    
    case 'DELETE_DEAL':
      return {
        ...state,
        deals: state.deals.filter(deal => deal.id !== action.payload),
      };
    
    case 'ADD_ACTIVITY':
      return { ...state, activities: [...state.activities, action.payload] };
    
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload.id ? action.payload : activity
        ),
      };
    
    case 'DELETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter(activity => activity.id !== action.payload),
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

const CRMContext = createContext<{
  state: CRMState;
  dispatch: React.Dispatch<CRMAction>;
} | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem('energy-crm-data');
    if (savedData) {
      try {
        JSON.parse(savedData);
        // Clear old data and use updated mock data
        localStorage.removeItem('energy-crm-data');
        dispatch({
          type: 'LOAD_DATA',
          payload: {
            users: mockUsers,
            companies: mockCompanies,
            contacts: mockContacts,
            deals: mockDeals,
            activities: mockActivities,
            currentUser: mockUsers[0],
          },
        });
      } catch (error) {
        console.error('Failed to load saved data:', error);
        // Load mock data if saved data is corrupted
        dispatch({
          type: 'LOAD_DATA',
          payload: {
            users: mockUsers,
            companies: mockCompanies,
            contacts: mockContacts,
            deals: mockDeals,
            activities: mockActivities,
            currentUser: mockUsers[0],
          },
        });
      }
    } else {
      // Load mock data for first time
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          users: mockUsers,
          companies: mockCompanies,
          contacts: mockContacts,
          deals: mockDeals,
          activities: mockActivities,
          currentUser: mockUsers[0],
        },
      });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (state.users.length > 0) {
      const dataToSave = {
        users: state.users,
        companies: state.companies,
        contacts: state.contacts,
        deals: state.deals,
        activities: state.activities,
        currentUser: state.currentUser,
      };
      localStorage.setItem('energy-crm-data', JSON.stringify(dataToSave));
    }
  }, [state]);

  return (
    <CRMContext.Provider value={{ state, dispatch }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}