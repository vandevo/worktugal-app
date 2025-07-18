# Worktugal Pass - Partner Portal

A production-ready, mobile-first B2B web application for Worktugal Pass — Lisbon's trusted perk marketplace for remote professionals and expats.

## 🎯 Purpose

This self-serve partner portal allows local businesses to:
- Submit their business information and perk offers
- Pay a one-time listing fee (€59)
- Appear in a live public directory
- Reach 1,000+ verified remote workers in Lisbon

## ✨ Key Features

- **Multi-step Partner Submission**: Clean, intuitive form wizard for business registration
- **Secure Payment Integration**: Stripe-powered payment processing
- **Public Perks Directory**: Filterable catalog of partner offers
- **Mobile-First Design**: Responsive, iOS-inspired UI with dark mode
- **Real-time Validation**: Form validation with helpful error messages
- **Smooth Animations**: Framer Motion powered transitions

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite
- **Backend**: Supabase (Database + Auth)
- **Payments**: Stripe
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Netlify

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn

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

Create a `.env.local` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── forms/          # Form components
│   ├── ui/             # Reusable UI components
│   └── Layout.tsx      # App layout wrapper
├── hooks/              # Custom React hooks
├── lib/                # External library configurations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants
└── App.tsx            # Main application component
```

## 🎨 Design System

- **Colors**: Dark mode with blue/purple accents
- **Typography**: Inter font family
- **Icons**: Lucide React icon library
- **Spacing**: 8px grid system
- **Breakpoints**: Mobile-first responsive design

## 🔒 Security Features

- Form validation with Zod schemas
- Secure payment processing through Stripe
- Row Level Security (RLS) with Supabase
- Input sanitization and validation

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly interactions
- Optimized form flows for mobile
- Sticky navigation and CTAs

## 🚀 Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_production_stripe_key
```

## 📊 Performance

- Optimized bundle size with tree shaking
- Lazy loading for better initial load times
- Optimized images and assets
- Efficient state management

## 🧪 Testing

```bash
npm run test
```

## 📈 Analytics & Monitoring

- Built-in form analytics
- Payment tracking
- User interaction monitoring
- Performance metrics

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations in `supabase/migrations/`
3. Set up Row Level Security policies
4. Configure authentication settings

### Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Set up webhook endpoints for payment confirmations
4. Configure payment methods and pricing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

Built by the Worktugal team for the Lisbon remote work community.

## 📞 Support

For support, email partners@worktugal.com or visit our help center.

---

*This is a production-ready application serving real customers in Lisbon's remote work ecosystem.*