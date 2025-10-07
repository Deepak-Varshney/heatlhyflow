# Custom Subscription System

This implementation provides a complete custom subscription management system for your healthcare management application, with full control over billing, features, and usage tracking.

## Features Implemented

### 1. Custom Subscription Management
- **MongoDB-based subscriptions** with full control over data
- **Multiple subscription plans**: Free, Basic ($29/month), Professional ($79/month), Enterprise ($199/month)
- **Feature-based access control** with granular permissions
- **Usage tracking** with real-time limits enforcement
- **Automatic subscription creation** for new organizations

### 2. Access Control & Middleware
- **Route protection** based on subscription status and features
- **Feature-specific access** (analytics, API, branding, etc.)
- **Automatic redirects** to billing page for expired/inactive subscriptions
- **Usage limit enforcement** throughout the application

### 3. Superadmin Dashboard
- **Complete subscription management** with CRUD operations
- **Real-time statistics** and revenue tracking
- **Plan management** with instant upgrades/downgrades
- **Status management** (active, cancelled, past due, etc.)
- **Usage monitoring** across all organizations

### 4. User-Facing Features
- **Comprehensive billing page** with subscription status and upgrade options
- **Usage tracking** with visual progress bars and limit warnings
- **Feature access indicators** showing what's available in current plan
- **Plan comparison** with detailed feature lists

## File Structure

```
src/
├── models/
│   ├── Subscription.ts          # Subscription model with full schema
│   └── Organization.ts          # Updated with subscription reference
├── types/
│   └── subscription.ts          # Subscription types and plans
├── lib/
│   └── subscription.ts          # Subscription utilities and context
├── components/subscription/
│   ├── subscription-status.tsx  # Subscription status display
│   ├── subscription-guard.tsx  # Access control components
│   └── subscription-card.tsx   # Plan selection cards
├── app/
│   ├── billing/
│   │   └── page.tsx             # User billing page
│   └── superadmin/
│       ├── dashboard/page.tsx   # Updated with subscription stats
│       └── subscriptions/page.tsx # Complete subscription management
├── middleware.ts                 # Updated with subscription checks
└── actions/
    └── superadmin-actions.ts    # Subscription management actions
```

## Configuration

### 1. Database Setup
- MongoDB with Subscription collection
- Automatic subscription creation via webhooks
- Usage tracking and limit enforcement

### 2. Plan Configuration
Update `src/types/subscription.ts` to customize plans:

```typescript
BASIC: {
  name: "Basic",
  description: "Essential features for growing practices",
  price: {
    monthly: 29, // Your pricing
    yearly: 290,
  },
  features: {
    maxUsers: 5,
    maxAppointments: 200,
    maxPatients: 500,
    advancedAnalytics: false,
    customBranding: false,
    apiAccess: false,
    prioritySupport: false,
    customIntegrations: false,
  },
},
```

### 3. Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
CLERK_WEBHOOK_SECRET=your_webhook_secret
CLERK_SECRET_KEY=your_secret_key
```

## Usage Examples

### 1. Protecting Routes
```typescript
// In middleware.ts
if (pathname.includes("/analytics") && !subscriptionContext.limits.canAccessAnalytics) {
  return NextResponse.redirect(new URL("/billing?feature=analytics", req.url));
}
```

### 2. Component-Level Protection
```tsx
import { SubscriptionGuard } from "@/components/subscription/subscription-guard";

<SubscriptionGuard feature="analytics">
  <AnalyticsDashboard />
</SubscriptionGuard>
```

### 3. Usage Limits
```tsx
import { UsageLimit } from "@/components/subscription/subscription-guard";

<UsageLimit 
  current={currentUsers} 
  max={maxUsers} 
  type="users"
  onUpgrade={() => router.push('/billing')}
/>
```

### 4. Getting Subscription Context
```typescript
import { getSubscriptionContext } from "@/lib/subscription";

