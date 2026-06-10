'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatoPrecio, PRECIO_MEMORIAS } from '@/data/ticketsData';
import { WHATSAPP_URL } from '@/data/contactData';
import { useLocalidades } from '@/hooks/useLocalidades';
import { useCart } from '@/context/CartContext';
import { TicketType } from '@/types/tickets';
import '../landing.css';

const FEATURED = TicketType.DIAMOND;
const MAX_CANTIDAD = 10;

const NOTES = [
  'Ninguna de las localidades incluye hospedaje, desayunos, almuerzos ni transportes.',
  'Los refrigerios están incluidos en todas las localidades presenciales (uno por jornada).',
  'Las memorias están incluidas en la Localidad Diamante. El resto de asistentes puede adquirirlas por separado.',
  'No se pueden adquirir entradas por jornadas independientes. Las entradas aplican para el evento completo.',
  'El streaming no incluye memorias del evento.',
  'Cupos limitados por localidad. Precios sujetos a cambio según disponibilidad.',
];

const precio = (n: number) =>
  formatoPrecio(n).replace('COP', '').replace('$', '').trim();

export default function BoleteriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const { localidades, loading } = useLocalidades();

  const [localidad, setLocalidad] = useState<string>(FEATURED);
  const [cantidad, setCantidad] = useState(1);
  const [incluirMemorias, setIncluirMemorias] = useState(false);

  const detalles = localidades[localidad];
  const precioMemorias = localidades['memorias']?.price ?? PRECIO_MEMORIAS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Preselección por URL (?localidad=slug)
  useEffect(() => {
    const param = searchParams ? searchParams.get('localidad') : null;
    if (param) setLocalidad(param);
  }, [searchParams]);

  // Si la localidad no existe en la API (slug viejo), usar la primera disponible
  useEffect(() => {
    if (loading || localidades[localidad]) return;
    const first = Object.entries(localidades).find(([, t]) => t.pushable)?.[0];
    if (first) setLocalidad(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, localidades, localidad]);

  // Sincronizar memorias al cambiar de localidad (marcadas solo si vienen incluidas)
  useEffect(() => {
    if (detalles) setIncluirMemorias(!!detalles.withMemories);
  }, [localidad, detalles?.withMemories]); // eslint-disable-line react-hooks/exhaustive-deps

  const memoriasExtra = incluirMemorias && !detalles?.withMemories && !detalles?.noPermiteMemorias;
  const total = detalles ? (detalles.price + (memoriasExtra ? precioMemorias : 0)) * cantidad : 0;

  const handleAgregar = () => {
    if (!detalles) return;
    addItem(
      localidad as TicketType,
      cantidad,
      incluirMemorias,
      detalles.price,
      precioMemorias,
    );
    router.push('/carrito');
  };

  return (
    <div className="cnmp-root">
      <div className="bg-field" />

      {/* NAVBAR */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="/"><img className="logo" src="/logo-principal.png" alt="CNMP 2026" /></a>
        <div className="nav-links">
          <a href="/#tour">La Gira</a>
          <a href="/#speakers">Speakers</a>
          <a href="/#agenda">Agenda</a>
          <a href="/#entradas">Entradas</a>
          <a href="/#contacto">Contacto</a>
          <a className="btn btn-neon" href="#entradas-grid">Inscríbete <span className="arr">→</span></a>
        </div>
      </nav>

      <main className="page" style={{ paddingTop: 96 }}>

        {/* ── HEADER ── */}
        <section className="wrap" style={{ paddingBottom: 0 }}>
          <div style={{ maxWidth: 880, marginBottom: 28 }}>
            <span className="eyebrow">Boletería · Colombia · 28–29 Ago 2026</span>
            <h1 className="h-sec" style={{ marginTop: 12, fontSize: 'clamp(30px,4vw,48px)' }}>
              Elige tu lugar <span style={{ color: 'var(--neon)' }}>en el congreso.</span>
            </h1>
            <p className="lead" style={{ marginTop: 10, fontSize: 15 }}>
              Cupos limitados por localidad. Boletería independiente por ciudad — esta
              página corresponde a <strong style={{ color: '#fff' }}>Colombia 2026</strong>.
            </p>
          </div>
        </section>

        {/* ── SELECCIÓN + RESUMEN ── */}
        <section id="entradas-grid" className="band" style={{ paddingTop: 0, paddingBottom: 56 }}>
          <div className="wrap">

            {loading ? (
              <div className="qs-grid" aria-hidden="true">
                <div className="bsel-list">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bsel">
                      <div className="bsel-head">
                        <span className="sk-line" style={{ width: 28, height: 28, borderRadius: 8 }} />
                        <span className="sk-line" style={{ flex: 1, height: 18 }} />
                        <span className="sk-line" style={{ width: 90, height: 18 }} />
                        <span className="sk-line" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="qs-panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <span className="sk-line" style={{ width: '60%', height: 16 }} />
                  <span className="sk-line" style={{ width: '100%', height: 14 }} />
                  <span className="sk-line" style={{ width: '100%', height: 14 }} />
                  <span className="sk-line" style={{ width: '100%', height: 30, marginTop: 10 }} />
                  <span className="sk-line" style={{ width: '100%', height: 46, borderRadius: 100, marginTop: 14 }} />
                </div>
              </div>
            ) : (
              <div className="qs-grid">

                {/* Localidades como filas seleccionables */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="bsel-list">
                    {Object.entries(localidades)
                      .filter(([key, t]) => key !== 'memorias' && t.pushable)
                      .map(([type, t]) => {
                        const isSelected = type === localidad;
                        return (
                          <article
                            key={type}
                            className={`bsel${isSelected ? ' active' : ''}`}
                            onClick={() => setLocalidad(type)}
                            role="radio"
                            aria-checked={isSelected}
                          >
                            <div className="bsel-head">
                              <span className="bsel-icon">{t.icon}</span>
                              <div className="bsel-info">
                                <div className="nm">
                                  {t.name}
                                  {type === FEATURED && <span className="tag">Más completo</span>}
                                </div>
                                {t.withMemories && <div className="sub">Incluye memorias del evento</div>}
                                {type === TicketType.STREAMING && <div className="sub">Acceso virtual</div>}
                              </div>
                              <div className="bsel-price"><span className="cur">COP</span>{precio(t.price)}</div>
                              <span className="bsel-radio" />
                            </div>
                            {isSelected && (
                              <ul className="bsel-feats">
                                {t.features.map((f, i) => <li key={i}>{f}</li>)}
                              </ul>
                            )}
                          </article>
                        );
                      })}
                  </div>

                  {/* Cantidad + memorias */}
                  <div className="qs-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
                    <div>
                      <span className="qs-label">Cantidad</span>
                      <div className="qs-stepper">
                        <button
                          onClick={() => setCantidad(c => Math.max(1, c - 1))}
                          disabled={cantidad <= 1}
                          aria-label="Menos entradas"
                        >−</button>
                        <span className="num">{cantidad}</span>
                        <button
                          onClick={() => setCantidad(c => Math.min(MAX_CANTIDAD, c + 1))}
                          disabled={cantidad >= MAX_CANTIDAD}
                          aria-label="Más entradas"
                        >+</button>
                      </div>
                      <p className="qs-hint">Hasta {MAX_CANTIDAD} por compra.</p>
                    </div>

                    {detalles && !detalles.withMemories && !detalles.noPermiteMemorias && (
                      <div style={{ flex: 1, minWidth: 260 }}>
                        <span className="qs-label">Add-on opcional</span>
                        <div
                          className={`qs-check${incluirMemorias ? ' on' : ''}`}
                          onClick={() => setIncluirMemorias(v => !v)}
                          role="checkbox"
                          aria-checked={incluirMemorias}
                        >
                          <span className="box">{incluirMemorias ? '✓' : ''}</span>
                          <span>
                            <span className="tt">📀 Memorias del evento</span>
                            <span className="dd" style={{ display: 'block' }}>
                              Grabación completa de las conferencias y material exclusivo.
                              Acceso digital permanente, por entrada.
                            </span>
                          </span>
                          <span className="pp">COP {precio(precioMemorias)}</span>
                        </div>
                      </div>
                    )}
                    {detalles?.withMemories && (
                      <p className="qs-included" style={{ marginTop: 26 }}>
                        ✓ Esta localidad incluye las memorias del evento
                      </p>
                    )}
                  </div>
                </div>

                {/* Resumen sticky */}
                <div className="qs-sticky">
                  <div className="qs-panel qs-summary">
                    <span className="qs-label">Resumen</span>
                    <div className="row">
                      <span>{detalles?.name ?? 'Entrada'}</span>
                      <span className="v">COP {precio(detalles?.price ?? 0)}</span>
                    </div>
                    {memoriasExtra && (
                      <div className="row">
                        <span>Memorias del evento</span>
                        <span className="v">COP {precio(precioMemorias)}</span>
                      </div>
                    )}
                    <div className="row">
                      <span>Cantidad</span>
                      <span className="v">×{cantidad}</span>
                    </div>
                    <div className="total">
                      <span>Total</span>
                      <span className="v">COP {precio(total)}</span>
                    </div>
                    <button
                      className="btn btn-neon"
                      style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}
                      onClick={handleAgregar}
                      disabled={!detalles}
                    >
                      Agregar al carrito <span className="arr">→</span>
                    </button>
                    <p className="qs-hint" style={{ textAlign: 'center', marginTop: 12 }}>
                      Los datos de los asistentes y el pago se completan en el carrito.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTAS (colapsables) ── */}
            <details className="bol-notes" style={{ marginTop: 24 }}>
              <summary><span className="eyebrow">Notas importantes</span></summary>
              <ul className="lp-list">
                {NOTES.map((n, i) => (
                  <li key={i}><span className="lp-list-dot">→</span>{n}</li>
                ))}
              </ul>
            </details>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="wrap">
            <div className="foot-grid">
              <div>
                <img className="logo" src="/logo-principal.png" alt="CNMP 2026" />
                <p className="desc">Congreso Nacional de Marketing Político. La gira que redefine cómo se hace política en Latinoamérica.</p>
              </div>
              <div className="foot-col">
                <h4>La Gira</h4>
                <a href="/#tour">Colombia 2026</a>
                <a href="/#tour">Santo Domingo 2026</a>
                <a href="/#tour">Cd. de México 2027</a>
              </div>
              <div className="foot-col">
                <h4>Evento</h4>
                <a href="/#speakers">Conferencistas</a>
                <a href="/#agenda">Agenda</a>
                <a href="#entradas-grid">Entradas</a>
              </div>
              <div className="foot-col">
                <h4>Contacto</h4>
                <a href="mailto:cnmpcolombia@gmail.com">cnmpcolombia@gmail.com</a>
                <a href="https://cnmpcolombia.com">cnmpcolombia.com</a>
              </div>
            </div>
            <div className="foot-bottom">
              <span>© {new Date().getFullYear()} CNMP — Congreso Nacional de Marketing Político.</span>
              <span className="mono">3 CIUDADES · 3 PAÍSES · 1 COMUNIDAD</span>
            </div>
          </div>
        </footer>
      </main>

      {/* WhatsApp */}
      <a className="wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.738-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/></svg>
      </a>
    </div>
  );
}
