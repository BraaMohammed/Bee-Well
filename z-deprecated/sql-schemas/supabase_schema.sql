create table categories (
    id uuid primary key,
    "userId" uuid not null,
    "uiOrder" integer not null,
    name text not null,
    "habbitsIds" uuid[] not null
);

-- Table: single_habbits
create table single_habbits (
    id uuid primary key,
    name text not null,
    "uiOrder" integer not null,
    "categoryId" uuid not null,
    type text check (type in ('select', 'input', 'checkbox')) not null,
    options text[],
    target text,
    importance text check (importance in ('1', '0.875', '0.75', '0.625', '0.5')) not null,
    "shouldBeDone" boolean not null
);

-- Table: habbit_db_response
create table habbit_db_response (
    id uuid primary key,
    "userEmail" text not null,
    "userId" uuid not null
    -- userCattegories and userHabbits are represented by categories and single_habbits tables
);

-- Table: habbit_entry
create table habbit_entry (
    id uuid primary key,
    "habbitId" uuid not null,
    date text not null,
    value text,
    completed boolean not null
);

-- Table: labels
create table labels (
    id uuid primary key,
    "userId" uuid not null,    -- Note: This was already using snake_case
    name text not null,
    color text not null
);

-- Table: notes
create table notes (
    id uuid primary key,
    "userId" uuid not null,
    heading text not null,
    content text not null,
    "created_at" text not null,  -- Note: This was already using snake_case without quotes
    "labelName" text not null,
    "backgroundColor" text not null,
    "htmlContent" text not null
);

-- Table: users
create table users (
    id uuid primary key,
    email text not null,
    name text,
    "created_at" text not null   -- Note: This was already using snake_case without quotes
);



//npx supabase gen types typescript --project-id yydxbfiibfjsxowspgiq --schema public > types/supabase.ts
