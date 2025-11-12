# AnimAlert 🐾

AnimAlert is a comprehensive platform for reporting and managing animal-related incidents, conflicts, and presence reports. Built with the modern T3 Stack, it provides a robust solution for animal welfare and management.

## 🚀 Tech Stack

This project is built with the [T3 Stack](https://create.t3.gg/) and includes:

- **Frontend**: [Next.js 15](https://nextjs.org) with React 19
- **Backend**: [tRPC](https://trpc.io) for type-safe APIs
- **Database**: [PostgreSQL](https://postgresql.org) with [Drizzle ORM](https://orm.drizzle.team)
- **Authentication**: [Clerk](https://clerk.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) with [Radix UI](https://radix-ui.com)
- **Cloud Services**: AWS (S3, SNS)
- **Maps**: [Google Maps API](https://developers.google.com/maps)
- **Email**: [Nodemailer](https://nodemailer.com)
- **DevOps**: Docker, Nginx

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher)
- **npm** (v10 or higher)
- **Docker** and **Docker Compose**
- **Git**

## 🛠️ Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/stochaideas/animalert-open.git
cd animalert
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Configure the following environment variables in `.env`:

#### Database

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/animalert"
```

#### Authentication (Clerk)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

#### AWS Services

```env
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_REGION="eu-central-1"
AWS_S3_BUCKET_NAME="your_s3_bucket"
SNS_TOPIC_ARN="your_sns_topic_arn"
```

#### Google Maps

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID="your_map_id"
```

#### Email Configuration

```env
NODEMAILER_SERVICE="gmail"
EMAIL_ADMIN="admin@yoursite.com"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"
EMAIL_FROM="AnimAlert <noreply@yoursite.com>"
```

### 4. Database Setup

#### Start PostgreSQL Database

Use the provided script to start a local PostgreSQL instance:

```bash
chmod +x start-database.sh
./start-database.sh
```

This script will:

- Create a PostgreSQL Docker container
- Set up the database with credentials from your `.env` file
- Handle port conflicts and container management

#### Run Database Migrations

```bash
npm run db:migrate
```

#### Generate Database Schema (if needed)

```bash
npm run db:generate
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🎯 Available Scripts

### Development

```bash
npm run dev              # Start development server with Turbo
npm run build            # Build for production
npm run start            # Start production server
npm run preview          # Build and start production server
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run typecheck        # Run TypeScript compiler check
npm run check            # Run linting and type checking
npm run format:check     # Check code formatting
npm run format:write     # Format code with Prettier
```

### Database Operations

```bash
npm run db:generate      # Generate new migration files
npm run db:migrate       # Apply migrations to database
npm run db:push          # Push schema changes directly to database
npm run db:studio        # Open Drizzle Studio (database GUI)
```

### Testing

```bash
npm run test             # Run all unit tests (vitest run)
npm run test:unit        # Run Vitest tests
npm run test:e2e         # Run Playwright e2e tests
```

## 🗃️ Database Management

### Drizzle Studio

Access the database GUI at `http://localhost:4983`:

```bash
npm run db:studio
```

### Creating Migrations

1. Modify the schema in `src/server/db/schema.ts`
2. Generate migration:
   ```bash
   npm run db:generate
   ```
3. Apply migration:
   ```bash
   npm run db:migrate
   ```

### Database Schema

The main schema file is located at `src/server/db/schema.ts` and includes tables for:

- Users and authentication
- Animal incident reports
- Conflict reports
- Presence reports
- File uploads
- Administrative data

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── conflicte/         # Conflict reporting
│   ├── contact/           # Contact forms
│   ├── incidentele-mele/  # User incidents
│   ├── profil/            # User profile
│   ├── raporteaza-*/      # Reporting modules
│   └── sign-*/            # Authentication pages
├── components/            # Reusable UI components
│   ├── icons/             # SVG icons
│   └── ui/                # UI components (complex & simple)
├── constants/             # Application constants
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── server/                # Server-side code
│   ├── api/               # tRPC routers
│   └── db/                # Database configuration
├── styles/                # Global styles
├── trpc/                  # tRPC client configuration
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🐳 Docker Development

### Using Docker Compose

Start the entire application stack:

```bash
docker-compose up -d
```

This will start:

- Next.js application
- Nginx reverse proxy with SSL
- PostgreSQL database (if configured)

### Individual Container Commands

Build the Next.js container:

```bash
docker build -t animalert .
```

Run with custom environment:

```bash
docker run -p 3000:3000 --env-file .env animalert
```

## 🔒 Authentication & Authorization

The application uses Clerk for authentication with role-based access control:

### Roles

- **User**: Can create and manage their own reports
- **Admin**: Full access to all reports and administrative functions

### Protected Routes

- `/admin/*` - Admin only
- `/incidentele-mele/*` - Authenticated users
- `/profil/*` - Authenticated users
- `/raporteaza-*` - Authenticated users

## 📧 Email & SMS Configuration

### Email Setup (Nodemailer)

1. Configure Gmail app password or SMTP credentials
2. Update email environment variables
3. Test email functionality in development

### SMS Setup (AWS SNS)

1. Configure AWS credentials
2. Set up SNS topic for SMS alerts
3. Configure phone number verification

## � Phone Number Internationalization

The application supports international phone numbers with country code selection:

### Features

- **Country Code Selector**: Searchable dropdown with country flags and dial codes
- **Romanian Localization**: All country names displayed in Romanian
- **Phone Validation**: International format validation using libphonenumber
- **Default Country**: Defaults to Romania (RO) with +40 dial code
- **Supported Countries**: All major countries with proper flag emojis
- **Database Storage**: Country code stored separately in `users.country_code` field

### Country Code Selection

The phone input component includes:

- Flag emoji display
- Dial code prefix (+40, +1, +44, etc.)
- Searchable country list in Romanian
- Keyboard navigation support
- Mobile-responsive design

### Phone Format Examples

- Romania: `0712 345 678` → stored with country code `RO`
- United States: `202 555 0123` → stored with country code `US`
- Germany: `030 12345678` → stored with country code `DE`
- France: `01 23 45 67 89` → stored with country code `FR`

### Implementation

Phone numbers are validated based on the selected country code:

```typescript
// Schema validation with country code
countryCode: z.string().length(2).default("RO"),
phone: z.string().min(1, "Numărul de telefon este obligatoriu")
```

The `normalizePhoneNumber` utility handles international format conversion.

## �🗺️ Maps Integration

### Google Maps Setup

1. Enable Google Maps JavaScript API
2. Create and configure Map ID
3. Set up API key with proper restrictions
4. Configure billing for production use

### Features

- Interactive incident location selection
- Geolocation support
- Custom map styling
- Marker clustering for multiple incidents

## 🔧 Environment Variables Reference

### Required Variables

| Variable                            | Description                  | Example                                    |
| ----------------------------------- | ---------------------------- | ------------------------------------------ |
| `DATABASE_URL`                      | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key             | `pk_test_...`                              |
| `CLERK_SECRET_KEY`                  | Clerk secret key             | `sk_test_...`                              |

### Optional Variables

| Variable     | Description      | Default        |
| ------------ | ---------------- | -------------- |
| `NODE_ENV`   | Environment mode | `development`  |
| `AWS_REGION` | AWS region       | `eu-central-1` |

## 🧪 Testing

The project includes comprehensive testing infrastructure:

### Unit & Integration Tests (Vitest)

Run unit and integration tests:

```bash
npm run test:unit     # Run all tests (vitest run)
vitest                # Run tests in watch mode
```

Coverage thresholds are set to 90% for:

- Lines, functions, branches, and statements
- Includes lib/, constants/, server modules, and complex UI components
- Reports available in HTML, JSON, and text formats

### End-to-End Tests (Playwright)

Run e2e tests:

```bash
npm run test:e2e      # Run all e2e tests
npx playwright test --ui       # Run with Playwright UI
npx playwright test --debug    # Debug mode
```

E2E test coverage:

- Phone internationalization workflows
- Contact form submissions
- Report creation flows (incident, presence, conflict)
- Mobile responsiveness
- Keyboard navigation and accessibility

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Code Formatting

```bash
npm run format:check
npm run format:write
```

## 📦 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Docker Deployment

1. Build production image:

   ```bash
   docker build -t animalert:production .
   ```

2. Deploy with docker-compose:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment Considerations

- Use production database URL
- Configure proper AWS credentials
- Set up SSL certificates for HTTPS
- Configure proper CORS settings
- Set secure environment variables

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database container
./start-database.sh
```

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Check for type errors
npm run typecheck

# Update TypeScript
npm install typescript@latest
```

### Environment Issues

- Verify all required environment variables are set
- Check API key permissions and quotas
- Ensure database credentials are correct
- Validate AWS permissions for S3 and SNS

### Code Standards

- Follow the existing code style
- Add TypeScript types for all new code
- Include proper error handling
- Write meaningful commit messages
- Test your changes thoroughly

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Clerk Authentication](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI Components](https://radix-ui.com/docs)
