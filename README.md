# 🌌 PixelForge Agency Portfolio & Admin Platform

PixelForge Agency is a modern, premium, high-converting digital agency portfolio website built using **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **PocketBase (SQLite)**. 

Featuring a stunning dark-theme aesthetic (with slate/zinc accents and neon violet tones), the platform integrates a dynamic portfolio grid, a real-time testimonials carousel, a live inquiry contact form, and a secure superuser administration dashboard.

---

## ✨ Features

### 💻 Public Landing Page
*   **Vibrant Glassmorphic UI**: Premium dark mode design with sleek typography, smooth micro-animations, and responsive layouts across all devices.
*   **Dynamic Portfolio Grid**: Real-time project fetching from PocketBase, complete with instant interactive filtering (All, Web, Design, Branding).
*   **Robust Empty-State Fallbacks**: If the database is new or offline, the application automatically displays beautiful, high-fidelity mockup projects and client reviews. The second you publish a project, it transitions automatically to show your live content!
*   **Interactive Testimonials**: Real-time client reviews and ratings (1 to 5 stars) loaded directly from the database.
*   **Live Contact Form**: Client-side validation managed by **React Hook Form** & **Zod**, posting messages straight into the database in real-time.

### 🔐 Secure Admin Control Panel (`/admin`)
*   **Glassmorphic Auth Screen (`/login`)**: A secure entrance protected by PocketBase superuser session guards.
*   **Live Metric Counters**: Instant overview of your agency's numbers (Total Projects, Client Testimonials, Inquiries Received).
*   **Portfolio Manager**: Lists all active projects in a clean list format with quick-delete options that synchronize instantly using real-time database subscriptions.
*   **Real-time Inquiries Inbox**: A unified inbox for reading client messages. Includes standard spam-deletion capability.
*   **Multipart Project Publisher (`/admin/add-project`)**: An interactive form supporting:
    *   Title, category, and descriptive text fields.
    *   Comma-separated technology tag tags.
    *   Binary file uploads for custom project thumbnails directly into PocketBase's storage.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 15 (App Router, Turbopack)
*   **Programming Language**: TypeScript
*   **Styling**: Tailwind CSS & Vanilla CSS
*   **Database & Auth**: PocketBase (Single-file SQLite DB)
*   **Form Management**: React Hook Form, Zod

---

## 📁 Directory Structure

```text
src/
├── app/
│   ├── layout.tsx         # Main HTML layout, Google Fonts, & global styles
│   ├── page.tsx           # Landing Page (Hero, Services, Portfolio, About, Contact)
│   ├── login/
│   │   └── page.tsx       # Secure Admin Credentials entry screen
│   └── admin/
│       ├── page.tsx       # Admin Dashboard (Overview Metrics, Inquiries Feed, Projects List)
│       └── add-project/
│           └── page.tsx   # Multipart Project Publisher Form
├── components/
│   ├── About.tsx          # About segment & numeric accomplishments
│   ├── ContactForm.tsx    # Live validate-and-submit contact form
│   ├── Hero.tsx           # Elegant welcome banner & CTAs
│   ├── Portfolio.tsx      # Dynamic project grid, filtering tabs, and error fallbacks
│   ├── Services.tsx       # Capabilities cards with glowing hover micro-animations
│   └── Testimonials.tsx   # Client reviews dynamic grid
├── lib/
│   └── pocketbase.ts      # PocketBase client initialization & SDK integrations
└── types/
    └── index.ts           # Shared TypeScript interface definitions
```

---

## 💾 Database Schema (PocketBase)

The platform relies on 3 custom-crafted collections:

1.  **`projects`**
    *   `title` (Plain text, Required)
    *   `category` (Select / Plain text, Required)
    *   `description` (Long text, Required)
    *   `tags` (Plain text, e.g. "Next.js, Tailwind, SQLite")
    *   `thumbnail` (File, Single Image, Required)
    *   `liveUrl` (Plain text, Optional)
2.  **`testimonials`**
    *   `clientName` (Plain text, Required)
    *   `roleCompany` (Plain text, Required)
    *   `reviewText` (Long text, Required)
    *   `rating` (Number, 1 to 5)
    *   `clientAvatar` (File, Single Image, Optional)
3.  **`contacts`**
    *   `name` (Plain text, Required)
    *   `email` (Plain text - email validation, Required)
    *   `message` (Long text, Required)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
