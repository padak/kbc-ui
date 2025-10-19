# Module: Billing

## Overview

The Billing module manages PAYG (Pay-As-You-Go) billing functionality for Keboola projects, including credit tracking and purchases, payment methods, subscription management, and billing information. It displays credit balance, consumption rates (minutes per credit), purchase history, available payment options, and top-up settings. The module integrates with Stripe for payment processing and supports both manual and automatic credit top-ups.

## File Structure

```
billing/
├── constants.ts                       # Routes, pricing, invoice statuses
├── actions.ts                         # Flux action creators for billing data
├── BillingApi.ts                      # API client for billing endpoints
├── store.ts                           # Flux store for billing state
├── helpers.ts                         # Utility functions (VAT validation, parsing)
├── routes.ts                          # Route definitions for billing pages
├── react/
│   ├── Overview.tsx                   # Main billing dashboard page
│   ├── Credits.tsx                    # Add/purchase credits page
│   ├── AccountPlanBox.tsx             # Account plan information component
│   ├── CreditsBalanceBox.tsx          # Current credit balance display
│   ├── CreditsLoadingTooltip.tsx      # Loading state for credits
│   ├── CreditsPicker.tsx              # Credit quantity selector
│   ├── CreditCardBox.tsx              # Payment method display/management
│   ├── SavedCardInfo.tsx              # Saved card details viewer
│   ├── BillingInformation.tsx         # Billing address & contact info
│   ├── BillingEditFields.tsx          # Billing info edit form fields
│   ├── BillingEditModal.tsx           # Modal for editing billing info
│   ├── BillingAddress.tsx             # Address field component
│   ├── CardFields.tsx                 # Credit card field inputs
│   ├── LatestPurchases.tsx            # Purchase history display
│   ├── Pay.tsx                        # Payment processing page
│   ├── PayForm.tsx                    # Payment form submission
│   ├── PaymentSuccessful.tsx          # Payment success confirmation
│   ├── TopUpForm.tsx                  # Automatic top-up configuration
│   ├── TopUpInfo.tsx                  # Top-up settings display
│   ├── TopUpModal.tsx                 # Modal for configuring top-ups
│   ├── ManageSubscriptionBox.tsx      # Subscription management link
│   ├── MarketplacePortalLink.tsx      # AWS Marketplace link
│   ├── BackLink.tsx                   # Navigation back button
│   └── AccountPlanBox.tsx             # Account plan tier display
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/admin/settings/billing-overview` | Overview | Main billing dashboard with credits, plan, payment method |
| `/admin/settings/billing-minutes` | Credits | Purchase additional credits interface |

## Key Components

### Overview (Main Billing Dashboard)
- **Location**: `apps/kbc-ui/src/scripts/modules/billing/react/Overview.tsx`
- **Purpose**: Display complete billing information and account status
- **Props**: None (store-driven via Flux)
- **State**: 
  - Remaining credits (from BillingStore)
  - Credit price (CZK per credit)
  - Billing information (address, contact)
  - Purchases history
  - Top-up settings (enabled/disabled)
  - Account plan information
  - Loading state for credits fetch
- **Child Components**:
  - CreditsBalanceBox (current balance)
  - AccountPlanBox (plan tier info)
  - CreditCardBox (payment method)
  - BillingInformation (billing address)
  - LatestPurchases (transaction history)
- **Key Features**:
  - Real-time credit balance display
  - Account plan tier information
  - Payment method management
  - Billing address management
  - Recent purchases with invoice links (Stripe invoices)
  - Top-up settings toggle

### CreditsBalanceBox
- **Location**: `apps/kbc-ui/src/scripts/modules/billing/react/CreditsBalanceBox.tsx`
- **Purpose**: Display current credit balance with consumption context
- **Props**:
  - `creditsCount`: Number of remaining credits
  - `isLoadingCredits`: Loading state
  - `simple`: Boolean to show simple vs detailed view
- **Display Elements**:
  - Large credit amount display
  - Conversion to minutes (60 minutes per credit)
  - Loading spinner when fetching
  - "Buy Credits" button for quick access
  - Visual indicator for low credit status

### Credits (Purchase Credits Page)
- **Location**: `apps/kbc-ui/src/scripts/modules/billing/react/Credits.tsx`
- **Purpose**: Interface for purchasing additional credits
- **Props**: None (store-driven)
- **State**:
  - Selected credit amount (1, 2, 4, 8, 16, 32, 64, 128)
  - Payment method (new card or saved card)
  - Form validation state
  - Payment processing state
