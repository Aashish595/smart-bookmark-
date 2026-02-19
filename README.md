# 🚀 Smart Bookmarks

A modern, real-time bookmark management SaaS built with **Next.js 14**, **Supabase**, and **TypeScript**.

Save, manage, and access your links instantly — synced across browser tabs without refreshing the page.

---

## 🌐 Live Demo

🔗https://smart-bookmark-ten-ebon.vercel.app/
*(Optional – add when deployed)*

---

## ✨ Features

- 🔐 Secure Google Authentication (Supabase Auth)
- ⚡ Real-time multi-tab synchronization
- ➕ Add bookmarks instantly
- ✏️ Edit existing links
- 🗑 Delete bookmarks
- 🔒 Row-Level Security (RLS) for private user data
- 🎨 Clean modern UI (Tailwind + shadcn/ui)
- 📱 Responsive design

---

## 🏗 Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend**
- Supabase (PostgreSQL)
- Supabase Auth (Google OAuth)
- Supabase Realtime

---

##  Installation

### Clone Repository

git clone https://github.com/your-username/smart-bookmarks.git
cd smart-bookmarks

--
**Install Dependencies**
npm install

## Setup Environment Variables

# Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4️⃣ Run Development Server
npm run dev


App runs at:

http://localhost:3000

# 🗄 Database Schema
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  created_at timestamptz default now(),
  user_id uuid references auth.users not null
);


# Enable Row Level Security:

alter table bookmarks enable row level security;

# 🔄 Realtime Setup

Ensure the table is added to Supabase Realtime:

alter publication supabase_realtime add table public.bookmarks;

# 🔐 Authentication

Google OAuth handled via Supabase

Secure session management

Server-side auth validation

Protected routes using Next.js App Router

# 📈 Architecture Overview

Server Components fetch initial data

Client Components handle UI & Realtime subscriptions

Supabase WebSockets sync updates across tabs

Optimistic UI updates for instant feedback

# 🧠 Key Concepts Implemented

Real-time subscriptions with WebSockets

Multi-tab synchronization

Optimistic UI updates

Secure row-level access control

Client/server separation in Next.js


Deployment on Vercel

# Author 
Gurudas Maurya
