# hastinamotorparts.com: Full-Stack Build Specification

**Company:** ALISONS GENERAL TRADING LLP
**Website:** www.hastinamotorparts.com
**Tagline:** Motorcycle • Scooter • Tuk Tuk Spare Parts — From India to the World
**Business model:** B2B export catalogue with **enquiry / quotation flow** (no online payment, no consumer cart)
**UI reference:** https://www.marutisuzuki.com/genuine-parts (layout, mega menu, vehicle selector, category structure)

---

## 1. Project Goal

Build a fast, full-width, fully responsive website where international importers, wholesalers, distributors and dealers can:

1. Browse spare parts by **Brand → Model → Category → Part**.
2. Search by **part number (OEM/OES)**, part name or model.
3. Add parts to an **Enquiry List** (instead of a cart) and send one consolidated quotation request.
4. Contact the company via form, WhatsApp or email.

The admin team must manage the entire catalogue, enquiries and content without touching code.

---

## 2. Business Content (use exactly in the site)

### 2.1 Home hero
**ALISONS GENERAL TRADING LLP**
Motorcycle • Scooter • Tuk Tuk Spare Parts — From India to the World
*Your Reliable Export Partner for Two-Wheeler & Three-Wheeler Spare Parts*

We are an India-based exporter of genuine and quality aftermarket spare parts for motorcycles, scooters, and tuk-tuks.
Brand strip: Bajaj • TVS • Honda • Yamaha • Suzuki • Vespa • Aprilia • Piaggio
CTA buttons: **Send Enquiry**, **Browse Parts**

### 2.2 About Us
Alisons General Trading LLP is an India-based exporter specializing in motorcycle, scooter, and tuk-tuk / three-wheeler spare parts. We supply genuine and quality aftermarket parts for leading brands including Bajaj, TVS, Honda, Yamaha, Suzuki, Vespa, Aprilia, and Piaggio.

We serve importers, wholesalers, distributors, and spare-parts dealers across the Middle East, Africa, Asia, Europe, and South America, with a strong focus on Iraq, UAE, Saudi Arabia, Iran, Afghanistan, Turkey, Libya, Algeria, Ghana, Angola, Senegal, South Africa and Argentina.

Send us your part numbers or requirements today for availability and competitive export pricing.

### 2.3 Brands and Models (seed data)

| Brand | Models |
|---|---|
| Bajaj | Pulsar, Avenger, Discover, Boxer, RE / Tuk Tuk |
| TVS | Apache RTR, Wego, Jupiter, Ntorq |
| Honda | Shine, Unicorn 160, Activa 125, Activa 6G |
| Yamaha | Aerox 155, RayZR 125 |
| Suzuki | Gixxer 150/160, Gixxer SF 250, Access, Burgman, Avenis |
| Vespa | VXL 125, VXL 150, Vespa Classic, PX |
| Aprilia | SR 125, SR 150, SR 160, SR 175 |
| Piaggio | (add models later from admin) |

> Note: the company profile document also lists Suzuki Access 125, Burgman Street, Gixxer 250, V-Strom SX and several Vespa Tech/Qala variants. Keep the model list editable from admin so these can be added without code changes.

### 2.3.1 Optional module: Car spare parts
Selected Suzuki / Maruti Suzuki, Hyundai and Kia car parts (Alto K10, S-Presso, Celerio, WagonR, Swift, Baleno, Ignis, Dzire, Ciaz, Brezza, Fronx, Grand Vitara, Jimny, Victoris, Ertiga, XL6, Invicto, Eeco, e VITARA). Implement as a second **vehicle type = Car** in the same schema; show the section only if enabled in admin settings.

### 2.4 Part categories (for the 3-level tree)

Engine Parts • Clutch Parts • Transmission Parts • Brake Parts • Electrical Parts • Suspension Parts • Drive Belts • Rollers • Filters • Cables • Body Parts • Bearings • Gaskets • Piston & Cylinder Parts • Other Replacement Parts

### 2.5 Why choose us (home section)
Genuine and quality aftermarket parts • Reliable sourcing from India • Competitive export pricing • Wide range of models • Part-number based sourcing • Bulk and regular orders • Export documentation and shipment coordination • Worldwide supply

