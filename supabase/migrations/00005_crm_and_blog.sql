-- ACCINOR — Batch 2: CRM pipeline + Blog CMS depth
-- Run this in the Supabase SQL Editor (safe to re-run; guarded with IF NOT EXISTS).

-- ---------------------------------------------------------------------------
-- 1. Leads pipeline
--    `contacts` holds newsletter signups + general inquiries. Add a status so
--    the team can work a lead from first touch to conversion, plus internal notes.
-- ---------------------------------------------------------------------------
alter table contacts
  add column if not exists status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'converted', 'archived'));

alter table contacts
  add column if not exists notes text;

-- Internal notes for the consultation + project pipelines too, so the whole
-- CRM shares one status-and-notes shape.
alter table consultation_requests add column if not exists notes text;
alter table project_submissions add column if not exists notes text;

-- ---------------------------------------------------------------------------
-- 2. Clients
--    A distinct, engaged relationship — someone ACCINOR is actively working with.
--    Leads / project submissions / consultations are inbound requests; a client is
--    a converted, ongoing engagement. `source_type` + `source_id` optionally link
--    back to the originating record so the pipeline stays traceable.
-- ---------------------------------------------------------------------------
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  company text,
  city text,
  region text,
  engagement text,                    -- e.g. "Consulting", "Incubation", "Funding support"
  stage text not null default 'onboarding'
    check (stage in ('onboarding', 'active', 'on_hold', 'completed', 'churned')),
  notes text,
  source_type text,                   -- 'lead' | 'consultation' | 'project' | 'manual'
  source_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table clients enable row level security;

create trigger update_clients_updated_at
  before update on clients
  for each row execute function update_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Blog CMS depth
--    Categories, tags, SEO fields, a featured flag, and a reading-time estimate.
--    `cover_image` already exists in the base schema.
-- ---------------------------------------------------------------------------
alter table blog_posts add column if not exists category text;
alter table blog_posts add column if not exists tags text[] not null default '{}';
alter table blog_posts add column if not exists seo_title text;
alter table blog_posts add column if not exists seo_description text;
alter table blog_posts add column if not exists featured boolean not null default false;
alter table blog_posts add column if not exists reading_minutes int;

-- Helpful indexes for public querying / filtering.
create index if not exists blog_posts_published_idx on blog_posts (published, locale);
create index if not exists blog_posts_featured_idx on blog_posts (featured) where featured = true;
create index if not exists clients_stage_idx on clients (stage);
create index if not exists contacts_status_idx on contacts (status);
