# ⚡ Quick Install Guide

## One-Command Installation

### Windows
```bash
install.bat
```

### Linux/Mac
```bash
chmod +x install.sh && ./install.sh
```

## That's It! 🎉

The script automatically:
- ✅ Installs dependencies
- ✅ Sets up environment
- ✅ Creates database tables
- ✅ Applies all migrations
- ✅ Creates indexes

## Next Steps

```bash
# Start development server
npm run dev

# Visit
http://localhost:3000

# Create your first agency
http://localhost:3000/agency/onboarding
```

## Requirements

- Node.js 18+
- PostgreSQL 14+
- Database created: `CREATE DATABASE parichay;`

## Troubleshooting

**Database error?**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE parichay;"
```

**Permission error?**
```sql
GRANT ALL PRIVILEGES ON DATABASE parichay TO your_user;
```

**Need to reset?**
```bash
npx prisma migrate reset
npx prisma db push
```

## Documentation

- `INSTALL_README.md` - Quick start
- `INSTALLATION_GUIDE.md` - Detailed guide
- `INSTALLATION_COMPLETE.md` - Complete checklist

## What Gets Installed

- Multi-tenant platform
- Agency management
- Client management
- Billing system
- MFA support
- Verification system
- Premium features
- 30+ performance indexes

---

**Total installation time: 2-5 minutes** ⏱️