### 2.6 Markets
Middle East • Africa • Asia • Europe • South America
Key markets: Iraq, UAE, Saudi Arabia, Iran, Afghanistan, Turkey, Libya, Algeria, Ghana, Angola, Senegal, South Africa, Argentina.

### 2.7 Contact
ALISONS GENERAL TRADING LLP
Unit No. 43, Ground Floor, Living Style Mall, Jasola, New Delhi – 110025, India
CTA: *Send us your model, OEM/OES part number, product list, photograph, or spare-parts requirement. We will check availability, sourcing options, and competitive export pricing.*

(Phone, WhatsApp number and email: **to be provided by client**; store in `site_settings`.)

---

## 3. Site Map and Pages

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero, brand strip, shop by brand, categories, featured parts, why choose us, markets, enquiry CTA |
| `/about` | About Us | Content from 2.2 |
| `/brands` | All brands | Grid of brand cards |
| `/brands/[brand]` | Brand page | Models of that brand |
| `/models/[brand]/[model]` | Model page | Categories and parts for that model (like Maruti `/swift-parts`) |
| `/parts` | Parts search/listing | Filters + sort + pagination |
| `/parts/[category]` | Category | |
| `/parts/[category]/[subcategory]` | Sub-category | |
| `/part/[slug]` | Part detail | Specs, fitment list, **Add to Enquiry** |
| `/enquiry` | Enquiry list + form | Consolidated quotation request |
| `/markets` | Our Markets | Country chips / map |
| `/contact` | Contact | Form, address, map, WhatsApp |
| `/faq`, `/terms`, `/privacy`, `/sitemap` | Static | Editable from admin |
| `/admin/*` | Admin panel | Protected |

---

## 4. UI/UX Requirements (Maruti-style, full screen)

