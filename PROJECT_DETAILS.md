# KnowtheAlgo - Project Documentation

**KnowtheAlgo** is a comprehensive Personal Portfolio and Learning Management System (LMS) designed for Computer Science educators and developers. It combines a professional portfolio with a structured curriculum platform and a community discussion hub.

## 🏗 Tech Stack

- **Frontend Framework:** React 18 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Backend / Database:** Supabase (PostgreSQL)
- **Rich Text Editor:** Tiptap
- **Routing:** React Router DOM

---

## 🗺 Site Map & Features

### 1. Public Pages

#### **Home (`/`)**
- **Hero Section:** Dynamic title, subtitle, and CTA button (editable via Admin).
- **Learning Paths:** Grid view of available subjects (e.g., CS Fundamentals, Full Stack).
- **Community Teaser:** Displays the latest approved community post.

#### **Collaborate / Portfolio (`/collaborate`)**
- **Profile Header:** Bio, Social Links, Resume Download.
- **Research Experience:** Filterable list (Ongoing vs. Completed) with support for advisor names, team members, and publication links.
- **Projects:** Filterable list (Industry vs. Coursework) with tech stack tags and GitHub links.
- **Timeline:** Work Experience and Education history.
- **Achievements:** Honors, Awards, and Leadership roles.

#### **Curriculum Viewer (`/learn/:subjectId/:topicId`)**
- **Sidebar Navigation:** Accordion-style menu for Subjects -> Modules -> Topics.
- **Content Area:** Renders topic content. Supports:
  - **Rich Text:** HTML content created via the Admin editor.
  - **Legacy Markdown:** Backwards compatibility for markdown-based content.
  - **Code Blocks:** Syntax highlighting for code snippets.
  - **Callouts:** Special formatting for notes/warnings.

#### **Community (`/community`)**
- **Category Hub:** Visual grid of discussion categories.
- **Post Feed:** Searchable and filterable list of approved posts.
- **Contribute (`/contribute`):** Public form for users to submit posts. Submissions enter a `pending` state.

### 2. Admin Dashboard (`/admin`)

Protected route requiring Supabase Authentication.

#### **Tabs:**
1.  **Site Editor:**
    - Update text content for Home, Profile, and Community pages.
    - stored in `site_settings` table.
2.  **Portfolio Manager:**
    - CRUD (Create, Read, Update, Delete) interface for all portfolio sections.
    - Dynamic form fields change based on the selected section (e.g., "Advisor" field only shows for Research).
3.  **Community Manager:**
    - **Approvals:** Review pending user submissions. Approve to publish or Reject to hide.
    - **Categories:** Manage discussion categories.
4.  **Curriculum Manager:**
    - Full hierarchy management (Subject -> Module -> Topic).
    - **Rich Text Editor:** Integrated Tiptap editor for writing topic content with support for images, tables, and code blocks.

---

## 🗄 Database Schema (Supabase)

### Core Tables

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| `subjects` | Top-level courses | `id`, `title`, `level`, `icon`, `color` |
| `modules` | Chapters within a subject | `id`, `subject_id`, `title` |
| `topics` | Individual lessons | `id`, `module_id`, `content` (JSON/HTML), `read_time` |
| `portfolio_items` | All resume/portfolio data | `id`, `section` (enum), `details` (JSONB) |
| `community_posts` | User discussions | `id`, `status` (pending/approved), `content` |
| `categories` | Community categories | `id`, `title`, `color` |
| `site_settings` | Dynamic page content | `key` (primary key), `value` (JSONB) |

### Security (RLS)
- **Read Access:** Public (anon) has SELECT access to all tables.
- **Write Access:** Only authenticated users (Admin) can INSERT/UPDATE/DELETE, **EXCEPT** for `community_posts` where public can INSERT (submit) but not UPDATE.

---

## 🧩 Key Components

- **`RichTextEditor.tsx`**: A wrapper around Tiptap. Configured with extensions for Tables, Images, Links, and Code Blocks. Used in Admin and Contribute pages.
- **`CodeBlock.tsx`**: A component to render code snippets with a "Copy to Clipboard" feature.
- **`MarkdownParser.ts`**: Utilities to convert raw text -> Content Blocks -> HTML, ensuring compatibility between different content formats.

## 🚀 Development Workflow

1.  **Install Dependencies:** `yarn install`
2.  **Start Dev Server:** `yarn run dev`
3.  **Linting:** `yarn run lint`
