'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatoPrecio } from '@/data/ticketsData';
import { WHATSAPP_URL } from '@/data/contactData';
import { useLocalidades } from '@/hooks/useLocalidades';
import { useCart } from '@/context/CartContext';
import { TicketType } from '@/types/tickets';
import { Edition } from '@/types/edition';
import { getPublicEditions, getEditionBySlug } from '@/services/editions';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import '../landing.css';

const MAX_CANTIDAD = 10;

// Las notas se traducen por índice (boleteria.notes.1..6); este arreglo solo
// define cuántas se muestran.
const NOTE_KEYS = ['1', '2', '3', '4', '5', '6'];

const precio = (n: number) =>
  formatoPrecio(n).replace('COP', '').replace('$', '').trim();

export default function BoleteriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { addItem, setEdition } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [edition, setEditionData] = useState<Edition | null>(null);
  const [allEditions, setAllEditions] = useState<Edition[]>([]);
  const [editionLoading, setEditionLoading] = useState(true);
  const { localidades, loading: localidadesLoading } = useLocalidades(edition?.id);
  const loading = editionLoading || localidadesLoading;

  const [localidad, setLocalidad] = useState<string>('');
  const [cantidad, setCantidad] = useState(1);
  // Ids de los add-ons opcionales seleccionados para esta localidad
  const [selectedOptional, setSelectedOptional] = useState<number[]>([]);

  // Localidad destacada: la de mayor precio entre las comprables (dinámico)
  const featuredSlug = Object.entries(localidades)
    .filter(([key, loc]) => key !== 'memorias' && loc.pushable)
    .sort((a, b) => b[1].price - a[1].price)[0]?.[0];

  const detalles = localidades[localidad];
  const includedAddOns = (detalles?.addOns ?? []).filter(a => a.included);
  const optionalAddOns = (detalles?.addOns ?? []).filter(a => !a.included);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lista de ediciones visibles (para el footer "La Gira", sin datos quemados)
  useEffect(() => {
    getPublicEditions().then(setAllEditions).catch(() => setAllEditions([]));
  }, []);

  // Resolver la edición: por slug en la URL (?ed=...) o la primera abierta a ventas
  useEffect(() => {
    let cancelled = false;
    const resolveEdition = async () => {
      setEditionLoading(true);
      const slug = searchParams?.get('ed');
      let ed: Edition | null = null;
      if (slug) {
        ed = await getEditionBySlug(slug);
      }
      if (!ed) {
        const list = await getPublicEditions();
        ed = list.find(e => e.salesOpen) ?? list[0] ?? null;
      }
      if (cancelled) return;
      setEditionData(ed);
      if (ed) setEdition(ed.id, ed.slug);
      setEditionLoading(false);
    };
    resolveEdition();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Preselección por URL (?localidad=slug)
  useEffect(() => {
    const param = searchParams ? searchParams.get('localidad') : null;
    if (param) setLocalidad(param);
  }, [searchParams]);

  // Si la localidad no existe en la API (slug viejo o sin seleccionar), usar la destacada
  useEffect(() => {
    if (loading || localidades[localidad]) return;
    if (featuredSlug) setLocalidad(featuredSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, localidades, localidad, featuredSlug]);

  // Al cambiar de localidad se reinicia la selección de add-ons opcionales
  useEffect(() => {
    setSelectedOptional([]);
  }, [localidad]);

  const optionalTotal = optionalAddOns
    .filter(a => selectedOptional.includes(a.id))
    .reduce((s, a) => s + a.price, 0);
  const total = detalles ? (detalles.price + optionalTotal) * cantidad : 0;

  const toggleOptional = (id: number) =>
    setSelectedOptional(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );

  const handleAgregar = () => {
    if (!detalles || !edition) return;
    if (!edition.salesOpen) {
      alert(t('boleteria.notOpenAlert'));
      return;
    }
    setEdition(edition.id, edition.slug);
    const addOns = [
      ...includedAddOns.map(a => ({ id: a.id, slug: a.slug, name: a.name, price: 0 })),
      ...optionalAddOns
        .filter(a => selectedOptional.includes(a.id))
        .map(a => ({ id: a.id, slug: a.slug, name: a.name, price: a.price })),
    ];
    addItem(localidad as TicketType, cantidad, detalles.price, addOns);
    router.push('/carrito');
  };

  return (
    <div className="cnmp-root">
      <div className="bg-field" />

      {/* NAVBAR */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="/"><img className="logo" src="/logo-principal.png" alt="CNMP 2026" /></a>
        {edition && (
          <span
            title={t('boleteria.buyingFor', { name: edition.name })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 100,
              border: '1px solid var(--line)', background: 'rgba(255,255,255,.05)',
              fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap',
              maxWidth: '50vw', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            🎟 <span style={{ color: 'var(--neon)' }}>{edition.city ?? edition.country}</span> {edition.year}
          </span>
        )}
        <div className="nav-links">
          <a href="/#tour">{t('landing.nav.tour')}</a>
          <a href="/#speakers">{t('landing.nav.speakers')}</a>
          <a href="/#agenda">{t('landing.nav.agenda')}</a>
          <a href="/#entradas">{t('landing.nav.tickets')}</a>
          <a href="/#contacto">{t('landing.nav.contact')}</a>
          <a className="btn btn-neon" href="#entradas-grid">{t('boleteria.register')} <span className="arr">→</span></a>
          <LanguageSwitcher className="ml-1" />
        </div>
      </nav>

      <main className="page" style={{ paddingTop: 96 }}>

        {/* ── HEADER ── */}
        <section className="wrap" style={{ paddingBottom: 0 }}>
          <div style={{ maxWidth: 880, marginBottom: 28 }}>
            <span className="eyebrow">
              {t('boleteria.eyebrow')} · {edition ? `${edition.city ?? edition.country}${edition.display?.dateShort ? ` · ${edition.display.dateShort}` : ''}` : '…'}
            </span>
            <h1 className="h-sec" style={{ marginTop: 12, fontSize: 'clamp(30px,4vw,48px)' }}>
              {t('boleteria.titleMain')} <span style={{ color: 'var(--neon)' }}>{t('boleteria.titleAccent')}</span>
            </h1>
            <p className="lead" style={{ marginTop: 10, fontSize: 15 }}>
              {t('boleteria.lead')} <strong style={{ color: '#fff' }}>{edition?.name ?? t('boleteria.thisEdition')}</strong>.
              {edition && !edition.salesOpen && (
                <span style={{ color: 'var(--neon)' }}> {t('boleteria.salesSoon')}</span>
              )}
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
                      .filter(([key, loc]) => key !== 'memorias' && loc.pushable)
                      .map(([type, loc]) => {
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
                              <span className="bsel-icon">{loc.icon}</span>
                              <div className="bsel-info">
                                <div className="nm">
                                  {loc.name}
                                  {type === featuredSlug && <span className="tag">{t('boleteria.mostComplete')}</span>}
                                </div>
                                {loc.withMemories && <div className="sub">{t('boleteria.includesMemories')}</div>}
                                {type === TicketType.STREAMING && <div className="sub">{t('boleteria.virtualAccess')}</div>}
                              </div>
                              <div className="bsel-price"><span className="cur">COP</span>{precio(loc.price)}</div>
                              <span className="bsel-radio" />
                            </div>
                            {isSelected && (
                              <ul className="bsel-feats">
                                {loc.features.map((f, i) => <li key={i}>{f}</li>)}
                              </ul>
                            )}
                          </article>
                        );
                      })}
                  </div>

                  {/* Cantidad + memorias */}
                  <div className="qs-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
                    <div>
                      <span className="qs-label">{t('boleteria.quantity')}</span>
                      <div className="qs-stepper">
                        <button
                          onClick={() => setCantidad(c => Math.max(1, c - 1))}
                          disabled={cantidad <= 1}
                          aria-label={t('boleteria.lessTickets')}
                        >−</button>
                        <span className="num">{cantidad}</span>
                        <button
                          onClick={() => setCantidad(c => Math.min(MAX_CANTIDAD, c + 1))}
                          disabled={cantidad >= MAX_CANTIDAD}
                          aria-label={t('boleteria.moreTickets')}
                        >+</button>
                      </div>
                      <p className="qs-hint">{t('boleteria.maxPerPurchase', { max: MAX_CANTIDAD })}</p>
                    </div>

                    {(optionalAddOns.length > 0 || includedAddOns.length > 0) && (
                      <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {optionalAddOns.length > 0 && <span className="qs-label">{t('boleteria.optionalAddOns')}</span>}
                        {optionalAddOns.map(a => {
                          const on = selectedOptional.includes(a.id);
                          return (
                            <div
                              key={a.id}
                              className={`qs-check${on ? ' on' : ''}`}
                              onClick={() => toggleOptional(a.id)}
                              role="checkbox"
                              aria-checked={on}
                            >
                              <span className="box">{on ? '✓' : ''}</span>
                              <span>
                                <span className="tt">{a.icon ?? '➕'} {a.name}</span>
                                {a.description && (
                                  <span className="dd" style={{ display: 'block' }}>{a.description}</span>
                                )}
                              </span>
                              <span className="pp">COP {precio(a.price)}</span>
                            </div>
                          );
                        })}
                        {includedAddOns.map(a => (
                          <p key={a.id} className="qs-included">
                            {t('boleteria.includesAddon', { name: a.name })}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Resumen sticky */}
                <div className="qs-sticky">
                  <div className="qs-panel qs-summary">
                    <span className="qs-label">{t('boleteria.summary')}</span>
                    <div className="row">
                      <span>{detalles?.name ?? t('boleteria.ticket')}</span>
                      <span className="v">COP {precio(detalles?.price ?? 0)}</span>
                    </div>
                    {optionalAddOns
                      .filter(a => selectedOptional.includes(a.id))
                      .map(a => (
                        <div className="row" key={a.id}>
                          <span>{a.name}</span>
                          <span className="v">COP {precio(a.price)}</span>
                        </div>
                      ))}
                    <div className="row">
                      <span>{t('boleteria.quantity')}</span>
                      <span className="v">×{cantidad}</span>
                    </div>
                    <div className="total">
                      <span>{t('boleteria.total')}</span>
                      <span className="v">COP {precio(total)}</span>
                    </div>
                    <button
                      className={`btn btn-neon cart-pay-cta${detalles ? ' ready' : ''}`}
                      style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}
                      onClick={handleAgregar}
                      disabled={!detalles}
                    >
                      {t('boleteria.addToCart')} <span className="arr">→</span>
                    </button>
                    <p className="qs-hint" style={{ textAlign: 'center', marginTop: 12 }}>
                      {t('boleteria.cartHint')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTAS (colapsables) ── */}
            <details className="bol-notes" style={{ marginTop: 24 }}>
              <summary><span className="eyebrow">{t('boleteria.notesTitle')}</span></summary>
              <ul className="lp-list">
                {NOTE_KEYS.map((k) => (
                  <li key={k}><span className="lp-list-dot">→</span>{t(`boleteria.notes.${k}`)}</li>
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
                <p className="desc">{t('landing.footer.desc')}</p>
              </div>
              <div className="foot-col">
                <h4>{t('landing.footer.tour')}</h4>
                {allEditions.map(e => (
                  <a key={e.id} href={`/boleteria?ed=${e.slug}`}>{e.city ?? e.country} {e.year}</a>
                ))}
              </div>
              <div className="foot-col">
                <h4>{t('landing.footer.event')}</h4>
                <a href="/#speakers">{t('landing.footer.speakers')}</a>
                <a href="/#agenda">{t('landing.footer.agenda')}</a>
                <a href="#entradas-grid">{t('landing.footer.tickets')}</a>
              </div>
              <div className="foot-col">
                <h4>{t('landing.footer.contact')}</h4>
                <a href="mailto:cnmpcolombia@gmail.com">cnmpcolombia@gmail.com</a>
                <a href="https://cnmpcolombia.com">cnmpcolombia.com</a>
              </div>
            </div>
            <div className="foot-bottom">
              <span>{t('landing.footer.rights', { year: new Date().getFullYear() })}</span>
              <span className="mono">{allEditions.length} {allEditions.length === 1 ? t('landing.footer.city') : t('landing.footer.cities')} · {new Set(allEditions.map(e => e.country)).size} {new Set(allEditions.map(e => e.country)).size === 1 ? t('landing.footer.countrySingular') : t('landing.footer.countryPlural')} · {t('landing.footer.community')}</span>
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
