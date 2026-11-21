# hastinamotorparts.com: Full-Stack B2B Export Platform

**Company:** ALISONS GENERAL TRADING LLP  
**Tagline:** Motorcycle • Scooter • Tuk Tuk Spare Parts — From India to the World  
**Office:** Unit No. 43, Ground Floor, Living Style Mall, Jasola, New Delhi – 110025, India  
**Business Model:** B2B Wholesale Export with Quotation Enquiry Engine (No Consumer Cart / Payment)  
**UI Reference:** Maruti Suzuki Genuine Parts (`marutisuzuki.com/genuine-parts`)

---

## 1. System Architecture

```
                    ┌────────────────────────────┐
                    │ Nginx Reverse Proxy (SSL)  │
                    │ Ports: 80 / 443            │
                    └─────────────┬──────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
      ┌─────────────────────┐           ┌─────────────────────┐
      │  Next.js 14 Web App │           │   Node/Express API  │
      │  Port: 3000         │           │   Port: 4000        │
      └─────────────────────┘           └──────────┬──────────┘
                                                   │
                            ┌──────────────────────┴──────────────────────┐
                            ▼                                             ▼
                 ┌─────────────────────┐                       ┌─────────────────────┐
                 │ PostgreSQL (Prisma) │                       │     Meilisearch     │
                 │ Port: 5432          │                       │     Port: 7700      │
                 └─────────────────────┘                       └─────────────────────┘
```

---

## 2. Directory Structure

```
hastina-motor-parts/
├── apps/
│   ├── web/                        # Next.js 14 App Router Frontend & Admin Portal
│   │   ├── app/
│   │   │   ├── (public)/           # Home, /about, /brands, /models, /parts, /part/[slug], /enquiry, /markets, /contact, /faq
│   │   │   ├── admin/              # Role-protected Admin Panel (/admin, /parts, /brands, /enquiries, /import, /analytics)
│   │   │   ├── sitemap.ts          # Dynamic XML Sitemap generator
│   │   │   └── robots.ts           # Dynamic robots.txt
│   │   ├── components/             # Header, MegaMenu, VehicleSelectorModal, SearchBar, PartCard, Footer
│   │   ├── lib/                    # api client, enquiryContext, vehicleContext, adminAuthContext
│   │   └── Dockerfile
│   └── api/                        # Express REST API (TypeScript)
│       ├── src/
│       │   ├── modules/            # auth, brands, models, categories, parts, search, enquiries, analytics, settings
│       │   ├── middleware/         # auth (JWT), rbac, rateLimit, errorHandler
│       │   ├── utils/              # importExcel, exportExcel, normalizePartNo, slugify
│       │   ├── store.ts            # Data store & repository layer with seed dataset preloaded
│       │   └── server.ts           # Express server setup
│       ├── prisma/                 # schema.prisma, seed.ts
│       └── Dockerfile
├── prisma/                         # Root copy of Prisma schema
├── nginx/
│   └── nginx.conf                  # Production reverse proxy with SSL, gzip and caching
├── docker-compose.yml              # Multi-container orchestration (postgres, meilisearch, api, web, nginx)
├── .env.example                    # Environment variables template
└── README.md
```

---

## 3. Getting Started Locally

### Prerequisites
- Node.js v20+ or v24
- npm 10+

### Option A: Running Development Server (Instant Standalone Mode)

Both the Express API and Next.js frontend are built with a robust in-memory repository layer that comes preloaded with the complete catalogue (Bajaj, TVS, Honda, Yamaha, Suzuki, Vespa, Aprilia, Piaggio, Tuk Tuks, etc.). This allows immediate testing with **zero database configuration required**:

```bash
# 1. Install dependencies for both apps
cd apps/api && npm install
cd ../web && npm install

# 2. Start the Express REST API (runs on port 4000)
cd apps/api
npm run dev

# 3. In another terminal, start Next.js web application (runs on port 3000)
cd apps/web
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser!

---

## 4. Admin Portal Access

The admin portal is accessible at:
- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email:** `admin@hastinamotorparts.com`
- **Password:** `Hastina@2026`

### Admin Features:
1. **Operations Dashboard:** Real-time metrics on incoming wholesale enquiries, SKU count, and **zero-result search analytics**.
2. **Parts Management (`/admin/parts`):** Create, edit, and delete parts with OEM numbers, alt numbers, specs, MOQ, and compatible model fitments.
3. **Bulk Excel/CSV Import (`/admin/import`):** Upload bulk spreadsheets with instant validation report and downloadable sample template.
4. **Excel Export:** Download entire catalogue with fitments in 1 click.
5. **Enquiry Manager (`/admin/enquiries`):** Track quotes across `NEW`, `QUOTED`, `WON`, `LOST` statuses, view customer messages, and send quotation emails.
6. **Search & Zero-Results Logs (`/admin/analytics`):** Track unmatched part queries from international buyers to capture immediate uncatalogued demand.

---

## 5. Production Deployment (Ubuntu VPS + Docker + Let's Encrypt SSL)

### Step 1: Provision Ubuntu Server & Install Docker
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw

# Install Docker & Docker Compose plugin
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Step 2: Clone Repository & Configure Environment
```bash
git clone https://github.com/your-org/hastinamotorparts.git /var/www/hastinamotorparts
cd /var/www/hastinamotorparts

# Copy environment variables
cp .env.example .env
nano .env  # Update domain, secrets, and SMTP credentials
```

### Step 3: Obtain Free Let's Encrypt SSL Certificate
```bash
sudo apt install -y certbot

# Stop any service on port 80 temporarily
sudo certbot certonly --standalone -d hastinamotorparts.com -d www.hastinamotorparts.com -d api.hastinamotorparts.com
```

### Step 4: Spin up Docker Compose Stack
```bash
docker compose up --build -d

# Run Prisma database migrations and seed script
docker compose exec -T api npx prisma migrate deploy
docker compose exec -T api npm run seed
```

---

## 6. Verification & Quality Checklist

- [x] **Maruti Suzuki Genuine Parts Feel:** Full-width sections, centered `max-w-screen-2xl` container, clean automotive styling.
- [x] **Select Vehicle Modal:** 4-step wizard (Type > Brand > Model > Year). Selection is saved in `localStorage`, appears in header, and dynamically filters listings across the site.
- [x] **3-Level Mega Menu:** Desktop dropdown (Category > Subcategory > Part type) and mobile responsive drawer.
- [x] **No Cart / Quotation Engine:** Replaced cart with reactive **Enquiry List** with MOQ indicators, bulk OEM paste tool, reference number generation (`ENQ-YYYY-000123`), and WhatsApp follow-up.
- [x] **Part Number Normalization:** Strips spaces, dashes, dots, and slashes (`12345-ABC-000` = `12345ABC000`) with exact matches ranked first.
- [x] **Zero-Result Searches:** When no catalogue part is found, provides a 1-click "Request Quotation for This Part" button and logs zero-matches to the admin analytics dashboard.
- [x] **Bulk Excel Import/Export:** Dedicated parser for Excel (`.xlsx`) and CSV with column verification, warning reports, and template downloads.
- [x] **SEO & Accessibility:** OpenGraph tags, JSON-LD Schema (`Organization`), dynamic `sitemap.xml`, and `robots.txt`.
