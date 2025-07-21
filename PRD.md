# Energy CRM - Product Requirements Document

---
project_name: Energy CRM
version: 1.0
created_date: 2025-01-27
industry: Energy
target_users: 20
deployment_type: Client-only
primary_focus: Sales Management
---

## Executive Summary

A desktop-first CRM system designed specifically for energy industry sales teams. The system will manage leads, deals, contacts, and activities with energy-specific workflows and data structures.

## User Stories

### Core User Personas
- **Sales Representative**: Manages leads, deals, and customer relationships
- **Sales Manager**: Oversees team performance and pipeline health
- **Business Development**: Identifies and qualifies new opportunities

### Epic 1: Contact Management
- As a sales rep, I want to create and manage contacts with energy company details
- As a sales rep, I want to track multiple contacts within the same organization
- As a sales rep, I want to see contact interaction history and preferences
- As a sales manager, I want to see team contact assignments and activities

### Epic 2: Deal Pipeline Management
- As a sales rep, I want to create deals with energy project specifics (type, capacity, location)
- As a sales rep, I want to move deals through customizable pipeline stages
- As a sales rep, I want to set deal values, timelines, and probability
- As a sales manager, I want to view pipeline health and forecasting

### Epic 3: Activity Tracking
- As a sales rep, I want to log calls, emails, meetings, and site visits
- As a sales rep, I want to schedule follow-up activities and reminders
- As a sales rep, I want to track proposal submissions and responses
- As a sales manager, I want to see team activity summaries

### Epic 4: Reporting & Analytics
- As a sales manager, I want to see pipeline reports and conversion metrics
- As a sales rep, I want to see my personal performance dashboard
- As a business development, I want to track lead sources and quality metrics

## Technical Requirements

### System Architecture
```yaml
architecture:
  type: Single Page Application (SPA)
  framework: React + TypeScript + Vite
  styling: Tailwind CSS
  state_management: React Context + useReducer
  data_persistence: localStorage
  icons: Lucide React
  responsive: Desktop-first (1024px+)
```

### Data Model
```yaml
entities:
  contacts:
    - id, name, title, email, phone
    - company_name, company_type, industry_segment
    - location, territory, assigned_user
    - created_date, last_contact_date, status
    
  companies:
    - id, name, type, industry_segment
    - location, territory, size, revenue
    - primary_contact, relationship_status
    
  deals:
    - id, name, company_id, contact_id
    - project_type, capacity, location
    - value, probability, stage, close_date
    - assigned_user, created_date, last_activity
    
  activities:
    - id, type, subject, description
    - contact_id, deal_id, user_id
    - date, time, duration, outcome
    - next_steps, follow_up_date
    
  users:
    - id, name, email, role, territory
    - avatar, active_status, last_login
```

### Energy Industry Specifics
```yaml
energy_project_types:
  - Solar (Residential, Commercial, Utility)
  - Wind (Onshore, Offshore)
  - Oil & Gas (Upstream, Midstream, Downstream)
  - Energy Storage (Battery, Pumped Hydro)
  - Grid Infrastructure
  - Energy Efficiency

deal_stages:
  - Lead Generation
  - Qualification
  - Needs Analysis
  - Proposal Development
  - Negotiation
  - Contract Review
  - Closed Won/Lost

activity_types:
  - Phone Call
  - Email
  - Meeting
  - Site Visit
  - Proposal Submission
  - Technical Review
  - Contract Discussion
```

## Implementation Phases

### Phase 1: Foundation (Current)
- ✅ PRD Creation
- ✅ Data Model Design
- ✅ Component Library Setup
- ✅ State Management Architecture
- ✅ Mock Data Generation
- ✅ Basic Navigation & Layout

### Phase 2: Core Features (Next)
- Contact Management (CRUD operations)
- Company Management
- Basic Deal Pipeline
- Activity Logging
- User Switching

### Phase 3: Advanced Pipeline
- Drag-and-drop deal stages
- Deal forecasting
- Advanced filtering
- Activity scheduling
- Bulk operations

### Phase 4: Reporting & Analytics
- Dashboard with key metrics
- Pipeline reports
- Activity summaries
- Performance tracking
- Data visualization

## Success Metrics

### User Adoption
- 90% of sales team actively using within 30 days
- Average 2+ hours daily usage per user
- 95% user satisfaction score

### Business Impact
- 25% reduction in deal cycle time
- 20% increase in deal conversion rate
- 100% visibility into sales pipeline
- 50% reduction in lost opportunities

## Design Principles

### Desktop-First Approach
- Multi-panel layouts for efficient data entry
- Keyboard shortcuts for power users
- Rich data tables with sorting/filtering
- Context menus and bulk operations

### Energy Industry UX
- Project-focused deal structure
- Location-based organization
- Long-term relationship tracking
- Technical specification management

### Professional Aesthetics
- Clean, modern B2B design
- Consistent color scheme and typography
- Intuitive navigation patterns
- Responsive feedback and loading states