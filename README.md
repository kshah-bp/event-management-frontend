# Event Management System 

## What Was Built

### 1. Complete Frontend Application Structure
```
event-management-next/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin panel (protected)
│   ├── events/                   # Event listing & detail
│   ├── dashboard/                # User dashboard
│   ├── my-registrations/         # Registration list
│   ├── profile/                  # Profile management
│   ├── login/                    # Authentication
│   ├── signup/                   # Registration
│   └── providers.tsx             # Redux provider
├── components/                   # Reusable UI components
│   ├── ui/                       # UI primitives (11 components)
│   └── layout/                   # Layout components
├── features/                     # Redux slices (6)
├── services/                     # API layer (7 services)
├── hooks/                        # Custom hooks
├── routes/                       # Centralized routing
├── store/                        # Redux store
├── types/                        # TypeScript types
└── lib/                          # Utilities
```

## Key Features

### User Panel
- Browse events with search/filter
- Register for events with availability checks
- View all registrations with status
- Edit profile information
- Responsive card/table layouts

### Admin Panel
- Dashboard with statistics
- Manage users (CRUD + role assignment)
- Manage events (Full CRUD)
- Manage global settings (inline editing)
- Manage pricing rules (CRUD + enable/disable)
- Modal-based editing
- Confirmation dialogs

## Technical Highlights

### Architecture
- **Clean separation** of concerns (UI, State, API, Routes)
- **Type-safe** throughout with TypeScript
- **Reusable components** with composition
- **Centralized configuration** (routes, API, types)

## API Endpoints Used

All consuming the NestJS backend:

**Auth:** `POST /auth/login`, `POST /auth/signup`  
**Users:** `GET/POST/PATCH/DELETE /users`  
**Events:** `GET/POST/PATCH/DELETE /events`, `GET /events/:id/price`, `POST /events/:id/register`  
**Registrations:** `GET /registrations/my`, `POST /registrations/:id/confirm`  
**Settings:** `GET/POST /admin/settings`, `GET/POST /admin/settings/:key`  
**Pricing:** `GET/POST/PATCH/DELETE /admin/pricing-rules`, `PATCH /admin/pricing-rules/:id/:active`

## Scripts Available

```bash
npm run dev          # Start dev server (http://localhost:3001)
npm run build        # Production build
npm run start        # Start production
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```


