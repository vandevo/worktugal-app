# Worktugal Pass - Partner Portal

A production-ready, mobile-first B2B web application for Worktugal Pass — Lisbon's trusted perk marketplace for remote professionals and expats.

## 🎯 Purpose

This self-serve partner portal allows local businesses to:
- Submit their business information and perk offers
- Pay a one-time listing fee (€49 early access)
- Appear in a live public directory
- Reach 1,000+ verified remote workers in Lisbon

## ✨ Key Features

### 🔐 Authentication & Security
- **Supabase Auth**: Email/password authentication with no email confirmation required
- **Row Level Security (RLS)**: Database-level security policies
- **Protected Routes**: Authentication-required sections
- **Session Management**: Automatic session handling and token refresh
- **Input Validation**: Zod schema validation on all forms
- **CSRF Protection**: Built-in protection through Supabase

### 💳 Payment Integration
- **Stripe Integration**: Full payment processing with webhooks
- **One-time Payments**: €49 early access listing fee
- **Subscription Support**: Ready for future recurring billing
- **Payment Status Tracking**: Real-time payment status updates
- **Secure Checkout**: PCI-compliant payment processing
- **Refund Support**: Backend webhook handling for refunds

### 📱 User Experience
- **Multi-step Form Wizard**: Intuitive business registration flow
- **Real-time Validation**: Instant feedback on form inputs
- **Loading States**: Smooth loading indicators throughout
- **Error Handling**: Comprehensive error messages and recovery
- **Success Flows**: Clear confirmation and next steps
- **Mobile-First Design**: Optimized for all screen sizes

### 🎨 Design System
- **Dark Mode**: Modern dark theme with blue/purple accents
- **Responsive Grid**: CSS Grid and Flexbox layouts
- **Animations**: Framer Motion powered micro-interactions
- **Typography**: Inter font family with proper hierarchy
- **Color System**: Consistent color palette with semantic colors
- **Spacing**: 8px grid system for consistent spacing

### 🏗️ Architecture
- **Component-Based**: Reusable React components
- **Custom Hooks**: Shared logic in custom hooks
- **Type Safety**: Full TypeScript coverage
- **State Management**: React hooks for local state
- **Form Management**: React Hook Form with Zod validation
- **Database**: Supabase PostgreSQL with RLS

## 🚀 Tech Stack

### Frontend
- **React 18** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **React Router DOM** - Client-side routing
- **Zod** - Schema validation

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Database-level security
- **Real-time subscriptions** - Live data updates
- **Edge Functions** - Serverless functions

### Payment & Integration
- **Stripe** - Payment processing
- **Webhook handling** - Automated payment updates
- **Customer management** - Stripe customer sync
- **Order tracking** - Payment history

### DevOps & Deployment
- **Netlify** - Static site hosting
- **Continuous Deployment** - Git-based deployments
- **Environment Variables** - Secure configuration
- **Performance Optimization** - Bundle optimization

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd worktugal-pass-portal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

### Database Setup

1. **Create Supabase Project**
   ```bash
   # Create new project at https://supabase.com
   ```

2. **Run Database Migrations**
   ```sql
   -- Run in Supabase SQL Editor
   -- Migration files are in supabase/migrations/
   ```

3. **Configure RLS Policies**
   ```sql
   -- Policies are included in migrations
   -- Users can only access their own data
   ```

### Stripe Setup

1. **Create Stripe Products**
   ```bash
   # Create products in Stripe Dashboard
   # Update src/stripe-config.ts with your price IDs
   ```

2. **Configure Webhooks**
   ```bash
   # Set webhook endpoint to:
   # https://your-project.supabase.co/functions/v1/stripe-webhook
   ```

3. **Environment Variables**
   ```bash
   # Add to Supabase Edge Functions
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
   ```

### Development Server

