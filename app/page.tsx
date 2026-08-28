'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, ArrowRight, Building2, Cable, ClipboardList, Mail, MapPin, Pencil, Phone, Plus, Search, UserRound, Wifi } from 'lucide-react'

const getDb = () => createClient()
const empty = (action?: string) => <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-4"><p className="text-sm text-muted-foreground">Sin datos cargados todavía</p>{action && <button className="text-sm font-semibold text-primary hover:underline" type="button">{action}</button>}</div>

function Card({ icon: Icon, title, children, action, onAction }: { icon: typeof Building2, title: string, children: React.ReactNode, action?: string, onAction?: () => void }) {
  return <section className="flex min-h-64 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="mb-5 flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-3 text-primary"><Icon aria-hidden="true" /></div><h2 className="text-xl font-bold tracking-tight">{title}</h2></div>{action && <button onClick={onAction} type="button" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-primary hover:bg-primary/10"><Plus aria-hidden="true" size={16} />{action}</button>}</div>{children}</section>
}

function Row({ label, value, icon: Icon }: { label: string, value?: string | number | null, icon?: typeof Phone }) { return <div className="flex items-start gap-3">{Icon && <Icon className="mt-0.5 text-muted-foreground" size={17} aria-hidden="true" />}<div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="text-sm font-medium">{value || '—'}</p></div></div> }

