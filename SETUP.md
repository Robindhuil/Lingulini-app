# Lingulini App - Language Learning for Children 🌍

A playful, child-friendly language learning platform built with Next.js 15, Prisma 7, and NextAuth v5.

## 🚀 Quick Start

### 1. Environment Setup

The `.env` file is configured with:
- `NODE_ENV=development`
- `NEXTAUTH_URL=http://localhost:3000`
- `NEXTAUTH_SECRET` (secure random secret for JWT signing)
- `DATABASE_URL` (Postgres connection string)
- Postgres credentials for Docker container

### 2. Start Database

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16** on `localhost:5432`
- **Adminer** UI on `http://localhost:8080`

### 3. Database Migration & Seed

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

This creates:
- Database schema (User table with email-based auth)
- Language learning preferences fields
- Admin user:
  - **Email:** `admin@lingulini.com`
  - **Password:** `admin123`
  - **Role:** `ADMIN`

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🎨 Design Features

- **Playful UI:** Colorful, child-friendly design with emojis and animations
- **Dark/Light Mode:** Fully themed with CSS custom properties
- **Responsive:** Mobile-first design that works on all devices
- **Accessible:** ARIA labels and semantic HTML

### Color Palette

**Light Mode:**
- Primary (Indigo): `#6366f1`
- Secondary (Pink): `#ec4899`
- Accent (Amber): `#f59e0b`

**Dark Mode:**
- Softer versions of all colors for comfortable viewing

## 📦 Tech Stack

- **Next.js 15** with App Router
- **Prisma 7** with PostgreSQL adapter (`@prisma/adapter-pg`)
- **NextAuth.js v5** (credentials provider with email/password)
- **Docker Compose** for local Postgres
- **i18n** (multi-language UI support: EN, DE, NL, SK)
- **Tailwind CSS** with custom playful design system
- **Lucide Icons** for beautiful, consistent icons

## 🗄️ Database

### Adminer Access
URL: `http://localhost:8080`
- System: `PostgreSQL`
- Server: `db`
- Username: `lingulini`
- Password: `lingulini`
- Database: `lingulini`

### Prisma Studio (Alternative)
```bash
npx prisma studio
```

## 🔑 Authentication

Default admin credentials:
- **Email:** `admin@lingulini.com`
- **Password:** `admin123`

Login at: `http://localhost:3000/login`

**Note:** Authentication now uses **email/password** (not username)

## 📁 Project Structure

```
app/
├── (root)/         # Main app routes
│   ├── page.tsx    # Home page with language selection
│   ├── login/      # Login page
│   └── adminpanel/ # Admin dashboard
├── actions/        # Server actions
├── api/            # API routes (NextAuth)
├── i18n/           # Internationalization
├── locales/        # Translation files
├── theme/          # Theme provider (dark/light mode)
└── globals.css     # Playful design system & CSS variables

components/         # React components
├── Navbar.tsx      # Simplified navigation
├── Footer.tsx      # Language learning footer
├── LoginForm.tsx   # Email-based login
└── LanguageSelector.tsx

lib/               # Utilities & configs
prisma/            # Database schema & migrations
```

## 🎮 Features

### Home Page
- Welcoming hero section
- Language selection cards (English, Spanish, French, German)
- Fun features showcase
- Community stats

### Navigation
- Clean, playful navbar with emoji icons
- Theme toggle (dark/light mode)
- Language selector
- Conditional admin panel access

### Authentication
- Email/password login
- Session management with NextAuth v5
- Protected routes

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Database
docker compose up -d          # Start DB
docker compose down           # Stop DB
docker compose down -v        # Stop DB and remove volumes

# Prisma
npx prisma generate           # Generate client
npx prisma migrate dev        # Run migrations
npx prisma db seed            # Seed database
npx prisma studio             # Open Prisma Studio
npx prisma migrate reset      # Reset DB (dev only)
```

## 🔧 Troubleshooting

### Prisma Client Error
If you see "did not initialize yet" error:
```bash
npx prisma generate
```

### Database Connection
Verify Docker container is running:
```bash
docker ps | grep lingulini-postgres
```

Check connection:
```bash
psql postgresql://lingulini:lingulini@localhost:5432/lingulini
```

### Port Conflicts
If ports 3000, 5432, or 8080 are in use, update:
- `docker-compose.yml` (DB ports)
- `.env` (DATABASE_URL)
- Next.js uses `PORT` env var

### Migration Issues
If migrations fail, reset and recreate:
```bash
source .env
npx prisma migrate reset
npx prisma migrate dev
npx prisma db seed
```

## 🌈 Design System

### Custom CSS Classes

```css
/* Buttons */
.btn-playful       /* Base playful button with hover scale */
.btn-primary       /* Primary action button */
.btn-secondary     /* Secondary action button */
.btn-accent        /* Accent/highlight button */

/* Cards */
.card-playful      /* Elevated card with hover effect */

/* Gradients */
.gradient-fun      /* Primary to secondary gradient */
.gradient-learning /* Multi-language gradient */

/* Animations */
.animate-bounce-subtle  /* Gentle bounce animation */
.animate-float          /* Floating animation */

/* Colors */
.bg-primary, .text-primary
.bg-secondary, .text-secondary
.bg-accent, .text-accent
.text-success, .text-error, .text-warning
```

## 📝 Notes

- **Prisma 7** requires database adapter (`@prisma/adapter-pg` with `pg` driver)
- **NextAuth v5** (beta) uses new configuration format
- Database runs in Docker with persistent volume
- All text uses playful, child-friendly language
- Emojis enhance visual appeal and engagement
- Theme persists across sessions

## 🎯 Next Steps

1. Create language learning modules
2. Add interactive games and activities
3. Implement progress tracking
4. Build parent dashboard
5. Add more language options
6. Create achievement/badge system

---

Made with ❤️ for young language learners worldwide! 🚀
