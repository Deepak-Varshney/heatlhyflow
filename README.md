# HealthyFlow
## ERP Solution for Healthcare Management

HealthyFlow is a healthcare management ERP designed to streamline patient onboarding, appointments, doctor workflows, and OPD card generation. It provides a clear separation of responsibilities for receptionists and doctors while enforcing role-based access.

### Key Features

- **Patient Registration**: Create and manage patient profiles.
- **Appointment Management**: Book and track appointments for patients and doctors.
- **Doctor Workspace**:
  - View patient information and history
  - Prescribe medications via a guided UI
  - Add tests and dosage schedules with checkboxes and dropdowns
  - Finalize encounters and generate OPD cards
- **PDF Generation**: Generate and download OPD cards as PDFs.
- **Role-Based Access Control**: Enforce permissions for receptionists, doctors, and future roles.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **UI**: React, Tailwind CSS, ShadCN UI
- **Auth**: Clerk
- **Database**: MongoDB with Mongoose
- **Utilities**: Zod, React Hook Form, TanStack Table, jsPDF

---

## Requirements

- Node.js >= 18.17
- Package manager: pnpm (recommended), npm, or yarn
- MongoDB database (local or hosted)
- Clerk account for authentication (Publishable + Secret keys)

---

## Quick Start

1. Install dependencies
   - pnpm: `pnpm install`
   - npm: `npm install`
2. Create `.env.local` at the project root and configure the variables below
3. Start the dev server
   - pnpm: `pnpm dev`
   - npm: `npm run dev`
4. Open the app at `http://localhost:3000`

---

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority

# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Webhooks (if using the webhook at src/app/api/webhooks/clerk/route.ts)
CLERK_WEBHOOK_SECRET=whsec_...

# Optional: Sentry settings (left disabled by default)
# NEXT_PUBLIC_SENTRY_DISABLED=1
# NEXT_PUBLIC_SENTRY_ORG=your-org
# NEXT_PUBLIC_SENTRY_PROJECT=your-project
```

Notes:
- `MONGODB_URI` is required by `src/lib/mongodb.ts`.
- `CLERK_WEBHOOK_SECRET` is required to verify incoming Clerk webhooks.

---

## Scripts

All available scripts (see `package.json`):

- `dev`: Start Next.js dev server (Turbopack)
- `build`: Production build
- `start`: Start production server
- `lint`: Run Next.js ESLint
- `lint:fix`: Fix lint issues and format
- `lint:strict`: Lint with no warnings allowed
- `format`: Prettier write
- `format:check`: Prettier check

Examples:

```bash
pnpm dev
pnpm build && pnpm start
pnpm lint:fix
```

---

## Usage

- **Receptionist** can:
  - Register patients
  - Book appointments for patients
  - Download finalized OPD cards

- **Doctors** can:
  - View patient information
  - Prescribe medications from a curated list
  - Schedule tests and doses
  - Generate OPD card PDFs after completing treatment

---

## Project Structure (high level)

```
src/
  app/                 # Next.js routes (app router)
  components/          # Reusable UI components
  lib/                 # Database and helper libraries (e.g., mongodb)
  models/              # Mongoose models
public/                # Static assets
next.config.ts         # Next.js configuration
```

Key files:
- `src/lib/mongodb.ts`: Creates and caches the Mongoose connection using `MONGODB_URI`.
- `src/app/api/webhooks/clerk/route.ts`: Clerk webhook handler (requires `CLERK_WEBHOOK_SECRET`).

---

## Deployment

The app is well suited for deployment on platforms like Vercel.

1. Set environment variables in your hosting platform (see the Environment section).
2. Build the app: `pnpm build`
3. Start the app: `pnpm start` (Vercel handles this automatically for Next.js)
4. If using webhooks, configure the Clerk webhook URL to
   `https://<your-domain>/api/webhooks/clerk` and set the matching secret.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Future Enhancements

- **Multi-Vendor Support**: Multi-tenant capabilities with isolated data per vendor.
- **Reporting and Analytics**: Track appointments, treatments, and patient histories.
- **Advanced User Roles**: Admin role for user management and auditing.