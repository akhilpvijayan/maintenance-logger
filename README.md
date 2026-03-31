# 🔧 MaintenanceIQ — Issue Logger & Status Tracker

> A modern internal maintenance management tool built with Next.js 15, TypeScript, Tailwind CSS, and Google Sheets as a live database. Submit issues, track status, filter by property or urgency — no login required.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-API_v4-34a853?style=flat-square&logo=google-sheets)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)

---

## 📸 Features

- **Submit Issues** — Property dropdown, category, urgency (color-coded), description, optional photo upload
- **Auto Ticket Numbers** — Every submission gets a unique `MNT-0001` style ticket ID
- **Live Dashboard** — Table view of all issues with urgency badges (🟢 Low / 🟡 Medium / 🔴 High)
- **Status Updates** — Change status between `Open`, `In Progress`, `Resolved` — persists to Google Sheets instantly
- **Filters** — Filter by Property, Urgency, and Status with a one-click clear
- **Stats Cards** — At-a-glance totals for all, open, in-progress, and resolved issues
- **Google Sheets Backend** — All data stored and read from a live Google Sheet (no database setup needed)
- **Fully Responsive** — Works on desktop and mobile

---

## 🗂️ Project Structure

```
maintenance-logger/
├── app/
│   ├── globals.css               # Global styles, CSS variables, fonts
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main page — tab navigation between views
│   └── api/
│       ├── issues/
│       │   └── route.ts          # GET all issues / POST new issue
│       └── issues/[id]/
│           └── route.ts          # PATCH — update status by ticket number
├── components/
│   ├── SubmitForm.tsx            # View 1 — Issue submission form
│   └── Dashboard.tsx             # View 2 — Issue table with filters
├── lib/
│   └── sheets.ts                 # Google Sheets API helper functions
├── types/
│   └── issue.ts                  # TypeScript interfaces and types
├── .env.local                    # 🔒 Local secrets (never commit)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Google account
- A Vercel account (free tier works)

---

## ⚙️ Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/maintenance-logger.git
cd maintenance-logger
npm install
```

---

## 📊 Step 2 — Set Up Google Sheets

### 2.1 Create the Spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Rename it: **Maintenance Issue Logger**
4. Rename **Sheet1** tab to: **Issues**
5. Add these exact headers in **Row 1**:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| TicketNumber | PropertyName | IssueCategory | Urgency | Description | PhotoURL | DateSubmitted | Status |

### 2.2 Create a Google Cloud Service Account

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown (top left) → **New Project**
3. Name it `maintenance-logger` → **Create**
4. Go to **APIs & Services → Library**
5. Search for **Google Sheets API** → Click it → **Enable**
6. Go to **APIs & Services → Credentials**
7. Click **+ Create Credentials → Service Account**
8. Fill in:
   - Name: `maintenance-logger-sa`
   - Click **Create and Continue**
   - Skip the role step → Click **Continue**
   - Click **Done**
9. In the credentials list, click on the service account email
10. Go to the **Keys** tab → **Add Key → Create New Key → JSON**
11. The JSON file downloads automatically — **keep this file safe**

### 2.3 Share Your Sheet with the Service Account

1. Open your Google Sheet
2. Click **Share** (top right)
3. Paste the service account email (found in the JSON as `"client_email"`)
4. Set role to **Editor**
5. Uncheck "Notify people" → **Share**

### 2.4 Get Your Sheet ID

From your sheet URL:
```
https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_SHEET_ID/edit
```
Copy the long alphanumeric string between `/d/` and `/edit`.

---

## 🔐 Step 3 — Configure Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=maintenance-logger-sa@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEo...your key...\n-----END RSA PRIVATE KEY-----\n"
```

### How to get values from the downloaded JSON file:

| .env.local variable | JSON field |
|---|---|
| `GOOGLE_SHEET_ID` | *(from your Sheet URL)* |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `"client_email"` |
| `GOOGLE_PRIVATE_KEY` | `"private_key"` |

> ⚠️ **Important:** Copy `private_key` exactly as-is from the JSON file, including all `\n` characters. Wrap the entire value in double quotes in `.env.local`.

---

## 💻 Step 4 — Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

Test by submitting an issue — check your Google Sheet to confirm the row appears.

---

## 🌐 Step 5 — Deploy to Vercel

### 5.1 Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial commit — MaintenanceIQ"
git branch -M main
```