- **Full-width layout:** sections span 100% viewport width; inner content in a centred container (`max-w-screen-2xl`, 16-24px side padding on mobile). No fixed narrow boxes.
- **Header:** logo, global search bar (visible on every page), **Select Vehicle** button, Enquiry List icon with count badge, WhatsApp button, language switcher (EN / AR / FR / ES, optional phase 2).
- **Mega menu (desktop):** Categories → Sub-categories → Part types in three columns, same pattern as the reference site. On mobile, an accordion drawer.
- **Select Vehicle modal:** Type (Motorcycle / Scooter / Tuk Tuk / Car) → Brand → Model → Year/Variant (optional). Selection is saved in `localStorage` and shown in the header ("Showing parts for: TVS Jupiter"). All listings filter by it.
- **Hero banner:** large image/slider with two CTAs.
- **Genuine vs Aftermarket section:** simple comparison cards explaining quality grades (inspired by the "Asli vs Nakli" block).
- **How it works (4 steps):** 1. Select your vehicle, 2. Find parts / part number, 3. Add to enquiry list, 4. Get quotation and shipping details.
- **Shop by brand:** logo grid. **Popular parts:** 8-10 card carousel.
- **Footer:** quick links, brands, contact, WhatsApp, address, copyright.
- **Responsive:** mobile-first, tested at 360, 768, 1024, 1440, 1920 px. Touch targets at least 44px.
- **Performance targets:** LCP under 2.5 s, search results under 1 s, images lazy-loaded (WebP/AVIF).
- **Accessibility:** semantic HTML, alt text, keyboard navigation, colour contrast AA.
- **RTL support** (Arabic/Persian) planned from the start: use logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`).

---

## 5. Features

### 5.1 Public
1. **Smart search**: autocomplete (parts, part numbers, models, categories), typo tolerance, part-number exact match first, "no result" page with a *Request this part* button.
2. **Filters:** vehicle type, brand, model, category, sub-category, quality grade (Genuine / OES / Aftermarket), availability. **Sort:** relevance, newest, name.
3. **Part detail:** gallery with zoom, name, part number(s) (OEM, OES, cross-reference), description, specifications, compatible models table, related parts, **Add to Enquiry** with quantity.
4. **Enquiry list:** saved in browser (and in DB when the form is submitted). Fields: name, company, country (dropdown), email, phone/WhatsApp, message, optional file upload (photo/Excel parts list). Success page with reference number.
5. **Quick enquiry:** paste a list of part numbers and quantities (textarea or CSV upload) and submit directly.
6. **Contact form + WhatsApp click-to-chat** (pre-filled message with part name/number).
7. **Download catalogue/price list** (PDF) after leaving email (lead capture), optional.
8. **SEO:** clean slugs, meta tags, Open Graph, JSON-LD `Product` and `Organization`, auto sitemap.xml and robots.txt, hreflang if multi-language.

### 5.2 Admin panel
1. Secure login (email + password, optional 2FA), roles: **Super Admin, Catalogue Manager, Sales**.
2. **Dashboard:** new enquiries, top searched terms, **zero-result searches**, top parts, enquiries by country.
3. **Catalogue CRUD:** brands, models, categories (3 levels), parts, images, fitment mapping.
4. **Bulk import/export:** Excel/CSV upload for parts and fitment with validation report and error download; image ZIP upload matched by part number.
5. **Enquiries:** list, status (New, Quoted, Won, Lost), notes, assign to staff, reply by email, export to Excel.
6. **Content:** banners, home sections, FAQ, static pages, site settings (phone, WhatsApp, email, address, social links).
7. **Audit log** of admin actions.

---

## 6. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | **Next.js 14+ (App Router), TypeScript, Tailwind CSS**, shadcn/ui, React Hook Form + Zod, TanStack Query |
| Backend | **Node.js + Express** (or NestJS) REST API, TypeScript, Zod validation |
| Database | **PostgreSQL** with **Prisma ORM** |
| Search | **Meilisearch** (typo tolerance, fast, easy to host); fallback: PostgreSQL `pg_trgm` |
| Cache / rate limit | Redis (optional in phase 1) |
| File storage | Cloudinary or AWS S3 (+ CloudFront) for images and uploads |
| Email | Resend / Nodemailer (SMTP) |
| Auth | JWT (httpOnly cookies) + refresh tokens, bcrypt/argon2 |
| Hosting | VPS (Ubuntu) with Docker + Nginx + Let's Encrypt SSL, or Vercel (frontend) + Railway/Render (API + DB) |
| CI/CD | GitHub Actions |
| Monitoring | Sentry, UptimeRobot, Google Analytics 4 + Search Console |

---

## 7. Architecture

```
Browser (Next.js SSR/ISR)
        │
        ▼
   Nginx (SSL, gzip, caching)
        │
 ┌──────┴────────┐
 ▼               ▼
Next.js app    Express API ───► PostgreSQL
(frontend)         │  ├──────► Meilisearch (index sync on part change)
                   │  ├──────► Cloudinary / S3 (images, uploads)
                   │  └──────► Email service
                   ▼
              Admin panel (same Next.js app, /admin, role-protected)
```

- Public pages use **ISR/SSR** for SEO; catalogue pages revalidate on admin updates.
- Admin changes trigger Meilisearch re-index (create/update/delete hooks).

---

## 8. Database Schema (PostgreSQL / Prisma)

```prisma
model Brand {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  slug      String    @unique
  logoUrl   String?
  type      VehicleType[]   // MOTORCYCLE, SCOOTER, TUKTUK, CAR
  sortOrder Int       @default(0)
  isActive  Boolean   @default(true)
  models    VehicleModel[]
}

model VehicleModel {
  id        Int      @id @default(autoincrement())
  brandId   Int
  name      String
  slug      String
  type      VehicleType
  imageUrl  String?
  yearFrom  Int?
  yearTo    Int?
  isActive  Boolean  @default(true)
  brand     Brand    @relation(fields: [brandId], references: [id])
  fitments  Fitment[]
  @@unique([brandId, slug])
}

model Category {            // 3 levels via parentId
  id        Int       @id @default(autoincrement())
  parentId  Int?
  name      String
  slug      String
  level     Int       // 1,2,3
  imageUrl  String?
  sortOrder Int       @default(0)
  parent    Category? @relation("tree", fields: [parentId], references: [id])
  children  Category[] @relation("tree")
  parts     Part[]
  @@unique([parentId, slug])
}

