# AssetFlow - Enterprise Asset Resource Management System

## Project Overview
AssetFlow is a full-stack web application designed for enterprise asset and resource management.

## Architecture
The system is divided into two main components:
- **Frontend**: A Next.js (React) application.
- **Backend**: A Node.js Express server connected to a PostgreSQL database.

## Tech Stack
### Frontend
- **Framework**: Next.js (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI)
- **Icons**: Lucide React
- **Form Management**: React Hook Form
- **Validation**: Zod
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Package Manager**: Bun

### Backend
- **Framework**: Express.js
- **Language**: JavaScript (Node.js)
- **Database**: PostgreSQL (pg)
- **Environment**: dotenv

## Development Guidelines
- **Frontend Design**: Follow the established design system and component patterns detailed in `design.md`.
- **Styling**: Prefer Tailwind utility classes.
- **State**: Use Zustand for global state and React Hook Form for form state.
- **Component Architecture**: Keep components modular, accessible, and aligned with Shadcn UI standards.
