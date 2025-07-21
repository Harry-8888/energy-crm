# Energy CRM

A desktop-first CRM system designed specifically for energy industry sales teams. Built with React, TypeScript, and Tailwind CSS.

## Overview

Energy CRM helps sales teams manage leads, deals, contacts, and activities with energy-specific workflows and data structures. The system is optimized for energy industry professionals including sales representatives, sales managers, and business development teams.

## Features

### Current Implementation (Phase 1)
- ✅ **Dashboard**: Real-time metrics and pipeline overview
- ✅ **Contact Management**: Full CRUD operations for customer contacts
- ✅ **Company Management**: Track energy companies and relationships
- ✅ **Data Persistence**: LocalStorage-based data storage
- ✅ **Responsive Design**: Desktop-first with mobile compatibility
- ✅ **Industry-Specific**: Energy project types and deal stages

### Planned Features (Upcoming Phases)
- 🔄 Deal Pipeline Management
- 🔄 Activity Tracking & Calendar
- 🔄 Advanced Reporting & Analytics
- 🔄 Data Export/Import
- 🔄 Search & Filtering
- 🔄 User Authentication & Roles

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **Icons**: Lucide React
- **Data Storage**: localStorage (development)

## Energy Industry Specifics

### Project Types
- Solar (Residential, Commercial, Utility)
- Wind (Onshore, Offshore)
- Oil & Gas (Upstream, Midstream, Downstream)
- Energy Storage (Battery, Pumped Hydro)
- Grid Infrastructure
- Energy Efficiency

### Deal Stages
- Lead Generation → Qualification → Needs Analysis → Proposal Development → Negotiation → Contract Review → Closed Won/Lost

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Harry-8888/energy-crm.git
cd energy-crm
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Sidebar
│   ├── ui/              # Reusable UI components
│   └── views/           # Main application views
├── context/             # React Context providers
├── data/                # Mock data and constants
├── types/               # TypeScript type definitions
└── main.tsx             # Application entry point
```

## Data Model

The application manages four core entities:

- **Contacts**: Customer contact information with energy industry context
- **Companies**: Energy companies with industry segments and relationship status
- **Deals**: Energy projects with capacity, value, and pipeline stages
- **Activities**: Interactions, meetings, and sales activities

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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

### Phase 2: Core Features
- Complete Companies and Deals views
- Activity logging and management
- User switching functionality

### Phase 3: Advanced Pipeline
- Drag-and-drop deal stages
- Deal forecasting
- Advanced filtering
- Bulk operations

### Phase 4: Reporting & Analytics
- Interactive dashboards
- Pipeline reports
- Performance tracking
- Data visualization

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for the energy industry