- **Child Components**:
  - CreditsPicker (quantity selector)
  - SavedCardInfo (payment method selector)
  - CardFields (for new card entry)
  - PayForm (payment submission)
  - TopUpModal (if auto top-up available)
- **Key Features**:
  - Credit amount options with bulk discounts
  - Estimated cost calculation (Kc CZK per credit)
  - Saved payment methods selection
  - New card entry form
  - Discount tiers (32 credits = 5% off, 64 = 10%, 128 = 15%)
  - VAT calculation
  - Payment success confirmation

### CreditsPicker
- **Location**: `apps/kbc-ui/src/scripts/modules/billing/react/CreditsPicker.tsx`
- **Purpose**: Allow selection of credit purchase quantity with discount display
- **Props**:
  - `onSelect`: Callback when amount selected
  - `selectedAmount`: Currently selected amount
  - `creditPrice`: Price per credit
- **Display Elements**:
  - Credit amount buttons (1, 2, 4, 8, 16, 32, 64, 128)
  - Individual credit cost display
  - Discount percentage badge for bulk purchases
  - Total cost calculation
  - Estimated minutes for conversion

### CreditCardBox
- **Location**: `apps/kbc-ui/src/scripts/modules/billing/react/CreditCardBox.tsx`
- **Purpose**: Display and manage payment methods (credit cards)
- **Props**:
  - `creditPrice`: Credit pricing
  - `topUpSetting`: Auto top-up configuration
  - `purchases`: Purchase history
  - `card`: Saved card data (Immutable Map)
- **Display Elements**:
  - Saved card details (last 4 digits, expiry, cardholder)
  - Card brand logo (Visa, Mastercard, etc.)
  - Remove card button
  - Add new card option
  - Top-up indicator (if enabled)
  - Quick purchase button

### SavedCardInfo
- **Location**: `apps/kbc-ui/src/scripts/modules/billing/react/SavedCardInfo.tsx`
- **Purpose**: Display saved credit card information for selection
- **Props**:
  - `cards`: List of saved cards
  - `onSelect`: Selection callback
  - `selectedCardId`: Currently selected card ID
- **Display Elements**:
  - Card grid with brand, last 4 digits, expiry
  - Selection radio buttons
  - Add new card option
  - Card brand identification with icons

### BillingInformation
- **Location**: `apps/kbc-ui/src/scripts/modules/billing/react/BillingInformation.tsx`
- **Purpose**: Display and manage billing address and contact information
- **Props**:
  - `billingInformation`: Billing data (Immutable Map)
- **Display Elements**:
  - Company name
  - Billing address (street, city, postal code, country)
  - VAT ID (for EU validation)
  - Contact email
  - Edit button for modification
- **Key Features**:
  - Address formatting by country
  - VAT ID validation per country format
  - Edit modal for updating information

### LatestPurchases
- **Location**: `apps/kbc-ui/src/scripts/modules/billing/react/LatestPurchases.tsx`
- **Purpose**: Display recent credit purchase history
- **Props**:
  - `purchases`: Array of purchase records
- **Display Elements**:
  - Purchase date
  - Credit amount
  - Currency amount (if applicable)
  - Invoice status (paid, open, uncollectible)
  - Link to Stripe invoice PDF
  - Automatic top-up indicator

### TopUpForm / TopUpModal
- **Location**: `apps/kbc-ui/src/scripts/modules/billing/react/TopUpForm.tsx`
- **Purpose**: Configure automatic credit top-up settings
- **Props**:
  - `topUpSetting`: Current top-up configuration
  - `onSave`: Save callback
  - `onCancel`: Cancel callback
- **Fields**:
  - Enable/disable toggle
  - Target credit balance (min credits to maintain)
  - Top-up amount (credits to buy when balance drops)
  - Max auto top-ups per month