Create a new repo on [github.com](https://github.com/new) named `maintenance-logger`, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/maintenance-logger.git
git push -u origin main
```

### 5.2 Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your `maintenance-logger` repo
3. Keep all build settings as default (Vercel auto-detects Next.js)
4. Open the **Environment Variables** section
5. Add these three variables:

| Name | Value |
|---|---|
| `GOOGLE_SHEET_ID` | Your Sheet ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email |
| `GOOGLE_PRIVATE_KEY` | Full private key string with `\n` |

6. Click **Deploy**
7. Wait ~90 seconds — your app is live! 🎉

### 5.3 Private Key in Vercel — Important Note

When pasting `GOOGLE_PRIVATE_KEY` into the Vercel dashboard, paste it exactly like this (keep the `\n`, do **not** press Enter):

```
-----BEGIN RSA PRIVATE KEY-----\nMIIEoAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----\n
```

---

## 🔁 How Data Flows

```
User submits form
      │
      ▼
POST /api/issues
      │
      ▼
lib/sheets.ts → getNextTicketNumber() → appendIssue()
      │
      ▼
Google Sheets (new row added)
      │
      ▼
Response: { ticketNumber: "MNT-0001" }
      │
      ▼
Success screen shown to user

─────────────────────────────────

User changes status on Dashboard
      │
      ▼
PATCH /api/issues/MNT-0001
      │
      ▼
lib/sheets.ts → updateIssueStatus()
      │
      ▼
Google Sheets (column H updated)
      │
      ▼
Local state updated (no full reload)
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0f0f13` | Page background |
| `--surface` | `#1a1a24` | Card backgrounds |
| `--border` | `#2e2e3e` | Borders, dividers |
| `--accent` | `#f97316` | Primary orange accent |
| `--text` | `#f1f0f5` | Body text |
| `--muted` | `#7c7c9a` | Labels, secondary text |
| `--green` | `#22c55e` | Low urgency / Resolved |
| `--yellow` | `#eab308` | Medium urgency / In Progress |
| `--red` | `#ef4444` | High urgency / Open |

**Fonts:** [Syne](https://fonts.google.com/specimen/Syne) (headings) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) (body)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + CSS Variables |
| Database | Google Sheets via Sheets API v4 |
| Auth (API) | Google Service Account (JWT) |
| Deployment | Vercel |
| HTTP Client | Native `fetch` |

---

## 🧩 API Reference

### `GET /api/issues`
Returns all issues from Google Sheets.

**Response:**
```json
{
  "issues": [
    {
      "ticketNumber": "MNT-0001",
      "propertyName": "Palm Jumeirah Villa A",
      "issueCategory": "Plumbing",
      "urgency": "High",
      "description": "Pipe burst under kitchen sink",
      "photoURL": "",
      "dateSubmitted": "2025-03-31T10:00:00.000Z",
      "status": "Open"
    }
  ]
}
```

### `POST /api/issues`
Creates a new issue. Assigns a ticket number automatically.

**Body:**
```json
{
  "propertyName": "Downtown Dubai Apt 4B",
  "issueCategory": "Electrical",
  "urgency": "Medium",
  "description": "Flickering lights in the living room",
  "photoURL": ""
}
```

**Response:** `201 Created`
```json
{
  "issue": { "ticketNumber": "MNT-0002", "status": "Open", "..." }
}
```

### `PATCH /api/issues/[ticketNumber]`
Updates the status of an existing issue.

**Body:**
```json
{ "status": "In Progress" }
```

**Response:**
```json
{ "success": true }
```

---

## 🐛 Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Failed to fetch issues` | Wrong Sheet ID or no access | Verify `GOOGLE_SHEET_ID` and re-share the sheet with Editor access |
| `private key must be...` | Key formatting issue | Re-paste `private_key` from JSON exactly, keep `\n` sequences |
| `Sheet tab not found` | Wrong tab name | Rename the tab to exactly `Issues` (capital I) |
| `MNT-0001` already exists | Race condition on first submit | Harmless — ticket numbers increment from row count |
| Vercel build fails | TypeScript error | Run `npm run build` locally and fix any errors before pushing |
| Status update not saving | Ticket not found in sheet | Ensure ticket number in sheet column A matches exactly |

---

## 📝 Notes

- **No authentication** — this is an internal tool designed for quick access
- **Photo uploads** — currently stores the filename as a string; for full image storage, integrate Cloudinary or Vercel Blob
- **Concurrency** — ticket number generation is sequential (row count + 1); for high-traffic use, consider a counter cell in the sheet
- **`.env.local` is gitignored** — never commit your credentials

---

## 📄 License

MIT — free to use and modify for personal or commercial projects.

---

## 🙌 Built With

- [Next.js](https://nextjs.org/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Syne Font](https://fonts.google.com/specimen/Syne)
