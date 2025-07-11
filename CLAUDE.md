# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 13+ event management application for "Congreso Nacional de Marketing Político Colombia" (CNMP 2025). The application handles event ticket sales, attendee management, payment processing, and admin functionality for a political marketing congress.

## Development Commands

```bash
# Development server
yarn dev
# or
npm run dev

# Build for production
yarn build
# or
npm run build

# Start production server
yarn start
# or
npm run start

# Lint code
yarn lint
# or
npm run lint
```

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Chakra UI components
- **Database**: MySQL (serverless connection)
- **Authentication**: JWT with middleware protection
- **State Management**: React Context (Auth + Cart)
- **Payment Integration**: Wompi payment gateway
- **PDF Generation**: pdf-lib for ticket generation
- **QR Codes**: qrcode library for ticket verification

### Directory Structure

#### Core Application (`src/app/`)
- **App Router**: Next.js 13+ routing structure
- **Pages**: Public pages (landing, ticket purchase flow, checkout)
- **Admin Pages**: Protected admin dashboard (`/admin/*`)
- **API Routes**: Located in `pages/api/` (legacy structure for API)

#### Components (`src/components/`)
- **Layout Components**: Navbar, Footer, Layout wrapper
- **Ticket Components**: Cart, ticket selection, quantity selection, maps
- **Admin Components**: Dashboard, modals, forms
- **UI Components**: Form inputs, tooltips, carousels

#### Context & State (`src/context/`)
- **AuthContext**: JWT authentication state management
- **CartContext**: Shopping cart with localStorage persistence

#### Database & Services (`pages/api/`)
- **Database**: `db.js` - MySQL connection utility
- **Auth**: Login/register endpoints
- **Tickets**: CRUD operations for ticket management
- **Wompi**: Payment webhook integration

#### Types (`src/types/`)
- **tickets.tsx**: Core ticket, cart, and seat management types
- **lecturer.ts**: Speaker/lecturer management types
- **user.tsx**: User authentication types

### Key Features

#### Ticket Management System
- Multiple ticket types: Diamond, VIP, General, Streaming
- Optional "memories" add-on (except for Diamond which includes it)
- Shopping cart with persistent storage
- Seat selection and mapping
- PDF ticket generation with QR codes

#### Payment Processing
- Wompi payment gateway integration
- Webhook handling for payment confirmations
- Reference-based transaction tracking

#### Admin Dashboard
- JWT-protected admin routes via middleware
- Ticket management (CRUD operations)
- Lecturer management
- Dashboard analytics

#### Authentication & Security
- JWT token management with httpOnly cookies
- Middleware protection for admin routes
- User session persistence across page refreshes

## Development Notes

### Database Configuration
MySQL connection requires environment variables:
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET`

### Payment Integration
Wompi webhook endpoint: `/api/wompi/events.ts`
Requires proper webhook signature validation for production.

### Ticket Types Enum
```typescript
enum TicketType {
  DIAMOND = 'diamond',
  VIP = 'vip', 
  GENERAL = 'general',
  STREAMING = 'streaming'
}
```

### Key Business Logic
- Diamond tickets include memories by default
- Other ticket types can add memories for additional cost
- Cart persists in localStorage
- Tickets generate unique UUIDs and QR codes
- Admin middleware protects all `/admin/*` routes

### Event Configuration
- Event date: August 1-2, 2025
- Location: Cartagena, Colombia
- Countdown timer on landing page
- Facebook domain verification included