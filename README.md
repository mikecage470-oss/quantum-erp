# Quantum ERP

A modern, frontend-only Enterprise Resource Planning (ERP) system built with React, Vite, and TailwindCSS.

## Features

- **Dashboard**: Overview with key metrics and statistics
- **Vendors Management**: Track and manage vendor relationships
- **Customers Management**: Manage customer data and relationships
- **Purchase Orders**: Create and track purchase orders
- **Invoices**: Generate and manage invoices
- **Order Tracking**: Advanced order tracking with 60+ columns using TanStack Table
- **Settings**: Configure system preferences

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **TanStack Table**: Powerful table and data grid
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **XLSX**: Excel export functionality

## Key Features

- ✅ Modern, responsive UI with blue-themed professional design
- ✅ LocalStorage persistence for data
- ✅ CSV/Excel export capabilities
- ✅ Advanced filtering and column visibility
- ✅ ShadCN UI components for consistency
- ✅ Complete CRUD operations for all modules
- ✅ No backend required - runs entirely in the browser

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
quantum-erp/
├── src/
│   ├── components/
│   │   ├── customers/        # Customer-related components
│   │   ├── dashboard/        # Dashboard widgets
│   │   ├── invoices/         # Invoice components
│   │   ├── layout/           # Layout components (Sidebar, TopBar)
│   │   ├── order-tracking/   # Order tracking components
│   │   ├── purchase-orders/  # PO components
│   │   ├── ui/               # Reusable UI components (ShadCN)
│   │   └── vendors/          # Vendor components
│   ├── config/               # Configuration files
│   ├── data/                 # Mock data (JSON)
│   ├── lib/                  # Utility functions
│   ├── pages/                # Page components
│   ├── stores/               # Zustand stores
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Usage

1. **Dashboard**: View key metrics and system overview
2. **Vendors**: Add, edit, and manage vendor information
3. **Customers**: Manage customer database
4. **Purchase Orders**: Create POs, track status, and manage approvals
5. **Invoices**: Generate invoices and track payments
6. **Order Tracking**: Monitor orders with advanced filtering and export options
7. **Settings**: Customize system preferences

## Data Persistence

All data is stored in browser's LocalStorage, ensuring your data persists between sessions without requiring a backend.

## Export Features

- Export tables to CSV format
- Export to Excel (XLSX) format
- Customizable column selection for exports

## License

MIT

## Author

Quantum ERP Development Team
