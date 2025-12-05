# 🎴 Parichay.io - White-Label Digital Business Card Platform

> Transform your agency with a complete white-label digital business card platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14.0-blue.svg)](https://www.postgresql.org/)

## 🚀 Quick Start

### One-Command Installation

**Windows:**
```bash
cd setup
install.bat
```

**Linux/Mac:**
```bash
cd setup
chmod +x install.sh
./install.sh
```

### What You Get

- ✅ Multi-tenant white-label platform
- ✅ Agency management system
- ✅ Client management & billing
- ✅ Microsite builder
- ✅ QR code generation
- ✅ Analytics & CRM
- ✅ Custom branding & domains

## 📚 Documentation

**Start Here:**
- [Installation Guide](docs/installation/INSTALLATION_GUIDE.md)
- [Quick Start](docs/getting-started/QUICK_START.md)
- [Agency Portal Guide](docs/agency/AGENCY_PORTAL_COMPLETE.md)

**Full Documentation:** [docs/README.md](docs/README.md)

## 🏗️ Project Structure

```
parichay/
├── setup/                  # Installation scripts
│   ├── install.bat        # Windows installer
│   ├── install.sh         # Linux/Mac installer
│   └── sql/               # Database setup
├── docs/                   # Complete documentation
│   ├── installation/      # Setup guides
│   ├── agency/           # Agency platform
│   ├── guides/           # User guides
│   └── features/         # Feature docs
├── src/                    # Application source
│   ├── app/              # Next.js app
│   ├── components/       # React components
│   └── lib/              # Utilities
├── prisma/                 # Database schema
└── public/                 # Static assets
```

## 🎯 Features

### For Agencies
- **White-Label Platform** - Your brand, your domain
- **Client Management** - Manage unlimited clients
- **Billing System** - Automated monthly billing
- **Custom Branding** - Logo, colors, domain
- **Analytics Dashboard** - Track all clients

### For Clients
- **Microsite Builder** - Drag-and-drop builder
- **QR Codes** - Dynamic QR code generation
- **Lead Management** - Built-in CRM
- **Analytics** - Visitor tracking
- **Custom Themes** - Multiple design options

### Technical
- **Multi-Tenant** - Complete data isolation
- **Scalable** - Handles thousands of agencies
- **Secure** - MFA, role-based access
- **Fast** - Optimized with 30+ indexes
- **Modern** - Next.js 14, React 18, TypeScript

## 💻 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Requirements

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## 🔧 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourrepo/parichay.git
cd parichay/onetouch-bizcard
```

### 2. Run Installer

```bash
# Windows
cd setup
install.bat

# Linux/Mac
cd setup
chmod +x install.sh
./install.sh
```

### 3. Start Development

```bash
npm run dev
```

Visit: http://localhost:3000

### 4. Create Your Agency

Go to: http://localhost:3000/agency/onboarding

## 🎓 Usage

### Create an Agency

1. Sign up at `/signup`
2. Complete onboarding at `/agency/onboarding`
3. Customize branding at `/agency/settings`
4. Add clients at `/agency/clients`

### Manage Clients

1. Add client with brand ID
2. Set monthly fee
3. Track usage and billing
4. View analytics

### Customize Branding

1. Upload logo and favicon
2. Set primary, secondary, accent colors
3. Configure custom domain
4. Toggle "Powered by Parichay"

## 📊 Pricing

### Agency Plans

| Plan | Monthly | Clients | Features |
|------|---------|---------|----------|
| **Starter** | $99 | 10 | Basic portal, subdomain |
| **Pro** | $299 | 50 | Custom domain, full white-label |
| **Enterprise** | $999 | Unlimited | API access, custom features |

**Plus**: $10/month per active client

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📖 Documentation

### Quick Links
- [Installation](docs/installation/QUICK_INSTALL.md)
- [Agency Guide](docs/agency/AGENCY_PORTAL_COMPLETE.md)
- [API Reference](docs/agency/AGENCY_QUICK_REFERENCE.md)
- [Testing](docs/testing/TESTING_GUIDE.md)

### Full Documentation
See [docs/README.md](docs/README.md) for complete documentation.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/README.md](docs/README.md)
- **Installation Help**: [docs/installation/INSTALLATION_GUIDE.md](docs/installation/INSTALLATION_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/yourrepo/parichay/issues)
- **Email**: support@parichay.io

## 🗺️ Roadmap

- [x] Multi-tenant platform
- [x] Agency management
- [x] Client management
- [x] Billing system
- [x] Custom branding
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Mobile app
- [ ] API access
- [ ] Marketplace

See [Enterprise Roadmap](docs/business/ENTERPRISE_ROADMAP.md) for details.

## 🎉 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

## 📞 Contact

- **Website**: https://parichay.io
- **Email**: support@parichay.io
- **Twitter**: [@parichay_io](https://twitter.com/parichay_io)

---

**Made with ❤️ by the Parichay Team**

[Get Started](setup/install.bat) | [Documentation](docs/README.md) | [Demo](https://demo.parichay.io)