function Header({ cueLabel, onBack }: { cueLabel?: string, onBack?: () => void }) {
  return (
    <header className="pba-degrade text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-white/80">DTE · Dirección de Tecnología Educativa</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Portal de Escuelas</h1>
        </div>
        {cueLabel && (
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">CUE {cueLabel}</span>
            {onBack && <button onClick={onBack} type="button" className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold hover:bg-white/25">Buscar otra escuela</button>}
          </div>
        )}
      </div>
    </header>
  )
}

function SearchLanding({ onSearch, notFound, searching }: { onSearch: (cue: string) => void, notFound: boolean, searching: boolean }) {
  const [value, setValue] = useState('')
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={(e) => { e.preventDefault(); if (value.trim()) onSearch(value.trim()) }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Search size={26} aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Consultá tu escuela</h2>
          <p className="mt-2 text-muted-foreground">Ingresá el CUE de tu establecimiento para ver su información institucional.</p>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="numeric"
            placeholder="Ej: 60712900"
            className="mt-6 w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg font-semibold tracking-wide focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {notFound && <p className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-destructive"><AlertCircle size={16} /> No se encontró ningún establecimiento con ese CUE.</p>}
          <button
            type="submit"
            disabled={searching}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {searching ? 'Buscando…' : 'Ver mi escuela'} {!searching && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function Page() {
  const [cue, setCue] = useState<string | null>(null)
  const [school, setSchool] = useState<any>(null); const [team, setTeam] = useState<any[]>([]); const [connectivity, setConnectivity] = useState<any>(null); const [fed, setFed] = useState<any>(null); const [requests, setRequests] = useState<any[]>([]); const [loading, setLoading] = useState(false); const [message, setMessage] = useState('')
  const [showRequest, setShowRequest] = useState(false)
  const [notFound, setNotFound] = useState(false)

  async function handleSearch(inputCue: string) {
    setLoading(true); setNotFound(false)
    const numericCue = Number(inputCue)
    const { data: schoolData } = await getDb().from('establecimientos').select('cue,nombre,direccion,ciudad,distrito').eq('cue', numericCue).maybeSingle()
    if (!schoolData) { setNotFound(true); setLoading(false); return }
    const [t, c, f, r] = await Promise.all([
      getDb().schema('portal_escuelas').from('equipo_directivo').select('*').eq('cue', numericCue).order('created_at'),
      getDb().schema('portal_escuelas').from('conectividad').select('*').eq('cue', numericCue).maybeSingle(),
      getDb().schema('portal_escuelas').from('fed_asignado').select('*').eq('cue', numericCue).maybeSingle(),
      getDb().schema('portal_escuelas').from('solicitudes').select('*').eq('cue', numericCue).order('created_at', { ascending: false }),
    ])
    setSchool(schoolData); setTeam(t.data || []); setConnectivity(c.data); setFed(f.data); setRequests(r.data || [])
    setCue(inputCue); setLoading(false)
  }

  function handleBack() {
    setCue(null); setSchool(null); setTeam([]); setConnectivity(null); setFed(null); setRequests([]); setMessage(''); setNotFound(false)
  }

  async function submitRequest(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const form = new FormData(e.currentTarget); const { error } = await getDb().schema('portal_escuelas').from('solicitudes').insert({ cue: Number(cue), tipo: form.get('tipo'), descripcion: form.get('descripcion'), solicitado_por: form.get('solicitado_por') }); setMessage(error ? 'No se pudo enviar la solicitud.' : 'Solicitud enviada correctamente.'); if (!error) setShowRequest(false) }

  if (!cue) return <SearchLanding onSearch={handleSearch} notFound={notFound} searching={loading} />

  return <main className="min-h-screen bg-background"><Header cueLabel={cue} onBack={handleBack} /><div className="mx-auto max-w-7xl px-5 py-8 lg:px-8"><div className="mb-8"><p className="text-sm font-semibold text-primary">Panel institucional</p><h2 className="mt-1 text-3xl font-bold tracking-tight text-balance">{school?.nombre || 'Establecimiento no encontrado'}</h2><p className="mt-2 text-muted-foreground">Accedé a la información y gestiones de tu escuela desde un solo lugar.</p></div>{message && <div className="mb-5 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm font-medium text-primary">{message}</div>}<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"><Card icon={Building2} title="Datos del establecimiento" action="Solicitar corrección" onAction={() => setShowRequest(true)}>{school ? <div className="flex flex-col gap-4"><Row label="Nombre" value={school.nombre} /><Row label="Dirección" value={[school.direccion, school.ciudad].filter(Boolean).join(', ')} icon={MapPin} /><Row label="CUE" value={school.cue} /></div> : empty('Solicitar carga de establecimiento')}</Card><Card icon={UserRound} title="Equipo directivo" action="Agregar miembro">{team.length ? <div className="flex flex-col gap-3">{team.map((m) => <div key={m.id} className="rounded-xl bg-muted/50 p-3"><div className="flex items-center justify-between"><p className="font-semibold">{m.nombre_completo}</p><Pencil size={15} className="text-muted-foreground" /></div><p className="text-sm text-primary">{m.cargo}</p><div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground"><span>{m.telefono || 'Sin teléfono'}</span><span>{m.email || 'Sin email'}</span></div></div>)}</div> : empty('Cargar primer miembro')}</Card><Card icon={Wifi} title="Conectividad">{connectivity ? <div className="flex flex-col gap-4"><Row label="Piso tecnológico" value={connectivity.tipo_piso_tecnologico} icon={Cable} /><Row label="Proveedor" value={connectivity.proveedor_internet} /><Row label="Enlace / velocidad" value={[connectivity.tipo_enlace, connectivity.velocidad_contratada].filter(Boolean).join(' · ')} /><span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{connectivity.estado || 'Sin estado informado'}</span></div> : empty()}</Card><Card icon={UserRound} title="Facilitador asignado">{fed ? <div className="flex flex-col gap-4"><Row label="Nombre" value={fed.fed_nombre} /><Row label="Email" value={fed.fed_email} icon={Mail} /><Row label="Teléfono" value={fed.fed_telefono} icon={Phone} /><Row label="Distrito" value={fed.distrito} /></div> : <div className="flex flex-col gap-3"><p className="text-sm text-muted-foreground">Aún no asignado</p></div>}</Card><Card icon={ClipboardList} title="Solicitudes y trámites" action="Nueva solicitud" onAction={() => setShowRequest(true)}>{requests.length ? <div className="flex flex-col gap-3">{requests.map((r) => <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-3"><div><p className="font-semibold">{r.tipo}</p><p className="line-clamp-1 text-sm text-muted-foreground">{r.descripcion}</p></div><span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{r.estado}</span></div>)}</div> : empty()}</Card></div></div>{showRequest && <div className="fixed inset-0 flex items-center justify-center bg-foreground/30 p-5"><form onSubmit={submitRequest} className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-card p-6 shadow-xl"><div><h2 className="text-xl font-bold">Nueva solicitud</h2><p className="text-sm text-muted-foreground">Completá los datos para enviar tu gestión.</p></div><label className="flex flex-col gap-2 text-sm font-semibold">Tipo<select name="tipo" required className="rounded-lg border bg-background p-3 font-normal"><option>Soporte técnico</option><option>Visita del FED</option><option>Reporte de problema</option></select></label><label className="flex flex-col gap-2 text-sm font-semibold">Descripción<textarea name="descripcion" required rows={4} className="rounded-lg border bg-background p-3 font-normal" /></label><label className="flex flex-col gap-2 text-sm font-semibold">Solicitado por<input name="solicitado_por" required className="rounded-lg border bg-background p-3 font-normal" /></label><div className="flex justify-end gap-3"><button type="button" onClick={() => setShowRequest(false)} className="rounded-lg px-4 py-2 text-sm font-semibold">Cancelar</button><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Enviar solicitud <ArrowRight size={16} /></button></div></form></div>}</main>
}