*   [Node.js (v18+)](https://nodejs.org)
*   [PocketBase v0.23+](https://pocketbase.io/docs/)

### 2. Run PocketBase Database
Download the PocketBase binary for your operating system, put it in a separate folder, and execute:
```bash
./pocketbase serve
```
This opens the database server at `http://127.0.0.1:8090` and the Admin UI at `http://127.0.0.1:8090/_/`.

### 3. Initialize Database Schema
Run our zero-dependency database configuration script in the project directory to create all collections automatically:
```bash
npm run setup-db
```
*(This uses the schema definition in `pb_schema.json` to configure the tables instantly).*

### 4. Run Next.js Dev Server
Install the front-end dependencies and boot the application:
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser to view your brand-new digital agency!
To manage projects, navigate to **`http://localhost:3000/login`** and sign in with your admin credentials.

---

## ☁️ Production Deployment Options

You have two excellent choices for deploying your PixelForge Agency platform. Choose the one that best matches your budget and requirements:

---

### 🌐 Option A: Unified Deployment on Render (Frontend + Backend)

Deploy **both** the Next.js frontend and the PocketBase backend together on Render using a single unified blueprint config (`render.yaml`).

#### Step-by-Step Instructions:

1. **Commit and Push**: Ensure all your local changes (especially `render.yaml` and `Dockerfile`) are committed and pushed to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: configure unified render deployment"
   git push origin master
   ```
2. **Open Render**: Go to your [Render Dashboard](https://dashboard.render.com/).
3. **Select Blueprints**:
   * Click **New +** in the top-right and select **Blueprint**.
   * Connect and select your **`pixelforge-agency`** repository.
4. **Apply Blueprint**:
   * Render will automatically discover and parse the `render.yaml` file.
   * Provide a Group Name (e.g., `pixelforge-agency-group`).
   * Click **Apply**.
   * Render will automatically spin up two services:
     1. `pixelforge-db` (PocketBase backend - containerized via Dockerfile)
     2. `pixelforge-web` (Next.js frontend - Node.js environment)
   * **Automatic URL Binding**: Render will dynamically resolve the backend's URL and automatically inject it into the frontend's `NEXT_PUBLIC_POCKETBASE_URL` environment variable at build-time! No manual configuration needed.
5. **Access and Initialize**:
   * Once the services are active, access your PocketBase Admin dashboard at `https://<your-db-subdomain>.onrender.com/_/` and create your admin account.
   * Initialize your live database collections from your local command line by executing:
     ```powershell
     $env:NEXT_PUBLIC_POCKETBASE_URL="https://<your-db-subdomain>.onrender.com"
     npm run setup-db
     ```
     *(On macOS/Linux: `NEXT_PUBLIC_POCKETBASE_URL=https://<your-db-subdomain>.onrender.com npm run setup-db`)*

> [!NOTE]
> **Free Tier Volume Warning**: Render's **Free** web service tier does not support persistent disks. To ensure your SQLite database files (`pb_data`) are preserved permanently across container sleeps/restarts, change the PocketBase plan in `render.yaml` from `free` to `starter` (which includes persistent disk support for only $7/month), or manually attach a disk in the Render UI to a paid service tier.

---

### ⚡ Option B: Hybrid Deployment (PocketBase on Render + Next.js on Vercel)

For the absolute fastest page load speeds and global edge delivery, deploy the **Next.js frontend on Vercel** (100% free) and the **PocketBase database on Render**.

#### Step 1: Deploy PocketBase on Render
1. Go to the [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint** and import your repository.
3. Keep or apply only the `pixelforge-db` service (you can cancel or delete the `pixelforge-web` service on Render if you are deploying the frontend on Vercel instead).
4. Once deployed, note down your backend's public URL (e.g. `https://pixelforge-db.onrender.com`).

#### Step 2: Deploy Next.js on Vercel
1. Go to the [Vercel Dashboard](https://vercel.com).
2. Click **Add New** > **Project** and import your `pixelforge-agency` repository.
3. Under **Environment Variables**, add:
   * **Key**: `NEXT_PUBLIC_POCKETBASE_URL`
   * **Value**: `https://pixelforge-db.onrender.com` *(use your live Render PocketBase URL)*
4. Click **Deploy**. Vercel will build and distribute your static and dynamic routes globally.

#### Step 3: Initialize Live Collections
Run the local configuration script to sync your live collections:
```powershell
$env:NEXT_PUBLIC_POCKETBASE_URL="https://pixelforge-db.onrender.com"
npm run setup-db
```

---

## 📝 License
This project is licensed under the MIT License. Developed for PixelForge Agency.
