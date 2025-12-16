# KnowtheAlgo - Personal Learning Platform

A modern, full-stack personal portfolio and learning management system built with React, TypeScript, and Supabase.

## 🌟 Features

- **Dynamic Portfolio:** Showcase research, projects, and experience with a beautiful, responsive UI.
- **Curriculum Platform:** Create and manage structured courses (Subjects > Modules > Topics).
- **Community Hub:** Allow users to submit posts and discussions (with Admin approval workflow).
- **Admin Dashboard:** A complete CMS to manage all content without touching code.
- **Rich Text Editing:** Notion-style editor for creating educational content.

## 🛠 Tech Stack

- **Frontend:** React, Vite, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth)
- **Icons:** Lucide React

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- Yarn or NPM

### 2. Installation

```bash
# Install dependencies
yarn install
```

### 3. Environment Setup

Ensure you have a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL="your_project_url"
VITE_SUPABASE_ANON_KEY="your_anon_key"
```

### 4. Run Development Server

```bash
yarn run dev
```

Visit `http://localhost:5173` to view the app.

## 🔐 Admin Access

1. Go to `/admin`.
2. If it's your first time, use the **Sign Up** toggle to create an account.
3. Once logged in, you can seed the database with demo data or start creating content from scratch.

## 📚 Documentation

For a deep dive into the architecture and database schema, please refer to [PROJECT_DETAILS.md](./PROJECT_DETAILS.md).