```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── auth/               # Authentication components
│   │   ├── AuthModal.tsx   # Login/signup modal
│   │   ├── LoginForm.tsx   # Login form
│   │   └── SignupForm.tsx  # Signup form
│   ├── forms/              # Form components
│   │   ├── BusinessForm.tsx # Business details form
│   │   ├── PerkForm.tsx    # Perk details form
│   │   ├── PaymentForm.tsx # Payment form
│   │   └── SuccessScreen.tsx # Success confirmation
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx      # Button component
│   │   ├── Input.tsx       # Input component
│   │   ├── Select.tsx      # Select component
│   │   ├── Card.tsx        # Card component
│   │   ├── Alert.tsx       # Alert component
│   │   └── ProgressBar.tsx # Progress indicator
│   ├── FormWizard.tsx      # Multi-step form wizard
│   ├── Hero.tsx            # Landing page hero
│   ├── PerksDirectory.tsx  # Partner directory
│   ├── PricingSection.tsx  # Pricing and payment
│   ├── Layout.tsx          # App layout wrapper
│   ├── Footer.tsx          # Site footer
│   └── SuccessPage.tsx     # Payment success page
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   ├── useFormData.ts      # Form state management
│   └── useSubscription.ts  # Subscription status
├── lib/                    # External library configs
│   ├── supabase.ts         # Supabase client
│   ├── auth.ts             # Authentication functions
│   ├── stripe.ts           # Stripe integration
│   └── validations.ts      # Zod schemas
├── types/                  # TypeScript definitions
│   └── index.ts            # Type definitions
├── utils/                  # Utility functions
│   ├── cn.ts               # Class name utility
│   └── constants.ts        # App constants
├── stripe-config.ts        # Stripe product config
├── App.tsx                 # Main app component
├── main.tsx                # React entry point
└── index.css               # Global styles

supabase/
├── functions/              # Edge functions
│   ├── stripe-checkout/    # Checkout session creation
│   └── stripe-webhook/     # Payment webhook handler
└── migrations/             # Database migrations
```

## 🔒 Security Features

### Authentication
- **Email/Password Auth**: Secure authentication with Supabase
- **Session Management**: Automatic token refresh
- **Protected Routes**: Authentication required for payments
- **User Context**: Secure user data access

### Database Security
- **Row Level Security**: Database-level access control
- **User Isolation**: Users can only access their own data
- **Secure Queries**: Parameterized queries prevent SQL injection
- **Audit Trail**: Created/updated timestamps on all records

### Payment Security
- **PCI Compliance**: Stripe handles card data
- **Webhook Verification**: Signed webhook validation
- **Secure Endpoints**: Authentication required for payments
- **Data Encryption**: All sensitive data encrypted at rest

### Input Validation
- **Zod Schemas**: Runtime type validation
- **Frontend Validation**: Immediate user feedback
- **Backend Validation**: Server-side validation
- **Sanitization**: Input sanitization and validation

## 📱 Mobile Optimization

### Responsive Design
- **Mobile-First**: Designed for mobile, enhanced for desktop
- **Breakpoints**: Custom breakpoints for optimal viewing
- **Touch-Friendly**: Large touch targets and gestures
- **Viewport Optimization**: Proper viewport meta tags

### Performance
- **Code Splitting**: Lazy loading for better performance
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Proper caching headers and service worker ready

### User Experience
- **Progressive Enhancement**: Works without JavaScript
- **Offline Support**: Service worker ready
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error recovery

## 🎨 Design System

### Colors
```css
/* Primary Colors */
--blue-400: #60a5fa;
--blue-500: #3b82f6;
--blue-600: #2563eb;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-800: #1f2937;
--gray-900: #111827;

/* Semantic Colors */
--green-400: #4ade80;  /* Success */
--red-400: #f87171;    /* Error */
--yellow-400: #facc15; /* Warning */
```

### Typography
- **Font Family**: Inter (system fallback)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Line Heights**: 1.2 (headings), 1.5 (body), 1.6 (large text)
- **Font Sizes**: Responsive scale from 0.75rem to 3rem

### Spacing
- **Grid System**: 8px base unit
- **Padding**: 0.5rem, 1rem, 1.5rem, 2rem, 3rem
- **Margins**: Consistent spacing using Tailwind's spacing scale
- **Breakpoints**: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

### Components
- **Buttons**: Primary, secondary, outline, ghost variants
- **Cards**: Elevated cards with hover states
- **Forms**: Consistent form styling with validation states
- **Modals**: Overlay modals with backdrop blur

## 📊 Analytics & Monitoring

### Performance Metrics
- **Core Web Vitals**: Lighthouse score optimization
- **Bundle Size**: Webpack bundle analyzer
- **Load Times**: Performance monitoring
- **Error Tracking**: Error boundary implementation

### User Analytics
- **Form Analytics**: Conversion tracking
- **Payment Tracking**: Payment success/failure rates
- **User Journey**: Step-by-step user flow tracking
- **A/B Testing**: Ready for feature flag implementation

### Business Metrics
- **Conversion Rates**: Form submission to payment
- **Customer Acquisition**: New user registration
- **Revenue Tracking**: Payment processing metrics
- **Partner Acquisition**: Business registration rates

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**
   ```bash
   # Connect your Git repository to Netlify
   ```