model Part {
  id          Int      @id @default(autoincrement())
  partNumber  String   @unique       // primary OEM/OES no.
  altNumbers  String[]               // cross references
  name        String
  slug        String   @unique
  categoryId  Int
  grade       PartGrade              // GENUINE, OES, AFTERMARKET
  description String?
  specs       Json?                  // key/value specs
  weightKg    Decimal?
  moq         Int?
  images      PartImage[]
  fitments    Fitment[]
  isFeatured  Boolean  @default(false)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  category    Category @relation(fields: [categoryId], references: [id])
}

model PartImage {
  id      Int    @id @default(autoincrement())
  partId  Int
  url     String
  sortOrder Int  @default(0)
  part    Part   @relation(fields: [partId], references: [id], onDelete: Cascade)
}

model Fitment {             // which part fits which model
  partId   Int
  modelId  Int
  notes    String?
  part     Part         @relation(fields: [partId], references: [id], onDelete: Cascade)
  model    VehicleModel @relation(fields: [modelId], references: [id], onDelete: Cascade)
  @@id([partId, modelId])
}

model Enquiry {
  id         Int      @id @default(autoincrement())
  refNo      String   @unique         // e.g. ENQ-2026-000123
  name       String
  company    String?
  country    String
  email      String
  phone      String?
  message    String?
  attachmentUrl String?
  status     EnquiryStatus @default(NEW)  // NEW, QUOTED, WON, LOST
  assignedTo Int?
  notes      String?
  createdAt  DateTime @default(now())
  items      EnquiryItem[]
}

model EnquiryItem {
  id         Int     @id @default(autoincrement())
  enquiryId  Int
  partId     Int?
  partNumber String          // stored as text so unknown parts can be requested
  partName   String?
  quantity   Int     @default(1)
  enquiry    Enquiry @relation(fields: [enquiryId], references: [id], onDelete: Cascade)
}

model SearchLog {           // analytics: what buyers search, what returns nothing
  id        Int      @id @default(autoincrement())
  query     String
  results   Int
  country   String?
  createdAt DateTime @default(now())
}

model User {                // admin users
  id        Int      @id @default(autoincrement())
  email     String   @unique
  passwordHash String
  name      String
  role      Role     // SUPER_ADMIN, CATALOGUE, SALES
  isActive  Boolean  @default(true)
}

model Page { id Int @id @default(autoincrement()) slug String @unique title String body String updatedAt DateTime @updatedAt }
model Banner { id Int @id @default(autoincrement()) title String? imageUrl String link String? sortOrder Int @default(0) isActive Boolean @default(true) }
model SiteSetting { key String @id value String }

enum VehicleType { MOTORCYCLE SCOOTER TUKTUK CAR }
enum PartGrade { GENUINE OES AFTERMARKET }
enum EnquiryStatus { NEW QUOTED WON LOST }
enum Role { SUPER_ADMIN CATALOGUE SALES }
```

**Indexes:** `Part(partNumber)`, `Part(categoryId)`, `Fitment(modelId)`, `Enquiry(status, createdAt)`, `SearchLog(createdAt)`.

---

## 9. REST API

Base: `/api/v1`. JSON only. Pagination: `?page=1&limit=24`.

### Public
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/brands` | Active brands |
| GET | `/brands/:slug/models` | Models of a brand |
| GET | `/categories/tree` | Full 3-level category tree (for mega menu) |
| GET | `/parts` | List with filters: `brand, model, category, grade, q, sort` |
| GET | `/parts/:slug` | Part detail with fitments and related parts |
| GET | `/search/suggest?q=` | Autocomplete (Meilisearch) |
| GET | `/search?q=` | Full search; logs to `SearchLog` |
| POST | `/enquiries` | Create enquiry (items + details + optional file) |
| POST | `/contact` | Contact form |
| GET | `/pages/:slug` | Static page content |
| GET | `/settings/public` | Phone, WhatsApp, email, address |

