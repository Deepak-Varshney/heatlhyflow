# Quick Start Guide - Dashboard Redesign

## What Was Changed

### 🎯 Key Accomplishments
1. ✅ **Role-Based Navigation** - Doctors, Receptionists, and Admins see different menu items
2. ✅ **Real-Time Dashboard Stats** - Live KPIs instead of mock data
3. ✅ **Team Management** - Invite/remove team members with full org isolation
4. ✅ **Organization Filtering** - All data queries enforce orgId boundaries
5. ✅ **Professional UI** - Industry-standard components and error handling

---

## How to Test

### Test 1: Role-Based Navigation
```bash
1. Login as Doctor role
   → See: Dashboard, Patients, Appointments, Team menu
   
2. Login as Receptionist role  
   → See: Same menu as Doctor (same org routes)
   
3. Login as SuperAdmin role
   → See: Dashboard, Users, Organizations, Subscriptions
```

### Test 2: Real Dashboard Stats
```bash
1. Go to /dashboard/overview as Doctor
   → "Today's Appointments" shows real count from database
   → "Patients Waiting" shows today's scheduled appointments
   → Stats update when appointments created/completed
   
2. Go to /dashboard/overview as Receptionist
   → "Today's Check-ins" shows real count
   → "Upcoming Visits" shows all scheduled appointments
```

### Test 3: Team Management
```bash
1. Go to /dashboard/organization
2. Click "Invite Team Member"
3. Fill form:
   - First Name: "John"
   - Last Name: "Doe"  
   - Email: "john@example.com"
   - Role: "Doctor" or "Receptionist"
4. Click "Send Invite"
   → Success toast appears
   → Member shows in list with PENDING status
   
5. Click action menu on member
   → "Remove" option available
   → Clicking shows confirmation dialog
```

### Test 4: Organization Isolation
```bash
1. Create patient in Clinic A
2. Login to Clinic B (different organization)
3. Go to /dashboard/patients
   → Clinic A's patient is NOT visible
   → Only Clinic B's patients show
```

---

## File Structure

```
src/
├── actions/
│   ├── dashboard-stats-actions.ts      ← NEW: Real-time KPI aggregations
│   ├── team-actions.ts                 ← NEW: Team management CRUD
│   ├── patient-actions.ts              ✓ Org-filtered
│   └── appointment-actions.ts          ✓ Org-filtered
│
├── components/
│   ├── invite-team-member-dialog.tsx   ← NEW: Invite modal
│   ├── team-members-list.tsx           ← NEW: Team table
│   └── layout/
│       └── app-sidebar.tsx             ✓ Updated: uses role-based navItems
│
├── app/dashboard/
│   ├── layout.tsx                      ✓ Updated: role detection + nav selection
│   ├── overview/
│   │   └── layout.tsx                  ✓ Updated: real stats display
│   └── organization/
│       └── page.tsx                    ← NEW: Team management page
│
├── constants/
│   └── data.ts                         ✓ Updated: fixed nav items & URLs
│
└── utilties/
    ├── appointments.ts                 ✓ Updated: added org filtering
    ├── patients.ts                     ✓ Verified: has org filtering
    └── doctors.ts                      ✓ Verified: has org filtering
```

---

## Key Code Patterns

### Server Action Pattern
```typescript
// In src/actions/dashboard-stats-actions.ts
export async function getDashboardStats(date: Date = new Date()) {
  await connectDB();
  const user = await getMongoUser();
  
  if (!user) {
    return { success: false, error: "User not found" };
  }
  
  try {
    // All queries automatically filter by organization unless SUPERADMIN
    const orgFilter = user.role === "SUPERADMIN" 
      ? {} 
      : { organization: user.organization };
    
    const count = await Appointment.countDocuments({ ...orgFilter, ... });
    
    return { success: true, stats: { ... } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Using Server Action in Component
```typescript
// In src/app/dashboard/overview/layout.tsx (async component)
const statsResponse = await getDashboardStats();
const stats = statsResponse.success ? statsResponse.stats : defaultStats;
```

### Organization Filtering Pattern
```typescript
// Applied consistently across all utilities
const orgFilter = user.role === "SUPERADMIN" 
  ? {}  // SuperAdmin sees all
  : { organization: user.organization };  // Others see only their org