2. **Build Settings**
   ```bash
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   ```bash
   # Add in Netlify dashboard
   VITE_SUPABASE_URL=your-production-url
   VITE_SUPABASE_ANON_KEY=your-production-key
   VITE_STRIPE_PUBLISHABLE_KEY=your-production-stripe-key
   ```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Stripe products created
- [ ] Webhook endpoints configured
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Error monitoring enabled
- [ ] Analytics tracking enabled

## 🔧 Configuration

### Supabase Configuration

```typescript
// lib/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Stripe Configuration

```typescript
// stripe-config.ts
export const STRIPE_PRODUCTS = [
  {
    id: 'prod_early_access',
    priceId: 'price_1234567890',
    name: 'Partner Listing Early Access (Lifetime)',
    description: 'Lifetime visibility to remote workers',
    mode: 'payment',
    price: 49.00
  }
];
```

### Form Validation

```typescript
// lib/validations.ts
export const businessSchema = z.object({
  name: z.string().min(2, 'Business name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(9, 'Valid phone required'),
  category: z.string().min(1, 'Category required'),
  neighborhood: z.string().min(1, 'Neighborhood required'),
});
```

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Run E2E tests
npm run test:e2e

# Run component tests
npm run test:components
```

### Manual Testing Checklist

#### Authentication Flow
- [ ] User registration works
- [ ] Login/logout functionality
- [ ] Session persistence
- [ ] Protected route access

#### Payment Flow
- [ ] Checkout session creation
- [ ] Payment processing
- [ ] Webhook handling
- [ ] Success page display

#### Form Validation
- [ ] Required field validation
- [ ] Email format validation
- [ ] Phone number validation
- [ ] Error message display

#### Responsive Design
- [ ] Mobile layout (320px+)
- [ ] Tablet layout (768px+)
- [ ] Desktop layout (1024px+)
- [ ] Touch interactions

## 🔍 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check Supabase URL and key
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

#### Stripe Integration
```bash
# Verify webhook endpoint
curl -X POST https://your-project.supabase.co/functions/v1/stripe-webhook
```

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run dev
```

## 📈 Performance Optimization

### Bundle Size
- **Code Splitting**: React.lazy() for route-based splitting
- **Tree Shaking**: Unused code elimination
- **Dynamic Imports**: Lazy loading of heavy components
- **Bundle Analysis**: webpack-bundle-analyzer integration

### Runtime Performance
- **React DevTools**: Performance profiling
- **Memoization**: React.memo and useMemo optimization
- **Virtual Scrolling**: For large lists (if needed)
- **Image Optimization**: WebP format with fallbacks

### Network Optimization
- **API Caching**: Supabase query caching
- **CDN Integration**: Static asset delivery
- **Compression**: Gzip/Brotli compression
- **Service Worker**: Cache-first strategy

## 🤝 Contributing

### Development Workflow

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd worktugal-pass-portal
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**
   ```bash
   # Follow coding standards
   # Add tests for new features
   # Update documentation
   ```

5. **Test Changes**
   ```bash
   npm run test
   npm run build
   ```

6. **Submit Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

### Coding Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Commit message format

### Code Review Process

1. **Automated Checks**: ESLint, TypeScript, tests
2. **Manual Review**: Code quality, design patterns
3. **Testing**: Feature testing in staging
4. **Approval**: Two approvals required
5. **Merge**: Squash and merge strategy

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

Built by the Worktugal team for the Lisbon remote work community.

## 📞 Support

### Technical Support
- **Email**: dev@worktugal.com
- **Documentation**: This README
- **Issue Tracker**: GitHub Issues

### Business Support
- **Email**: partners@worktugal.com
- **Phone**: +351 912 345 678
- **Help Center**: https://help.worktugal.com

### Community
- **Discord**: https://discord.gg/worktugal
- **Twitter**: @worktugal
- **LinkedIn**: /company/worktugal

---

## 🎯 Project Status

- **Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: January 2025
- **Next Release**: Q2 2025

### Recent Updates
- ✅ Stripe integration completed
- ✅ Payment flow optimized
- ✅ Mobile responsiveness enhanced
- ✅ Security audit completed
- ✅ Performance optimizations applied

### Upcoming Features
- 🔄 Partner dashboard
- 🔄 Advanced analytics
- 🔄 Multi-language support
- 🔄 API for third-party integrations

*This is a production-ready application serving real customers in Lisbon's remote work ecosystem.*