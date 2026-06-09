'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TicketType } from '@/types/tickets';
import { formatoPrecio, PRECIO_MEMORIAS } from '@/data/ticketsData';
import { useLocalidades } from '@/hooks/useLocalidades';
import { useCart } from '@/context/CartContext';
import '../landing.css';

const MAX_CANTIDAD = 10;

const precio = (n: number) =>
  formatoPrecio(n).replace('COP', '').replace('$', '').trim();

export default function SeleccionCantidad() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  const { localidades, loading } = useLocalidades();
  const [localidad, setLocalidad] = useState<string>(TicketType.DIAMOND);
  const [cantidad, setCantidad] = useState(1);
  const [incluirMemorias, setIncluirMemorias] = useState(false);

  const detalles = localidades[localidad];
  const precioMemorias = localidades['memorias']?.price ?? PRECIO_MEMORIAS;

  // Localidad desde la URL
  useEffect(() => {
    const localidadParam = searchParams ? searchParams.get('localidad') : null;
    if (localidadParam) setLocalidad(localidadParam);
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
      <nav className="nav scrolled">
        <a href="/"><img className="logo" src="/logo-principal.png" alt="CNMP 2026" /></a>
        <div className="nav-links">
          <a className="btn btn-ghost" href="/boleteria">← Volver a boletería</a>
        </div>
      </nav>

      <main className="page" style={{ paddingTop: 100 }}>
        <section className="wrap" style={{ paddingBottom: 80 }}>
          <div style={{ maxWidth: 720, marginBottom: 40 }}>
            <span className="eyebrow">Boletería · Colombia 2026</span>
            <h1 className="h-sec" style={{ marginTop: 16 }}>
              Configura<br />
              <span style={{ color: 'var(--neon)' }}>tu compra.</span>
            </h1>
          </div>

          {loading ? (
            <div className="qs-grid" aria-hidden="true">
              <div className="qs-panel" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span className="sk-line" style={{ width: 140, height: 58, borderRadius: 14 }} />
                  <span className="sk-line" style={{ width: 140, height: 58, borderRadius: 14 }} />
                  <span className="sk-line" style={{ width: 140, height: 58, borderRadius: 14 }} />
                </div>
                <span className="sk-line" style={{ width: 180, height: 52, borderRadius: 12 }} />
                <span className="sk-line" style={{ width: '80%', height: 40 }} />
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
              {/* ── Configuración ── */}
              <div className="qs-panel" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <span className="qs-label">Localidad</span>
                  <div className="qs-pills">
                    {Object.entries(localidades)
                      .filter(([key, t]) => key !== 'memorias' && t.pushable)
                      .map(([key, t]) => (
                        <button
                          key={key}
                          className={`qs-pill${localidad === key ? ' active' : ''}`}
                          onClick={() => setLocalidad(key)}
                        >
                          <span className="nm">{t.icon} {t.name.replace('Localidad ', '')}</span>
                          <span className="pr">COP {precio(t.price)}</span>
                        </button>
                      ))}
                  </div>
                  {detalles?.withMemories && (
                    <p className="qs-included">✓ Esta localidad incluye las memorias del evento</p>
                  )}
                </div>

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
                  <p className="qs-hint">Hasta {MAX_CANTIDAD} entradas por compra.</p>
                </div>

                {detalles && !detalles.withMemories && !detalles.noPermiteMemorias && (
                  <div>
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
                          Grabación completa de las conferencias, por entrada
                        </span>
                      </span>
                      <span className="pp">COP {precio(precioMemorias)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Resumen ── */}
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
          )}
        </section>
      </main>
    </div>
  );
}