- **Key Features**:
  - Automatic top-up triggers when balance drops below threshold
  - Prevents manual top-up need
  - Configurable monthly limit to prevent overages
  - Uses saved payment method

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/v2/storage/billing/credits` | Get remaining credits | Credits object |
| GET | `/v2/storage/billing/purchases` | List credit purchases | Purchase[] |
| GET | `/v2/storage/billing/configuration` | Get pricing config | Config (credit price, etc.) |
| GET | `/v2/storage/billing/billing-info` | Get billing address info | BillingInfo |
| POST | `/v2/storage/billing/billing-info` | Update billing info | BillingInfo |
| GET | `/v2/storage/billing/stripe-customer` | Get saved cards | Cards[] |
| POST | `/v2/storage/billing/stripe-customer` | Update payment method | Customer |
| DELETE | `/v2/storage/billing/stripe-customer/:cardId` | Remove card | - |
| POST | `/v2/storage/billing/payment-request` | Create Stripe payment intent | { clientSecret } |
| GET | `/v2/storage/billing/top-up` | Get top-up settings | TopUpSetting |
| POST | `/v2/storage/billing/top-up` | Update top-up settings | TopUpSetting |

## State Management

- **Pattern Used**: Flux architecture with Immutable.js (legacy)
- **Key Stores**:
  - `BillingStore`: Main store managing all billing data
    - `purchases`: Array of Purchase records
    - `credits`: Credits object (remaining, consumption rate)
    - `billingInformation`: Immutable Map with address/contact
    - `configuration`: Pricing and feature configuration
    - `topUpSetting`: Auto top-up configuration
    - `loadingCredits`: Loading state flag
- **Data Flow**:
  1. Routes trigger data loading via `requireData` handlers
  2. Action creators call billing API endpoints
  3. Responses dispatched through Dispatcher
  4. Store updates and emits change event
  5. Components subscribe to store changes
  6. UI re-renders with fresh data
- **Initial Load**: Handled via `loadCommonData()` in routes
  - Fetches purchases, configuration, billing info, top-up settings
  - Credits loaded separately on Overview page

## Billing Data Types

### Purchase
```typescript
type Purchase = {
  id: number;
  idProject: number;
  created: string;                    // ISO timestamp
  creditsAmount: number;              // Credits purchased
  moneyAmount: number | null;         // CZK amount paid
  description: string | null;         // Purchase description
  invoiceTopUpType: 'automatic' | 'manual' | null; // Top-up type
  idStripeInvoice: string | null;     // Stripe invoice ID
  stripeInvoiceStatus: 'paid' | 'open' | 'uncollectible' | null;
  urlStripeInvoice: string | null;    // Link to invoice PDF
}
```

### Credits
```typescript
type Credits = {
  remaining: number;                  // Remaining credits
  consumption?: {
    perMinute: number;               // Credits used per minute
    hourly: number;                  // Credits used per hour
  };
  marketplaceSubscription?: {         // AWS Marketplace info
    state: string;
    billingLink: string;
  };
}
```

### TopUpSetting
```typescript
type TopUpSetting = {
  enabled: boolean;                  // Auto top-up enabled
  minBalance: number;                // Minimum balance to trigger top-up
  topUpAmount: number;               // Credits to purchase on top-up
  maxTopUpsPerMonth: number;         // Monthly limit
}
```

## Dependencies

### Internal Modules
- `admin`: User privileges, admin token management, Stripe customer API access
- `components`: Component types for component selection
- `dev-branches`: Branch context (if applicable)

### External Packages
- `immutable.js`: Immutable data structures
- `bluebird`: Promise utilities
- `dayjs`: Date formatting for purchase history
- `stripe-js`: Stripe payment processing (optional, handled server-side)

### Design System Components
- `Button`: Action buttons (purchase, edit, etc.)
- `Form`: Billing form components
- `Input`: Text/number inputs
- `Select`: Country/card selection
- `Modal`: Modals for billing info and top-up
- `Card`: Card component for displaying information
- `Icon`: Payment method icons
- `Badge`: Status badges (paid, pending, etc.)
- `Table`: Purchase history table

## Notable Patterns

### Credit Price Calculation
```typescript
// Credit price is centrally configured
const creditPrice = BillingStore.getCreditPrice();  // e.g., 840 CZK

// When user selects credits:
const selectedCredits = 4;
const discountTiers = { 32: 5, 64: 10, 128: 15 };
const discountPercent = discountTiers[selectedCredits] || 0;
const totalCost = (selectedCredits * creditPrice * (100 - discountPercent)) / 100;
```

### Minutes to Credits Conversion
```typescript
// Fixed rate: 60 minutes per credit
const MINUTES_PER_CREDIT = 60;