const subscriptionContext = await getSubscriptionContext();
if (subscriptionContext?.limits.canCreateUser) {
  // Allow user creation
}
```

## Subscription Plans

### Free Plan
- 2 users
- 50 appointments
- 100 patients
- Basic features only

### Basic Plan ($29/month)
- 5 users
- 200 appointments
- 500 patients
- Standard features

### Professional Plan ($79/month)
- 15 users
- 1000 appointments
- 2000 patients
- Advanced analytics
- Custom branding
- API access

### Enterprise Plan ($199/month)
- Unlimited users
- Unlimited appointments
- Unlimited patients
- All features included
- Priority support
- Custom integrations

## Database Schema

### Subscription Model
```typescript
{
  organization: ObjectId,        // Reference to Organization
  clerkOrgId: string,            // Clerk organization ID
  planType: "FREE" | "BASIC" | "PROFESSIONAL" | "ENTERPRISE",
  status: "ACTIVE" | "CANCELLED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE",
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: boolean,
  features: {
    maxUsers: number,
    maxAppointments: number,
    maxPatients: number,
    advancedAnalytics: boolean,
    customBranding: boolean,
    apiAccess: boolean,
    prioritySupport: boolean,
    customIntegrations: boolean,
  },
  usage: {
    currentUsers: number,
    currentAppointments: number,
    currentPatients: number,
  },
  billingCycle: "MONTHLY" | "YEARLY",
  pricePerMonth: number,
}
```

## Superadmin Features

### Subscription Management
- **View all subscriptions** with organization details
- **Update plans** instantly (Free, Basic, Professional, Enterprise)
- **Change status** (Active, Cancelled, Past Due, etc.)
- **Delete subscriptions** with confirmation
- **Create new subscriptions** for organizations

### Statistics & Analytics
- **Revenue tracking** (monthly, yearly, total)
- **Subscription counts** by plan type
- **Status distribution** (active, cancelled, past due)
- **Usage statistics** across all organizations

### Quick Actions
- **Bulk plan updates** for multiple organizations
- **Status changes** with immediate effect
- **Usage monitoring** with limit alerts
- **Revenue reports** and analytics

## Webhook Integration

The system handles these Clerk webhook events:
- `organization.created` - Creates default free subscription
- `organization.updated` - Updates organization details
- `organization.deleted` - Handles organization deletion
- `organizationMembership.*` - Manages user-organization relationships

## Security Features

1. **Server-side validation** - All subscription checks happen on the server
2. **Middleware protection** - Routes are protected at the middleware level
3. **Feature gating** - Components check subscription status before rendering
4. **Usage tracking** - Monitor usage against plan limits
5. **Admin-only access** - Subscription management restricted to superadmins

## Payment Integration

### Current Implementation
- **Manual billing** through superadmin interface
- **Status management** (active, cancelled, past due)
- **Plan upgrades/downgrades** with immediate effect

### Future Enhancements
- **Stripe integration** for automatic billing
- **Payment method management** for users
- **Invoice generation** and download
- **Automated subscription renewals**

## Usage Tracking

### Real-time Monitoring
- **User count** tracking per organization
- **Appointment limits** with visual progress bars
- **Patient limits** with usage warnings
- **Feature usage** monitoring

### Limit Enforcement
- **Automatic blocking** when limits are reached
- **Upgrade prompts** when approaching limits
- **Grace period** for overages (configurable)
- **Admin override** capabilities

## Customization Options

### Plan Features
- **Customize limits** for each plan
- **Add new features** to plans
- **Modify pricing** for different markets
- **Create custom plans** for specific clients

### Access Control
- **Feature-level permissions** for granular control
- **Route-based protection** for sensitive areas
- **Component-level guards** for UI elements
- **API endpoint protection** for backend services

## Troubleshooting

### Common Issues

1. **Subscription not found** - Check if organization has subscription in database
2. **Access denied** - Verify subscription status and plan features
3. **Usage limits** - Check current usage against plan limits
4. **Webhook failures** - Verify webhook secret and endpoint configuration

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_SUBSCRIPTIONS=true
```

This will log subscription checks and access decisions to the console.

## Migration from Clerk Subscriptions

If migrating from Clerk subscriptions:

1. **Export subscription data** from Clerk
2. **Import to MongoDB** using migration scripts
3. **Update middleware** to use custom subscription checks
4. **Test all features** to ensure proper access control
5. **Update billing pages** to use custom subscription management

## Support

For issues related to:
- **Custom subscription system** - Review this documentation and code examples
- **Database operations** - Check MongoDB connection and schema
- **Access control** - Verify subscription status and feature permissions
- **Usage tracking** - Ensure proper usage counting implementation