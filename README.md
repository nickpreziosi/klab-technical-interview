# KLab Technical Interview — Dashboard UI Enhancement

This is a [Next.js](https://nextjs.org) project used for the KLab technical interview. You will receive a link to the GitHub repository to clone and work on locally while sharing your screen. If you don't have GitHub access, a zip file can be provided instead.

---

## Project Description

This project is an **Invoice Dashboard** — an application that displays and manages invoice data. It is built with modern React patterns and includes a responsive layout with a collapsible sidebar, theme switching (light/dark/system), and a data-rich main content area.

### What the dashboard includes

- **Summary cards** — Four metric cards at the top: Total Value, Paid count, Pending count, and Overdue count (with percentages).
- **Filters panel** — A collapsible accordion with filters for Status, Supplier, Buyer, date ranges (Issue Date, Due Date), amount range (Min/Max), and a column visibility toggle. **Saved Filters** (save/load/manage presets) is not yet implemented — that is what you will add.
- **Data table** — A sortable, filterable, paginated table of invoices with columns: Invoice #, Issue Date, Due Date, Supplier, Buyer, Amount, Status, and row actions (dropdown menu).
- **Layout** — A sidebar with navigation links (Invoice Dashboard, Buyer Config, Supplier Config), user profile area, and theme toggle. The sidebar can collapse and, on smaller screens, appears as a sheet overlay.
- **Theme support** — Light, dark, and system themes with persistence in `localStorage`.

### Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19 |
| UI | Tailwind CSS, shadcn/ui, Radix UI primitives |
| Data table | TanStack Table (React Table v8) |
| Components | KLab components (in `ui/shared/components/`) |
| Icons | Lucide React |

### KLab Component Library

This project includes KLab UI components in `ui/shared/components/`. You can modify the source code as needed to complete the interview task — the components are yours to edit during the session.

**Important:** The KLab components are proprietary. They are provided for interview use only. Do not copy, reuse, or incorporate them into projects outside of this interview. See [NOTICE](NOTICE) for details.

### Data model

Invoices are fetched from `lib/data/invoices.ts` (simulated API with ~1s delay). Each invoice has: `id`, `number`, `issueDate`, `dueDate`, `supplier`, `buyer`, `amount`, `currency`, and `status` (Pending, Paid, Overdue, Draft).

---

## Interview Objective

**Your primary task is to add a Saved Filters view.**

The dashboard currently has filters (Status, Supplier, Buyer, date ranges, amount range) that apply to the invoice table. During the interview, you will implement **Saved Filters** — the ability for users to save their current filter configuration as a named preset and later load or manage those saved presets. This may include:

- A way to save the current filter state with a user-defined name
- A view or UI to list, load, rename, and delete saved filter presets
- Persistence (e.g. `localStorage` or similar) so saved filters survive page reloads
- Applying a saved filter by restoring all filter values to the table

You will implement this feature in real time while sharing your screen. Think through your approach, ask clarifying questions, and explain your decisions as you work.

---

## Interview Overview

| Item | Description |
|-------|-------------|
| **Format** | Live Technical Interview — You will work on the project in real time while sharing your screen with the interviewer. |
| **Task** | Dashboard UI Enhancement — Add a **Saved Filters** view so users can save, load, and manage filter presets on the Invoices dashboard. |
| **Duration** | Suggested timing: **60 minutes** — Plan your approach and leave time for discussion. |
| **Evaluation** | Interview #2 Scoring Rubric — See the rubric below for evaluation criteria. |
| **AI tools** | AI-assisted coding tools (e.g. Cursor, GitHub Copilot, ChatGPT) are **allowed**. Use them as you would in a real work environment. |

---

## Interview #2 Scoring Rubric

| # | Criterion |
|---|-----------|
| 1 | Requirement comprehension and clarifying questions |
| 2 | Next.js knowledge and architecture |
| 3 | Component design and reusability |
| 4 | UI/UX best practices |
| 5 | Accessibility considerations |
| 6 | Performance awareness |
| 7 | Code cleanliness and organization |
| 8 | Testing and scalability discussion |
| 9 | Efficiency and responsibility of AI usage |
| 10 | Communication |

---

## Before You Start

- **Format:** You will receive a link to the **GitHub repository** to clone. If you don't have GitHub access, a zip file can be provided instead.
- **Environment:** You will edit and run the project **locally** while sharing your screen with the interviewer.
- **Preparation:** Ensure you have a stable internet connection and that your development environment is ready (see Prerequisites below).

---

## Prerequisites

Before the interview, please have the following installed:

| Requirement | Version | How to check |
|-------------|---------|-------------|
| **Node.js** | 18.x or 20.x (LTS) | `node -v` |
| **npm** | 9.x or later | `npm -v` |
| **Git** | 2.x or later | `git --version` |

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/) (choose the LTS version). Git is usually included with Node.js or can be installed from [git-scm.com](https://git-scm.com/).

---

## Setup Instructions

### 1. Get the project

**Option A — Clone from GitHub (recommended):**

```bash
git clone <repository-url>
cd klab-technical-interview
```

Replace `<repository-url>` with the URL you received (e.g. `https://github.com/org/klab-technical-interview.git`).

**Option B — Zip file (if you don't have GitHub access):**

1. Download the zip file you received.
2. Extract it to a folder on your computer (e.g. `klab-technical-interview`).
3. Open a terminal and navigate into the project folder:
   ```bash
   cd path/to/klab-technical-interview
   ```

### 2. Install dependencies

From the project root, run:

```bash
npm install
```

This installs all required packages (Next.js, React, Tailwind CSS, Radix UI, the KLab components library, etc.). If you see any errors, share them with the interviewer.

### 3. Start the development server

```bash
npm run dev
```

You should see output similar to:

```
▲ Next.js 16.x.x
- Local:        http://localhost:3000
```

### 4. Verify it works

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. You should see the Invoices dashboard with a data table, filters, and theme toggle.
3. Try interacting with the page (filters, pagination, theme switch) to confirm everything loads correctly.

---

## Project Structure

| Path | Description |
|------|--------------|
| `app/` | Next.js App Router pages and layout |
| `app/page.tsx` | Home page (renders the Invoices dashboard) |
| `ui/views/invoices-view.tsx` | Main invoices view and data table |
| `ui/shared/components/` | Shared UI components |
| `ui/demo/` | Demo layout, sidebar, and shell |
| `lib/` | Data fetching and utilities |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server (hot reload) |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

---

## Troubleshooting

- **Port 3000 already in use:** Stop the other process or run `npm run dev -- -p 3001` to use port 3001.
- **`npm install` fails:** Ensure you have Node.js 18+ and a working internet connection. Try deleting `node_modules` and `package-lock.json`, then run `npm install` again.
- **Page is blank or errors:** Check the terminal for build errors and the browser console (F12) for runtime errors.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) — Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) — Interactive tutorial

---

Good luck with your interview.
