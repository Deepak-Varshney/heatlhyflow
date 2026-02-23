# Implementation Plan

## Objectives
- Restructure routes to: public landing, unauth layout, onboarding, dashboard (role-based), and superadmin.
- Redesign dashboard and superadmin UI with reusable shadcn components, glassmorphism + primary gradient cards.
- Use server actions and utilities for data access; avoid API routes unless required by external services.
- Use a custom sign-in form (no Clerk UI) and store organization data in MongoDB.
- Use Clerk only for auth + session claims public metadata (organizationId, role, phone, address, etc.).
- Implement onboarding flow with time inputs and tag-based specialties.
- Add transactional emails (onboarding request, approval/rejection, appointment status updates).
- Add WhatsApp notifications via Twilio for appointment creation and status changes.

## Phase 0: Ground Rules
- Keep public pages under a dedicated unauth layout.
- Use server actions for CRUD; only use API routes for external webhooks or third-party callbacks.
- Centralize permission checks in server utilities.
- Store organizations (clinics) in MongoDB and treat Clerk orgs as out of scope.
- Keep Clerk usage limited to auth + public metadata for session claims.

## Phase 1: Route and Layout Restructure
1. Create a new unauth layout:
   - File: src/app/(public)/layout.tsx
   - Wraps landing, onboarding, sign-in.
   - Includes a universal public header (theme + dark mode selector).
2. Move landing to src/app/(public)/page.tsx.
3. Move onboarding to src/app/(public)/onboarding/page.tsx and success page to src/app/(public)/onboarding/success/page.tsx.
4. Keep sign-in catch-all at src/app/(public)/auth/sign-in/[[...sign-in]]/page.tsx using the custom sign-in page.
5. Keep protected app routes:
   - src/app/dashboard/... (role-aware)
   - src/app/superadmin/...

## Phase 2: Role-Based Dashboard Architecture
1. Introduce route groups for dashboards:
   - src/app/dashboard/(doctor)/...
   - src/app/dashboard/(receptionist)/...
2. Create a shared dashboard shell:
   - src/app/dashboard/layout.tsx
   - Includes main nav, breadcrumb, and PageContainer.
3. Role gate in dashboard layout:
   - Server action or server utility reads role from session.
   - Render role-specific entry page.
4. Define permissions matrix:
   - Superadmin: full CRUD + permanent deletes.
   - Doctor: full medical records, appointments, prescriptions.
   - Receptionist: limited patient and appointment operations.

## Phase 3: Superadmin Redesign
1. Create reusable card components:
   - Glassmorphism card with gradient border using theme primary.
   - Stats card with icon + trend.
2. Superadmin home layout:
   - Summary metrics, pending onboarding requests, recent activity.
3. CRUD tools:
   - Users, organizations, appointments, treatments.
   - Permanent delete actions with confirmation.

## Phase 4: Dashboard Redesign
1. Doctor dashboard:
   - Today schedule, patient queue, quick actions.
2. Receptionist dashboard:
   - Appointment management, check-in flow, basic patient info.
3. Shared components:
   - Metric cards, activity feed, calendar list.

## Phase 5: Onboarding UX Enhancements
1. Operating hours:
   - Use shadcn time picker or select-based time range.
2. Specialties:
   - Input with auto-tag conversion.
   - Stored as array in MongoDB.
3. Form layout:
   - Full-width with PageContainer and scroll support.
   - Public header only.

## Phase 6: Email Templates
1. Create HTML email templates:
   - Onboarding request received.
   - Approval.
   - Rejection.
   - Appointment status updates.
2. Include footer and consistent branding.

## Phase 7: WhatsApp Notifications (Twilio)
1. Add Twilio client util in src/lib/twilio.ts.
2. Server actions trigger WhatsApp messages:
   - Appointment created.
   - Appointment status updated.

## Phase 8: Data Access and Server Actions
1. Ensure server actions exist for:
   - Onboarding requests (create, approve, reject).
   - Appointments (create, update status).
   - Organization and user management.
2. Centralize permission checks in src/lib/permissions.ts.
3. Maintain a single source of truth for organization data in MongoDB; only mirror the org ID in Clerk metadata.

## Phase 9: Cleanup and Validation
1. Remove unused API routes where server actions cover functionality.
2. Validate models and indexes (no duplicates).
3. Check role-based routing and permissions.

## Deliverables
- New route structure with public layout and role-based dashboards.
- Redesigned dashboard and superadmin UIs.
- Onboarding form updates for time and specialties tags.
- Email templates and Twilio WhatsApp notifications.
- Server actions and permission utilities.

## Open Questions
- Preferred time picker component if you already use a specific shadcn add-on?
- Confirm the exact permission matrix details for doctor/receptionist actions.
- Confirm which pages should show the public header vs. no header.
