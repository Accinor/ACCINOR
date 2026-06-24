-- ACCINOR Database Schema — MVP
-- Run this in Supabase SQL Editor

-- 1. Contacts (Newsletter + General inquiries)
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  source text not null default 'newsletter',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table contacts enable row level security;

-- 2. Consultation Requests
create table if not exists consultation_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  service_type text not null,
  message text,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table consultation_requests enable row level security;

-- 3. Project Submissions
create table if not exists project_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  project_name text not null,
  project_description text,
  project_stage text not null,
  city text not null,
  funding_needed text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table project_submissions enable row level security;

-- 4. Blog Posts
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text,
  content text not null,
  cover_image text,
  author_name text not null default 'ACCINOR',
  published boolean not null default false,
  published_at timestamptz,
  locale text not null default 'ar' check (locale in ('ar', 'fr', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

alter table blog_posts enable row level security;

-- 5. Update timestamps trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_consultation_requests_updated_at
  before update on consultation_requests
  for each row execute function update_updated_at();

create trigger update_project_submissions_updated_at
  before update on project_submissions
  for each row execute function update_updated_at();

create trigger update_blog_posts_updated_at
  before update on blog_posts
  for each row execute function update_updated_at();
