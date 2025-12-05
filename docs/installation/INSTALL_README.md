# 🚀 Installation Instructions

## Quick Start

### Windows

```bash
# Run the installation script
install.bat
```

### Linux/Mac

```bash
# Make script executable
chmod +x install.sh

# Run the installation script
./install.sh
```

### Manual Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Generate Prisma client
npx prisma generate

# 4. Push database schema
npx prisma db push

# 5. Start development
npm run dev
```

## What Gets Installed

The installation script will:

1. ✅ Install all npm dependencies
2. ✅ Create `.env` file from template
3. ✅ Generate Prisma client
4. ✅ Create all database tables
5. ✅ Apply all migrations
6. ✅ Create indexes for performance

## Database Migrations

All migrations are automatically applied during installation:

- **White-Label Platform** - Multi-tenant support
- **MFA** - Multi-factor authentication
- **Verification System** - Profile verification
- **Short Links** - URL shortener
- **Premium Features** - Social proof, portfolios, offers
- **Performance Indexes** - Query optimization

## Requirements

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Environment Variables

Required variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/parichay"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
pg_isready

# Create database if it doesn't exist
psql -U postgres -c "CREATE DATABASE parichay;"
```

### Permission Errors

```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE parichay TO your_user;
```

### Migration Errors

```bash
# Reset and retry
npx prisma migrate reset
npx prisma db push
```

## Post-Installation

After installation:

1. Start server: `npm run dev`
2. Visit: http://localhost:3000
3. Create agency: http://localhost:3000/agency/onboarding

## Documentation

- `INSTALLATION_GUIDE.md` - Detailed installation guide
- `WHITE_LABEL_IMPLEMENTATION_SUMMARY.md` - Feature overview
- `AGENCY_PORTAL_COMPLETE.md` - Complete feature guide
- `AGENCY_QUICK_REFERENCE.md` - Developer reference

## Support

For issues:
- Check `INSTALLATION_GUIDE.md`
- Review error messages
- Verify database connection
- Check environment variables

---

**Ready to build your white-label platform!** 🎉
