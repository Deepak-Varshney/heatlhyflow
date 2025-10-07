# Clerk Subscription Integration

This implementation integrates Clerk's subscription system with your healthcare management application, providing organization-level subscription management with proper access controls and billing features.

## Features Implemented

### 1. Subscription Management
- **Organization-level subscriptions** managed through Clerk
- **Multiple subscription plans**: Free, Basic ($10/month), Professional, Enterprise
- **Feature-based access control** with usage limits
- **Automatic subscription creation** for new organizations

### 2. Access Control & Middleware
- **Route protection** based on subscription status
- **Feature-specific access** (analytics, API, branding, etc.)
- **Automatic redirects** to billing page for expired/inactive subscriptions
- **Usage limit enforcement** throughout the application

### 3. Superadmin Dashboard
- **Subscription overview** with statistics and revenue tracking
- **Organization management** with subscription status
- **Quick access** to subscription management tools
- **Integration with Clerk Dashboard** for detailed management

### 4. User-Facing Features
- **Billing page** with subscription status and upgrade options
- **Usage tracking** with visual progress bars
- **Feature access indicators** showing what's available in current plan
- **Subscription management** through Clerk's interface

## File Structure

```
src/
├── models/
│   ├── Subscription.ts          # Subscription model (for reference)
│   └── Organization.ts          # Updated with subscription reference
├── types/
│   └── subscription.ts          # Subscription types and plans
├── lib/
│   ├── clerk-subscription.ts    # Clerk subscription utilities
│   └── subscription.ts          # Original subscription utilities
├── components/subscription/
│   ├── clerk-subscription-status.tsx    # Subscription status component
│   ├── clerk-subscription-guard.tsx      # Access control components
│   ├── subscription-card.tsx             # Plan selection cards
│   └── subscription-status.tsx          # Original status component
├── app/
│   ├── billing/
│   │   └── page.tsx             # User billing page
│   └── superadmin/
│       ├── dashboard/page.tsx   # Updated with subscription stats
│       └── subscriptions/page.tsx # Subscription management
├── middleware.ts                 # Updated with subscription checks
└── actions/
    └── superadmin-actions.ts    # Subscription management actions
```

## Configuration

### 1. Clerk Setup
- Enable subscriptions in your Clerk dashboard
- Create plans with slugs: `basic`, `professional`, `enterprise`
- Set up webhooks for subscription events

### 2. Environment Variables
```env
CLERK_WEBHOOK_SECRET=your_webhook_secret
CLERK_SECRET_KEY=your_secret_key
```

### 3. Plan Configuration
Update `src/types/subscription.ts` to match your Clerk plans:

```typescript
BASIC: {
  name: "Basic",
  description: "Essential features for growing practices",
  price: {
    monthly: 10, // Your actual price
    yearly: 100,
  },
  features: {
    maxUsers: 5,
    maxAppointments: 200,
    maxPatients: 500,
    // ... other features
  },
  clerkSlug: "basic", // Must match Clerk plan slug
},
```

## Usage Examples

### 1. Protecting Routes
```typescript
// In middleware.ts
if (pathname.includes("/analytics") && !subscriptionStatus.limits.canAccessAnalytics) {
  return NextResponse.redirect(new URL("/billing?feature=analytics", req.url));
}
```

### 2. Component-Level Protection
```tsx
import { ClerkSubscriptionGuard } from "@/components/subscription/clerk-subscription-guard";

<ClerkSubscriptionGuard feature="analytics">
  <AnalyticsDashboard />
</ClerkSubscriptionGuard>
```

### 3. Usage Limits
```tsx
import { ClerkUsageLimit } from "@/components/subscription/clerk-subscription-guard";

<ClerkUsageLimit 
  current={currentUsers} 
  max={maxUsers} 
  type="users"
  onUpgrade={() => router.push('/billing')}
/>
```

### 4. Getting Subscription Context
```typescript
import { getClerkSubscriptionContext } from "@/lib/clerk-subscription";

const subscriptionContext = await getClerkSubscriptionContext();
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

### Basic Plan ($10/month)
- 5 users
- 200 appointments
- 500 patients
- Standard features

### Professional Plan
- 15 users
- 1000 appointments
- 2000 patients
- Advanced analytics
- Custom branding
- API access

### Enterprise Plan
- Unlimited users
- Unlimited appointments
- Unlimited patients
- All features included
- Priority support
- Custom integrations

## Webhook Events

The system handles these Clerk webhook events:
- `organization.created` - Creates default free subscription
- `organization.updated` - Updates organization details
- `organization.deleted` - Handles organization deletion
- `organizationMembership.*` - Manages user-organization relationships

## Security Considerations

1. **Server-side validation** - All subscription checks happen on the server
2. **Middleware protection** - Routes are protected at the middleware level
3. **Feature gating** - Components check subscription status before rendering
4. **Usage tracking** - Monitor usage against plan limits

## Future Enhancements

1. **Real-time usage tracking** - Update usage counters in real-time
2. **Advanced analytics** - Detailed subscription and usage analytics
3. **Automated billing** - Integration with payment processors
4. **Usage alerts** - Notifications when approaching limits
5. **Plan recommendations** - Suggest upgrades based on usage patterns

## Troubleshooting

### Common Issues

1. **Subscription not found** - Check if organization has active subscription in Clerk
2. **Access denied** - Verify subscription status and plan features
3. **Webhook failures** - Check webhook secret and endpoint configuration
4. **Usage limits** - Ensure usage tracking is properly implemented

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_SUBSCRIPTIONS=true
```

This will log subscription checks and access decisions to the console.

## Support

For issues related to:
- **Clerk subscriptions** - Check Clerk documentation and dashboard
- **Application integration** - Review this documentation and code examples
- **Billing issues** - Contact Clerk support or your payment processor