### Admin (JWT + role check)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/admin/auth/login`, `/logout`, `/refresh` | Auth |
| CRUD | `/admin/brands`, `/admin/models`, `/admin/categories`, `/admin/parts` | Catalogue |
| POST | `/admin/parts/import` | Excel/CSV bulk import |
| POST | `/admin/parts/images/import` | ZIP image import |
| GET | `/admin/parts/export` | Excel export |
| PUT | `/admin/parts/:id/fitments` | Set compatible models |
| GET/PATCH | `/admin/enquiries`, `/admin/enquiries/:id` | List, change status, notes, assign |
| POST | `/admin/enquiries/:id/reply` | Send email reply |
| GET | `/admin/analytics/summary` | Dashboard numbers, zero-result searches |
| CRUD | `/admin/pages`, `/admin/banners`, `/admin/settings`, `/admin/users` | Content and users |
| POST | `/admin/search/reindex` | Rebuild Meilisearch index |

---

## 10. Search Design (Meilisearch)

- **Index `parts`** documents: `id, partNumber, altNumbers, name, categoryPath, brands[], models[], grade, slug, imageUrl`.
- **Searchable attributes (in order):** `partNumber`, `altNumbers`, `name`, `models`, `brands`, `categoryPath`.
- **Filterable:** `brands, models, categoryPath, grade`. **Sortable:** `name, updatedAt`.
- Normalise part numbers: strip spaces, dashes and dots when indexing and querying (`12345-ABC-000` equals `12345ABC000`).
- Typo tolerance on; exact part-number matches ranked first.
- If no results: show suggestions, popular parts, and a **Request this part** button that pre-fills an enquiry.

---

## 11. Enquiry Flow

1. User clicks **Add to Enquiry** → item stored in `localStorage` (`enquiryList`).
2. Header badge updates; `/enquiry` shows the list with editable quantities.
3. User fills the form → `POST /enquiries` (rate-limited, honeypot + reCAPTCHA/Turnstile).
4. Server saves the enquiry, generates `refNo`, and sends:
   - confirmation email to the buyer;
   - notification email (and optional WhatsApp/Telegram webhook) to the sales team.
5. Admin changes status → can reply with the quotation by email from the panel.

---

## 12. Security

- HTTPS everywhere, HSTS, secure headers (Helmet), strict CORS.
- Input validation (Zod) on every endpoint; Prisma parameterised queries (no SQL injection); sanitise rich text.
- Passwords hashed with argon2/bcrypt; httpOnly + SameSite cookies; CSRF protection for admin.
- Rate limiting on search, enquiry, contact and login; account lockout after repeated failures.
- File upload checks: type allow-list (jpg, png, webp, pdf, xlsx, csv), size cap (10 MB), antivirus scan optional, random file names.
- Role-based access control; audit log for admin actions.
- Daily encrypted database backups, 30-day retention, tested restore.
- Environment secrets in `.env` / secret manager, never in Git.

---

## 13. Folder Structure

```
hastinamotorparts/
├─ apps/
│  ├─ web/                      # Next.js (public site + /admin)
│  │  ├─ app/
│  │  │  ├─ (public)/page.tsx, about/, brands/, models/, parts/, part/, enquiry/, markets/, contact/
│  │  │  └─ admin/ (dashboard, parts, brands, models, categories, enquiries, content, settings)
│  │  ├─ components/ (Header, MegaMenu, VehicleSelector, SearchBar, PartCard, EnquiryDrawer, Footer ...)
│  │  ├─ lib/ (api client, enquiry store, utils)
│  │  └─ styles/
│  └─ api/                      # Express API
│     ├─ src/
│     │  ├─ modules/ (auth, brands, models, categories, parts, search, enquiries, pages, settings, analytics)
│     │  ├─ middleware/ (auth, rbac, rateLimit, errorHandler, validate)
│     │  ├─ jobs/ (indexSync, emailQueue)
│     │  ├─ utils/ (importExcel, slugify, normalizePartNo)
│     │  └─ server.ts
│     └─ prisma/ (schema.prisma, migrations, seed.ts)
├─ docker-compose.yml           # postgres, meilisearch, redis, api, web, nginx
├─ .github/workflows/deploy.yml
└─ README.md
```

---

## 14. Environment Variables