// Calculate estimated runtime from credit purchase
const selectedCredits = 8;
const estimatedMinutes = selectedCredits * MINUTES_PER_CREDIT;  // 480 minutes (8 hours)
```

### Billing Information Parsing
```typescript
// Convert between API format and form format
const parseBillingInformation = (billingInfo: Map<string, any>) => {
  return {
    companyName: billingInfo.get('companyName'),
    billingAddress: billingInfo.getIn(['billingAddress', 'street']),
    // ... other fields
  };
};
```

### Payment Intent Flow
```typescript
// 1. User initiates purchase with selectedCredits and saveCard flag
// 2. Call createPaymentRequest() to get clientSecret
// 3. Use clientSecret with Stripe.js for 3D Secure (if needed)
// 4. Complete payment and show success
// 5. Credits automatically added to account
```

### Auto Top-Up Logic
```typescript
// When enabled, Stripe automatically:
// 1. Monitors credit balance in real-time
// 2. Triggers top-up when balance < minBalance
// 3. Charges saved payment method for topUpAmount credits
// 4. Capped by maxTopUpsPerMonth limit
// 5. Sends confirmation email to account owner
```

## User-Facing Features

### Feature 1: Credit Balance Monitoring
- **Description**: Real-time display of current credit balance
- **Workflow**:
  1. Navigate to Billing Overview
  2. See current credit balance in prominent display
  3. Convert to estimated runtime (minutes)
  4. View consumption trend (if available)
  5. Quick link to purchase more
- **Components**: CreditsBalanceBox, Overview

### Feature 2: Credit Purchasing
- **Description**: Purchase credits with flexible quantities and bulk discounts
- **Workflow**:
  1. Click "Buy Credits" or navigate to Credits page
  2. Select credit amount (1, 2, 4, 8, 16, 32, 64, 128)
  3. See discount percentage and total cost
  4. Select saved card or enter new card details
  5. Review billing address (auto-filled)
  6. Confirm purchase and enter Stripe payment form
  7. Credits appear in account immediately upon success
- **Components**: Credits, CreditsPicker, SavedCardInfo, CardFields, PayForm

### Feature 3: Payment Method Management
- **Description**: Add, view, and manage saved credit cards
- **Workflow**:
  1. On Billing Overview, see saved card details
  2. Click "Add Card" to register new payment method
  3. Enter card details and billing address
  4. Card saved for future purchases
  5. Click "Remove" to delete card (if additional cards exist)
  6. On purchase, select which card to charge
- **Components**: CreditCardBox, SavedCardInfo, CardFields

### Feature 4: Billing Information Management
- **Description**: Maintain and update company billing address and contact info
- **Workflow**:
  1. On Billing Overview, view current billing info
  2. Click "Edit" to open edit modal
  3. Update company name, address, VAT ID, email
  4. Enter country-specific VAT format
  5. Save changes (validation per country)
  6. Used on invoices and receipts
- **Components**: BillingInformation, BillingEditModal, BillingEditFields

### Feature 5: Purchase History
- **Description**: View all credit purchases with invoice access
- **Workflow**:
  1. On Billing Overview, see "Latest Purchases" section
  2. View purchase date, credit amount, cost, status
  3. Identify automatic vs manual top-ups
  4. Click invoice link to download PDF from Stripe
  5. Check invoice status (paid, open, uncollectible)
- **Components**: LatestPurchases

### Feature 6: Automatic Top-Up Configuration
- **Description**: Set up automatic credit replenishment to prevent service interruption
- **Workflow**:
  1. On Billing Overview, see "Top-Up Settings" box
  2. Click "Configure" to open settings modal
  3. Enable automatic top-ups
  4. Set minimum balance threshold (e.g., 10 credits)
  5. Set top-up amount (e.g., 32 credits)
  6. Set max top-ups per month (e.g., 10)
  7. Save and enable on saved payment method
  8. Keboola automatically purchases credits when balance drops
- **Components**: TopUpModal, TopUpForm

### Feature 7: Account Plan Display
- **Description**: View current account plan and upgrade options
- **Workflow**:
  1. On Billing Overview, see "Account Plan" box
  2. View current plan tier (e.g., starter, pro, enterprise)
  3. See plan limits and included features
  4. Link to upgrade plan (if available)
  5. Contact sales for enterprise options
- **Components**: AccountPlanBox

### Feature 8: AWS Marketplace Integration
- **Description**: Link to AWS Marketplace for marketplace customers
- **Workflow**:
  1. If project is AWS Marketplace subscription
  2. See "Manage Subscription" link on Billing Overview
  3. Click to navigate to AWS Marketplace portal
  4. Manage subscription billing there
- **Components**: MarketplacePortalLink

## Technical Debt & Observations

### Flux Architecture
- Module uses legacy Flux pattern with Immutable.js
- Could migrate to TanStack Query for simpler data fetching
- Action creators are relatively simple for this migration

### Stripe Integration
- Payment processing is server-side (good for security)
- Client uses Stripe.js for payment element
- Consider moving to more modern Stripe payment components
- Payment confirmation handling could be simplified

### VAT Validation
- Country-specific VAT format validation
- Currently uses regex patterns
- Could benefit from dedicated VAT library
- Error messages could be more user-friendly

### Form Handling
- Manual form state management
- Could benefit from React Hook Form or similar
- Billing edit modal has complex validation

### Loading States
- Credits have separate loading state
- Could consolidate loading states
- Consider skeleton loaders for better UX

### Performance
- Billing information fetched on every route load
- Could cache for longer periods
- Consider pagination for large purchase histories

## Code Examples

### Getting Billing Data from Store
```typescript
// In component
const state = useStores(
  () => {
    return {
      creditPrice: BillingStore.getCreditPrice(),
      remainingCredits: BillingStore.getRemainingCredits(),
      isLoadingCredits: BillingStore.isLoadingCredits(),
      billingInformation: BillingStore.getBillingInformation(),
      purchases: BillingStore.getPurchases(),
      topUpSetting: BillingStore.getTopUpSetting(),
    };
  },
  [],
  [BillingStore],
);
```

### Loading Billing Data via Routes
```typescript
// In routes.ts
const routes = [
  {
    name: routeNames.BILLING_OVERVIEW,
    title: 'Billing Overview',
    lazy: async () => {
      const { Overview } = await import('./react/Overview');
      return { Component: Overview };
    },
    requireData: [
      () => loadCommonData(),  // purchases, config, info, top-up
      () => getCredits(),      // separate credits fetch
    ],
  },
];
```

### Calculating Credit Purchase Cost
```typescript
const calculateCost = (credits: number, basePrice: number) => {
  const DISCOUNTS: Record<number, number> = { 32: 5, 64: 10, 128: 15 };
  const discount = DISCOUNTS[credits] || 0;
  const discountedPrice = basePrice * ((100 - discount) / 100);
  return credits * discountedPrice;
};
```

### VAT ID Validation
```typescript
// Country-specific VAT validation
const validateVat = (vatId: string, country: string) => {
  const patterns: Record<string, RegExp> = {
    'CZ': /^\d{8,10}$/,      // Czech Republic
    'DE': /^\d{9}$/,         // Germany
    'FR': /^[A-Z0-9]{13}$/,  // France
    // ... more countries
  };
  
  const pattern = patterns[country];
  if (!pattern) return true;  // No validation for country
  
  return pattern.test(vatId);
};
```

## Related Modules

- `admin`: Admin API access, user permissions, Stripe customer management
- `settings`: Billing settings page integration
- `components`: Component selection for usage breakdown
- `notifications`: Purchase confirmation emails (via email service)

## Testing

- Key test files: `billing.test.ts`, `billing-store.test.ts`
- Test coverage:
  - Credit calculation and discount tiers
  - VAT validation per country
  - Billing information parsing
  - Purchase history display
  - Top-up setting validation
- Important test cases:
  - Bulk discount tiers applied correctly
  - VAT format validation per country
  - Payment method selection logic
  - Loading state management
  - Error handling for payment failures
- Integration tests:
  - Complete purchase flow
  - Billing information update flow
  - Top-up configuration flow

## Accounting/Financial Notes

- All prices in CZK (Czech Koruna)
- Credit price: 840 CZK per credit
- Consumption: 60 minutes per credit
- Bulk discounts: 32cr (5%), 64cr (10%), 128cr (15%)
- Invoices generated by Stripe
- Top-ups can be manual or automatic
- Top-up frequency capped per month (configurable)
- Purchase history maintained in database
- Marketplace subscriptions handled separately via AWS