const data = await Model.find(orgFilter).lean();
```

---

## Deployment Checklist

- [ ] Verify MONGODB_URI environment variable is set
- [ ] Verify Clerk keys are configured
- [ ] Test login flow works for all roles
- [ ] Test role-based redirects (unassigned → /onboarding)
- [ ] Test dashboard stats display without errors
- [ ] Test team invite flow end-to-end
- [ ] Verify organization isolation (multi-clinic test)
- [ ] Check error notifications display correctly

---

## Common Issues & Solutions

### Issue: Dashboard shows "0" for all stats
**Solution:** Check MongoDB connection and ensure appointments exist for the user

### Issue: Navigation items not changing after role update
**Solution:** Log out and log back in (role comes from Clerk session claims)

### Issue: Team members not appearing in list
**Solution:** Verify team members have same organization ID as current user

### Issue: Unauthorized error when inviting member
**Solution:** Invite action requires DOCTOR, ADMIN, or SUPERADMIN role

---

## Next Steps (Optional Future Work)

1. **Patient Detail Page** - `/dashboard/patients/[id]/page.tsx`
   - Create server action to get patient with full history
   - Display medical history, treatments, prescriptions

2. **Appointment Booking UI** - `/dashboard/appointments/new`
   - Date/time picker with doctor availability
   - Conflict detection via existing bookAppointment server action

3. **Email Invitations** - Send invitation emails when team members added
   - Create email template
   - Send via email service

4. **Chart Data** - Connect real data to chart components
   - Use `getAppointmentTrendData()` for line/bar charts
   - Use `getStatusBreakdown()` for pie charts

---

## File Locations Reference

| Feature | File |
|---------|------|
| Dashboard Stats Logic | `src/actions/dashboard-stats-actions.ts` |
| Dashboard Display | `src/app/dashboard/overview/layout.tsx` |
| Team Management Logic | `src/actions/team-actions.ts` |
| Invite Dialog | `src/components/invite-team-member-dialog.tsx` |
| Team List Table | `src/components/team-members-list.tsx` |
| Team Page | `src/app/dashboard/organization/page.tsx` |
| Navigation Items | `src/constants/data.ts` |
| Dashboard Layout | `src/app/dashboard/layout.tsx` |
| Org Filtering (Patients) | `src/utilties/patients.ts` |
| Org Filtering (Doctors) | `src/utilties/doctors.ts` |
| Org Filtering (Appointments) | `src/utilties/appointments.ts` |

---

## API/Server Action Reference

### Dashboard Stats
```typescript
getDashboardStats(date?: Date)
→ { success, role, stats: { todaysAppointments, patientsWaiting, ... } }
```

### Team Management
```typescript
getTeamMembers() → { success, members }
inviteTeamMember(email, role, firstName, lastName) → { success, message }
removeTeamMember(memberId) → { success, message }
updateTeamMemberRole(memberId, newRole) → { success, message }
getOrganizationDetails() → { success, organization }
```

### Patient Management (Existing)
```typescript
createPatient(patientData) → { success, error? }
getPatients({ page, limit, search }) → { data, total }
getPatientById(patientId) → patient object
updatePatient(patientId, updates) → { success, error? }
```

### Appointment Management (Existing)
```typescript
bookAppointment({ patientId, doctorId, startTime, endTime, reason })
getAppointments({ page, limit, search, status })
```

---

## Questions?

Refer to the comprehensive documentation in [DASHBOARD_REDESIGN_COMPLETE.md](./DASHBOARD_REDESIGN_COMPLETE.md)
