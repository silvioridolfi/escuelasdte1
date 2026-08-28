create schema if not exists portal_escuelas;

create table portal_escuelas.equipo_directivo (id uuid primary key default gen_random_uuid(), cue integer not null, cargo text not null, nombre_completo text not null, telefono text, email text, created_at timestamptz not null default now());
create table portal_escuelas.conectividad (id uuid primary key default gen_random_uuid(), cue integer not null unique, tipo_piso_tecnologico text, proveedor_internet text, tipo_enlace text, velocidad_contratada text, estado text, observaciones text, created_at timestamptz not null default now());
create table portal_escuelas.fed_asignado (id uuid primary key default gen_random_uuid(), cue integer not null unique, fed_nombre text, fed_email text, fed_telefono text, distrito text, created_at timestamptz not null default now());
create table portal_escuelas.cambios_pendientes (id uuid primary key default gen_random_uuid(), cue integer not null, campo text not null, valor_actual text, valor_propuesto text not null, solicitado_por text not null, estado text not null default 'pendiente', created_at timestamptz not null default now());
create table portal_escuelas.solicitudes (id uuid primary key default gen_random_uuid(), cue integer not null, tipo text not null, descripcion text not null, solicitado_por text not null, estado text not null default 'abierta', created_at timestamptz not null default now());

alter table portal_escuelas.equipo_directivo enable row level security;
alter table portal_escuelas.conectividad enable row level security;
alter table portal_escuelas.fed_asignado enable row level security;
alter table portal_escuelas.cambios_pendientes enable row level security;
alter table portal_escuelas.solicitudes enable row level security;
