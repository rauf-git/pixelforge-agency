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

## ☁️ Production Deployment (Render + Vercel)

For a fast, resilient, and production-ready setup, we recommend deploying:
1. **PocketBase (Database)** on **Render.com** (as a standalone containerized service with persistent storage).
2. **Next.js (Frontend)** on **Vercel** (for blistering-fast global CDN delivery).

---

### Part 1: Deploying PocketBase on Render.com (Database)

We have pre-configured this repository with a `render.yaml` Blueprint file and a custom lightweight PocketBase `Dockerfile`.

1. **Push Changes**: Make sure all your latest files (including the updated `Dockerfile` and `render.yaml`) are pushed to your GitHub repository.
2. **Open Render**: Go to the [Render Dashboard](https://dashboard.render.com/) and log in.
3. **Deploy using Blueprint**:
   * Click the **New +** button in the top-right and select **Blueprint**.
   * Select your **`pixelforge-agency`** repository.
   * Render will parse the `render.yaml` file automatically. Give your service group a name (e.g., `pixelforge-db-group`) and click **Apply**.
4. **Access the Database**:
   * Once `pixelforge-db` finishes deploying, open its public Admin UI in your browser (e.g., `https://pixelforge-db.onrender.com/_/`).
   * Create your admin account (e.g., `abdulrawoof9457@gmail.com` with a strong password).
5. **Initialize Database Tables**:
   * Run the database configuration script locally, pointing it to your live Render instance to build all collections and API rules automatically:
     ```powershell
     $env:NEXT_PUBLIC_POCKETBASE_URL="https://pixelforge-db.onrender.com"
     npm run setup-db
     ```
     *(On Mac/Linux: `NEXT_PUBLIC_POCKETBASE_URL=https://pixelforge-db.onrender.com npm run setup-db`)*

> [!WARNING]
> **Data Persistence**: Render's Free instance type does not support persistent disks. To keep your SQLite database files permanently across container spins/restarts, upgrade the PocketBase service (`pixelforge-db`) to a paid tier (such as the $7/month Starter plan) in the Render dashboard. Under the Free tier, database changes will reset whenever the service goes idle or restarts.

---

### Part 2: Deploying Next.js on Vercel (Frontend)

1. **Open Vercel**: Log in to your [Vercel Dashboard](https://vercel.com).
2. **Import Project**: Click **Add New** > **Project** and select your **`pixelforge-agency`** repository.
3. **Configure Environment Variables**:
   * Expand the **Environment Variables** section.
   * Add a new variable:
     * **Key**: `NEXT_PUBLIC_POCKETBASE_URL`
     * **Value**: `https://pixelforge-db.onrender.com` *(use your actual public Render PocketBase URL!)*
4. **Deploy**: Click **Deploy**! Vercel will build the frontend and deploy it globally.

---

## 📝 License
This project is licensed under the MIT License. Developed for PixelForge Agency.
