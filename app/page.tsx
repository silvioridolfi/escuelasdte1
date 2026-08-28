'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Cable,
  ClipboardList,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  UserRound,
  Wifi,
} from 'lucide-react'

const getDb = () => createClient()

const CAMPOS_ESTABLECIMIENTO = [
  { value: 'nombre', label: 'Nombre' },
  { value: 'direccion', label: 'Dirección' },
  { value: 'ciudad', label: 'Ciudad' },
  { value: 'distrito', label: 'Distrito' },
]

function Empty() {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-4">
      <p className="text-sm text-muted-foreground">Sin datos cargados todavía</p>
    </div>
  )
}

function Card({
  icon: Icon,
  title,
  children,
  action,
  onAction,
}: {
  icon: typeof Building2
  title: string
  children: React.ReactNode
  action?: string
  onAction?: () => void
}) {
  return (
    <section className="flex min-h-64 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Icon aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>
        {action && (
          <button
            onClick={onAction}
            type="button"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            <Plus aria-hidden="true" size={16} />
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

function Row({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value?: string | number | null
  icon?: typeof Phone
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="mt-0.5 text-muted-foreground" size={17} aria-hidden="true" />}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || '—'}</p>
      </div>
    </div>
  )
}

function Header({ cueLabel, onBack }: { cueLabel?: string; onBack?: () => void }) {
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
            {onBack && (
              <button
                onClick={onBack}
                type="button"
                className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold hover:bg-white/25"
              >
                Buscar otra escuela
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-5">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-card p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

function SearchLanding({
  onSearch,
  notFound,
  searching,
}: {
  onSearch: (cue: string) => void
  notFound: boolean
  searching: boolean
}) {
  const [value, setValue] = useState('')
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (value.trim()) onSearch(value.trim())
          }}
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
          {notFound && (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-destructive">
              <AlertCircle size={16} /> No se encontró ningún establecimiento con ese CUE.
            </p>
          )}
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
  const [school, setSchool] = useState<any>(null)
  const [team, setTeam] = useState<any[]>([])
  const [fed, setFed] = useState<any>(null)
  const [ced, setCed] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [notFound, setNotFound] = useState(false)

  const [showCorreccion, setShowCorreccion] = useState(false)
  const [showMiembro, setShowMiembro] = useState(false)
  const [showSolicitud, setShowSolicitud] = useState(false)
  const [editingContact, setEditingContact] = useState<any>(null)

  async function refetchPortalData(numericCue: number, schoolData: any) {
    const [t, r, cedRow] = await Promise.all([
      getDb().from('contactos').select('*').eq('cue', numericCue).order('cargo'),
      getDb().schema('portal_escuelas').from('solicitudes').select('*').eq('cue', numericCue).order('created_at', { ascending: false }),
      getDb().schema('portal_escuelas').from('coordinador_ced').select('*').maybeSingle(),
    ])
    setTeam(t.data || [])
    setRequests(r.data || [])
    setCed(cedRow.data)

    if (schoolData?.fed_a_cargo && schoolData.fed_a_cargo !== 'Sin FED asignado') {
      const { data: fedData } = await getDb()
        .schema('portal_escuelas')
        .from('fed_directorio')
        .select('*')
        .eq('nombre', schoolData.fed_a_cargo)
        .maybeSingle()
      setFed(fedData ? { ...fedData, distrito: schoolData.distrito } : { nombre: schoolData.fed_a_cargo, distrito: schoolData.distrito })
    } else {
      setFed(null)
    }
  }

  async function handleSearch(inputCue: string) {
    setLoading(true)
    setNotFound(false)
    const numericCue = Number(inputCue)
    const { data: schoolData } = await getDb()
      .from('establecimientos')
      .select(
        'cue,nombre,direccion,ciudad,distrito,fed_a_cargo,plan_enlace,proveedor_internet_pnce,pnce_estado,plan_piso_tecnologico,tipo_piso_instalado,mb'
      )
      .eq('cue', numericCue)
      .maybeSingle()
    if (!schoolData) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setSchool(schoolData)
    await refetchPortalData(numericCue, schoolData)
    setCue(inputCue)
    setLoading(false)
  }

  function handleBack() {
    setCue(null)
    setSchool(null)
    setTeam([])
    setFed(null)
    setCed(null)
    setRequests([])
    setMessage('')
    setNotFound(false)
  }

  async function submitCorreccion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const campo = String(form.get('campo'))
    const valorActual = school?.[campo] ?? null
    const { error } = await getDb().schema('portal_escuelas').from('cambios_pendientes').insert({
      cue: Number(cue),
      campo,
      valor_actual: valorActual,
      valor_propuesto: form.get('valor_propuesto'),
      solicitado_por: form.get('solicitado_por'),
    })
    setMessage(error ? 'No se pudo enviar la solicitud de corrección.' : 'Solicitud de corrección enviada. Un FED la va a revisar antes de aplicarla.')
    if (!error) setShowCorreccion(false)
  }

  async function submitMiembro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      cue: Number(cue),
      accion: editingContact ? 'editar' : 'agregar',
      contacto_id: editingContact?.id ?? null,
      nombre: form.get('nombre'),
      apellido: form.get('apellido'),
      cargo: form.get('cargo'),
      telefono: form.get('telefono') || null,
      correo: form.get('correo') || null,
      solicitado_por: form.get('solicitado_por'),
    }
    const { error } = await getDb().schema('portal_escuelas').from('contactos_pendientes').insert(payload)
    setMessage(
      error
        ? 'No se pudo enviar la propuesta de cambio.'
        : editingContact
          ? 'Corrección de contacto enviada. Un FED la va a revisar antes de aplicarla.'
          : 'Alta de contacto enviada. Un FED la va a revisar antes de aplicarla.'
    )
    if (!error) {
      setShowMiembro(false)
      setEditingContact(null)
    }
  }

  async function submitSolicitud(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const { error } = await getDb().schema('portal_escuelas').from('solicitudes').insert({
      cue: Number(cue),
      tipo: form.get('tipo'),
      descripcion: form.get('descripcion'),
      solicitado_por: form.get('solicitado_por'),
    })
    setMessage(error ? 'No se pudo enviar la solicitud.' : 'Solicitud enviada correctamente.')
    if (!error) {
      setShowSolicitud(false)
      await refetchPortalData(Number(cue), school)
    }
  }

  if (!cue) return <SearchLanding onSearch={handleSearch} notFound={notFound} searching={loading} />

  const conectividadDisponible = school && (school.plan_enlace || school.proveedor_internet_pnce || school.plan_piso_tecnologico || school.tipo_piso_instalado)

  return (
    <main className="min-h-screen bg-background">
      <Header cueLabel={cue} onBack={handleBack} />
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">Panel institucional</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-balance">{school?.nombre || 'Establecimiento no encontrado'}</h2>
          <p className="mt-2 text-muted-foreground">Accedé a la información y gestiones de tu escuela desde un solo lugar.</p>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm font-medium text-primary">{message}</div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Card icon={Building2} title="Datos del establecimiento" action="Solicitar corrección" onAction={() => setShowCorreccion(true)}>
            {school ? (
              <div className="flex flex-col gap-4">
                <Row label="Nombre" value={school.nombre} />
                <Row label="Dirección" value={[school.direccion, school.ciudad].filter(Boolean).join(', ')} icon={MapPin} />
                <Row label="CUE" value={school.cue} />
              </div>
            ) : (
              <Empty />
            )}
          </Card>

          <Card
            icon={UserRound}
            title="Equipo directivo"
            action="Agregar miembro"
            onAction={() => {
              setEditingContact(null)
              setShowMiembro(true)
            }}
          >
            {team.length ? (
              <div className="flex flex-col gap-3">
                {team.map((m) => (
                  <div key={m.id} className="rounded-xl bg-muted/50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        {m.nombre} {m.apellido}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingContact(m)
                          setShowMiembro(true)
                        }}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Pencil size={15} />
                      </button>
                    </div>
                    <p className="text-sm text-primary">{m.cargo}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{m.telefono || 'Sin teléfono'}</span>
                      <span>{m.correo || 'Sin email'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Card>

          <Card icon={Wifi} title="Conectividad">
            {conectividadDisponible ? (
              <div className="flex flex-col gap-4">
                <Row label="Plan de enlace" value={school.plan_enlace} icon={Cable} />
                <Row label="Proveedor de internet" value={school.proveedor_internet_pnce} />
                <Row label="Piso tecnológico" value={school.plan_piso_tecnologico} />
                <Row label="Estado del piso instalado" value={school.tipo_piso_instalado} />
                {school.pnce_estado && (
                  <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{school.pnce_estado}</span>
                )}
              </div>
            ) : (
              <Empty />
            )}
          </Card>

          <Card icon={UserRound} title="Facilitador asignado">
            <div className="flex flex-col gap-5">
              {fed ? (
                <div className="flex flex-col gap-4">
                  <Row label="Nombre" value={fed.nombre} />
                  <Row label="Email" value={fed.email} icon={Mail} />
                  <Row label="Teléfono" value={fed.telefono} icon={Phone} />
                  <Row label="Distrito" value={fed.distrito} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aún no asignado</p>
              )}
              {ced && (
                <div className="border-t border-border pt-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Coordinador de Educación Digital</p>
                  <div className="flex flex-col gap-4">
                    <Row label="Nombre" value={ced.nombre} />
                    <Row label="Email" value={ced.email} icon={Mail} />
                    <Row label="Teléfono" value={ced.telefono} icon={Phone} />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card icon={ClipboardList} title="Solicitudes y trámites" action="Nueva solicitud" onAction={() => setShowSolicitud(true)}>
            {requests.length ? (
              <div className="flex flex-col gap-3">
                {requests.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-3">
                    <div>
                      <p className="font-semibold">{r.tipo}</p>
                      <p className="line-clamp-1 text-sm text-muted-foreground">{r.descripcion}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{r.estado}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        </div>
      </div>

      {showCorreccion && (
        <Modal
          title="Solicitar corrección"
          subtitle="El cambio queda pendiente hasta que un FED lo revise y apruebe."
          onClose={() => setShowCorreccion(false)}
        >
          <form onSubmit={submitCorreccion} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Campo a corregir
              <select name="campo" required className="rounded-lg border bg-background p-3 font-normal">
                {CAMPOS_ESTABLECIMIENTO.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Valor correcto
              <input name="valor_propuesto" required className="rounded-lg border bg-background p-3 font-normal" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Solicitado por
              <input name="solicitado_por" required className="rounded-lg border bg-background p-3 font-normal" />
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowCorreccion(false)} className="rounded-lg px-4 py-2 text-sm font-semibold">
                Cancelar
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Enviar solicitud <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showMiembro && (
        <Modal
          title={editingContact ? 'Corregir datos del miembro' : 'Agregar miembro del equipo directivo'}
          subtitle="El cambio queda pendiente hasta que un FED lo revise y apruebe."
          onClose={() => {
            setShowMiembro(false)
            setEditingContact(null)
          }}
        >
          <form onSubmit={submitMiembro} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Cargo
              <select name="cargo" defaultValue={editingContact?.cargo || 'DIRECTOR'} required className="rounded-lg border bg-background p-3 font-normal">
                <option value="DIRECTOR">Director/a</option>
                <option value="VICEDIRECTOR">Vicedirector/a</option>
                <option value="SECRETARIO">Secretario/a</option>
                <option value="REGENTE">Regente</option>
                <option value="OTRO">Otro</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Nombre
              <input name="nombre" defaultValue={editingContact?.nombre || ''} required className="rounded-lg border bg-background p-3 font-normal" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Apellido
              <input name="apellido" defaultValue={editingContact?.apellido || ''} className="rounded-lg border bg-background p-3 font-normal" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Teléfono
              <input name="telefono" defaultValue={editingContact?.telefono || ''} className="rounded-lg border bg-background p-3 font-normal" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Email
              <input name="correo" type="email" defaultValue={editingContact?.correo || ''} className="rounded-lg border bg-background p-3 font-normal" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Solicitado por
              <input name="solicitado_por" required className="rounded-lg border bg-background p-3 font-normal" />
            </label>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowMiembro(false)
                  setEditingContact(null)
                }}
                className="rounded-lg px-4 py-2 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Enviar {editingContact ? 'corrección' : 'alta'} <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showSolicitud && (
        <Modal title="Nueva solicitud" subtitle="Completá los datos para enviar tu gestión." onClose={() => setShowSolicitud(false)}>
          <form onSubmit={submitSolicitud} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Tipo
              <select name="tipo" required className="rounded-lg border bg-background p-3 font-normal">
                <option>Soporte técnico</option>
                <option>Visita del FED</option>
                <option>Reporte de problema</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Descripción
              <textarea name="descripcion" required rows={4} className="rounded-lg border bg-background p-3 font-normal" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Solicitado por
              <input name="solicitado_por" required className="rounded-lg border bg-background p-3 font-normal" />
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowSolicitud(false)} className="rounded-lg px-4 py-2 text-sm font-semibold">
                Cancelar
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Enviar solicitud <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}