```
# API
DATABASE_URL=postgresql://user:pass@db:5432/hastina
JWT_SECRET=
JWT_REFRESH_SECRET=
MEILI_HOST=http://meili:7700
MEILI_MASTER_KEY=
CLOUDINARY_URL=            # or S3_BUCKET / S3_KEY / S3_SECRET
SMTP_HOST= SMTP_USER= SMTP_PASS= MAIL_FROM=sales@hastinamotorparts.com
SALES_NOTIFY_EMAIL=
TURNSTILE_SECRET=
# Web
NEXT_PUBLIC_API_URL=https://api.hastinamotorparts.com
NEXT_PUBLIC_SITE_URL=https://www.hastinamotorparts.com
NEXT_PUBLIC_WHATSAPP=      # international format, no +
NEXT_PUBLIC_GA_ID=
```

---

## 15. Bulk Import Template (Excel columns)

`part_number | alt_numbers | name | category_l1 | category_l2 | category_l3 | grade | brand | models (comma separated) | description | specs (key:value;key:value) | moq | weight_kg | image_file`

Rules: unknown brand/model/category rows are reported in an error sheet; existing `part_number` is updated, not duplicated.

---

## 16. Development Phases

| Phase | Scope | Duration (approx.) |
|---|---|---|
| **1. Foundation** | Repo, Docker, DB schema, auth, admin shell, seed brands/models | 1 week |
| **2. Catalogue** | Category tree, part CRUD, fitment, image upload, bulk import | 1.5 weeks |
| **3. Public site** | Home, mega menu, vehicle selector, listing, part detail, model pages | 2 weeks |
| **4. Search** | Meilisearch, autocomplete, filters, search logs | 1 week |
| **5. Enquiry** | Enquiry list, forms, emails, admin enquiry manager, WhatsApp | 1 week |
| **6. Content and SEO** | About, markets, FAQ, sitemap, meta/JSON-LD, analytics | 0.5 week |
| **7. QA and launch** | Testing, security pass, performance, deployment, backups | 1 week |
| **Phase 2 (later)** | Multi-language and RTL, customer login, price lists per country, PDF catalogue generator, live chat | — |

---

## 17. Acceptance Criteria

- [ ] Every page is full-width and works on mobile, tablet and desktop, with RTL tested.
- [ ] Selecting a vehicle filters all listings and the header shows the selection.
- [ ] Searching a part number with spaces or dashes returns the correct part first.
- [ ] A buyer can add 10 parts, submit an enquiry, and receive a confirmation email; the sales team gets a notification.
- [ ] Admin can import 5,000 parts from Excel with a clear error report.
- [ ] Zero-result searches are visible in the admin dashboard.
- [ ] Lighthouse: Performance 85+, SEO 95+, Accessibility 90+ on mobile.
- [ ] All admin routes reject unauthenticated or unauthorised requests.

---

## 18. Information Still Needed From Client

1. Logo, brand colours, and hero/banner images.
2. Phone, WhatsApp number, sales email.
3. Existing parts list/Excel (part numbers, names, models, categories) and photos.
4. Final model list (including Piaggio, Suzuki Access 125, Burgman Street, Gixxer 250, V-Strom SX, Vespa Tech/Qala variants if they are to appear).
5. Whether to show the Car Spare Parts section (Maruti Suzuki, Hyundai, Kia).
6. Languages required (English only, or Arabic / French / Spanish / Persian).
7. Domain and hosting preference (VPS or cloud).

---

## 19. Prompt for AI Coding Assistants (copy-paste)

> Build the full-stack website described in this document for **hastinamotorparts.com** (ALISONS GENERAL TRADING LLP), an Indian exporter of motorcycle, scooter and tuk-tuk spare parts. Use Next.js 14 (App Router, TypeScript, Tailwind), Node.js/Express API, PostgreSQL with Prisma, and Meilisearch. Follow the UI structure of marutisuzuki.com/genuine-parts: full-width responsive layout, mega menu (category → sub-category → part), global search, **Select Vehicle** selector that filters the whole site, brand and model pages, category pages, part detail pages. Replace cart/checkout with an **Enquiry List and quotation request** flow. Include an admin panel with catalogue CRUD, Excel bulk import, enquiry management and analytics. Implement the schema, API, security and acceptance criteria exactly as specified. Start with Phase 1 and proceed phase by phase, showing the folder structure and code for each step.
