'use client';

import { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getInternationalWithTitle, getNationalWithTitle } from '@/services/user';
import { getActiveTestimonials } from '@/services/testimonials';
import { getPublicEditions } from '@/services/editions';
import { Edition } from '@/types/edition';
import { Lecturer } from '@/types/lecturer';
import { Testimonial } from '@/types/testimonials';
import { formatoPrecio } from '@/data/ticketsData';
import { WHATSAPP_URL } from '@/data/contactData';
import { useLocalidades } from '@/hooks/useLocalidades';
import './landing.css';

interface CityView {
  slug: string; leg: string; city: string; country: string; flag: string;
  venue: string; dateShort: string; dateLong: string; year: string;
  iso: string; status: string; statusType: string;
  stat: { a: string; b: string; c: string; d: string };
  speakers: { confirmed: boolean; role: string }[];
  days: { label: string; rows: { t: string; title: string; d: string; tag: string }[] }[];
}

// Construye la vista de la landing a partir de una edición del backend (todo dinámico,
// sin datos quemados: los campos de presentación viven en edition.display).
const toCityView = (e: Edition): CityView => {
  const d = e.display ?? {};
  return {
    slug: e.slug,
    leg: d.leg ?? '',
    city: e.city || e.country,
    country: e.country,
    flag: d.flag ?? '',
    venue: e.venue ?? '',
    dateShort: d.dateShort ?? '',
    dateLong: d.dateLong ?? '',
    year: String(e.year),
    iso: d.iso ?? e.eventStartDate ?? '',
    status: d.status ?? '',
    statusType: d.statusType ?? 'soon',
    stat: d.stat ?? { a: '', b: '', c: '', d: '' },
    speakers: d.speakers ?? [],
    days: d.days ?? [],
  };
};

const EMPTY_VIEW: CityView = {
  slug: '', leg: '', city: '', country: '', flag: '', venue: '',
  dateShort: '', dateLong: '', year: '', iso: '', status: '', statusType: 'soon',
  stat: { a: '', b: '', c: '', d: '' }, speakers: [], days: [],
};

const AUDIENCE = [
  { ix: '01', text: 'Eres candidato a una elección y necesitas una narrativa ganadora.' },
  { ix: '02', text: 'Eres consultor, estratega o jefe de campaña y quieres estar al nivel de los grandes.' },
  { ix: '03', text: 'Eres comunicador político, periodista o asesor de gobierno buscando dominar la persuasión.' },
  { ix: '04', text: 'Eres estudiante de ciencias políticas, comunicación o marketing y quieres conectar con el mundo real.' },
  { ix: '05', text: 'Eres parte de un equipo de gobierno y quieres comunicar bien lo que haces.' },
  { ix: '06', text: 'O simplemente no le tienes miedo al poder, sino a no saber usarlo.' },
];

export default function LandingPage() {
  const router = useRouter();

  const [activeSlug, setActiveSlug] = useState<string>('');
  const [activeDay, setActiveDay] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [swapOut, setSwapOut] = useState(false);
  const [cd, setCd] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  // Ediciones visibles (ordenadas) — fuente única de la landing
  const [editions, setEditions] = useState<Edition[]>([]);
  // Estados de carga para mostrar skeletons mientras llegan los datos
  const [editionsLoading, setEditionsLoading] = useState(true);
  const [lecturersLoading, setLecturersLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  const activeEdition =
    editions.find(e => e.slug === activeSlug) ?? editions[0] ?? null;
  const { localidades, loading: localidadesLoading } = useLocalidades(activeEdition?.id);

  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);

  // Vistas derivadas de las ediciones (nada hardcodeado)
  const cityViews = editions.map(toCityView);
  const city = activeEdition ? toCityView(activeEdition) : EMPTY_VIEW;
  const ventasAbiertas = !!activeEdition?.salesOpen;
  // Localidad destacada: la de mayor precio entre las comprables (dinámico)
  const featuredSlug = Object.entries(localidades)
    .filter(([key, t]) => key !== 'memorias' && t.pushable)
    .sort((a, b) => b[1].price - a[1].price)[0]?.[0];
  // Add-ons opcionales de la edición (distintos), derivados de las localidades
  const optionalAddOns = Array.from(
    new Map(
      Object.values(localidades)
        .flatMap(l => l.addOns ?? [])
        .filter(a => !a.included)
        .map(a => [a.id, a]),
    ).values(),
  );
  const sw = swapOut ? 'swap out' : 'swap';
  const year = new Date().getFullYear();
  // Rango de años de la gira, derivado de las ediciones (sin hardcodear)
  const giraYears = editions.map(e => e.year);
  const yearRange = giraYears.length
    ? Math.min(...giraYears) === Math.max(...giraYears)
      ? `${Math.min(...giraYears)}`
      : `${Math.min(...giraYears)} — ${Math.max(...giraYears)}`
    : '';

  const startCountdown = useCallback((iso: string) => {
    if (cdRef.current) clearInterval(cdRef.current);
    const target = new Date(iso).getTime();
    const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setCd({ d: '00', h: '00', m: '00', s: '00' }); return; }
      setCd({
        d: pad(Math.floor(diff / 864e5)),
        h: pad(Math.floor((diff / 36e5) % 24)),
        m: pad(Math.floor((diff / 6e4) % 60)),
        s: pad(Math.floor((diff / 1e3) % 60)),
      });
    };
    tick();
    cdRef.current = setInterval(tick, 1000);
  }, []);

  // Nav scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Countdown (usa la fecha real de la edición activa)
  useEffect(() => {
    if (city.iso) startCountdown(city.iso);
    return () => { if (cdRef.current) clearInterval(cdRef.current); };
  }, [activeSlug, city.iso, startCountdown]);

  // Menu body overflow
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Cargar ediciones públicas (fuente única de la landing)
  useEffect(() => {
    getPublicEditions()
      .then(list => {
        setEditions(list);
        setActiveSlug(prev =>
          prev || (list.find(e => e.salesOpen) ?? list[0])?.slug || '',
        );
      })
      .catch(console.error)
      .finally(() => setEditionsLoading(false));
  }, []);

  // Testimonios (globales)
  useEffect(() => {
    getActiveTestimonials()
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setTestimonialsLoading(false));
  }, []);

  // Conferencistas de la edición activa (se recargan al cambiar de ciudad)
  useEffect(() => {
    const editionId = activeEdition?.id;
    setLecturersLoading(true);
    Promise.all([
      getInternationalWithTitle(editionId),
      getNationalWithTitle(editionId),
    ]).then(([intl, natl]) => {
      setLecturers([...intl, ...natl].filter(l => l.show));
    }).catch(console.error)
      .finally(() => setLecturersLoading(false));
  }, [activeEdition?.id]);

  // Reveal observer — runs after every render to pick up newly mounted elements
  useEffect(() => {
    if (!ioRef.current) {
      ioRef.current = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('in');
            ioRef.current?.unobserve(e.target);
          }
        });
      }, { threshold: 0.14 });
    }
    const io = ioRef.current;
    document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
  });

  // Route line fill
  useEffect(() => {
    const fill = document.getElementById('route-fill');
    const tour = document.getElementById('tour');
    if (!fill || !tour) return;
    const ob = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { fill.style.width = '50%'; ob.disconnect(); } });
    }, { threshold: 0.3 });
    ob.observe(tour);
    return () => ob.disconnect();
  }, []);

  const switchCity = (slug: string) => {
    if (slug === activeSlug) return;
    setSwapOut(true);
    setTimeout(() => {
      setActiveSlug(slug);
      setActiveDay(0);
      setSwapOut(false);
    }, 320);
  };

  const closeMenu = () => setMenuOpen(false);

  // Aviso amigable cuando se intenta comprar en una edición sin ventas activas
  const [soon, setSoon] = useState(false);
  const soonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerSoon = (el?: HTMLElement | null) => {
    setSoon(true);
    // Re-dispara la animación de "shake" en el botón pulsado
    if (el) {
      el.classList.remove('shake');
      void el.offsetWidth;
      el.classList.add('shake');
    }
    if (soonTimerRef.current) clearTimeout(soonTimerRef.current);
    soonTimerRef.current = setTimeout(() => setSoon(false), 4200);
  };

  useEffect(() => () => {
    if (soonTimerRef.current) clearTimeout(soonTimerRef.current);
  }, []);

  // Todos los CTA de compra van directo a la boletería; si la edición activa
  // aún no tiene ventas abiertas, se evita navegar y se muestra el aviso.
  const handleBuyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (ventasAbiertas) return;
    e.preventDefault();
    triggerSoon(e.currentTarget);
  };

  const renderBuyCTA = (label: string, onClickExtra?: () => void) => (
    <a
      className={`btn btn-neon${ventasAbiertas ? '' : ' btn-soon'}`}
      href={`/boleteria?ed=${activeSlug}`}
      onClick={(e) => {
        handleBuyClick(e);
        onClickExtra?.();
      }}
    >
      {ventasAbiertas ? label : 'Próximamente'}{' '}
      <span className="arr">{ventasAbiertas ? '→' : '✦'}</span>
    </a>
  );

  const delayClass = (i: number) => ['', ' d1', ' d2', ' d3'][i % 4];

  return (
    <div className={`cnmp-root${menuOpen ? ' menu-open' : ''}`}>
      <div className="bg-field" />

      {/* NAVBAR */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#top"><img className="logo" src="/logo-principal.png" alt="CNMP 2026" /></a>
        <div className="nav-links">
          <a href="#tour">La Gira</a>
          <a href="#speakers">Speakers</a>
          <a href="#agenda">Agenda</a>
          <a href="#entradas">Entradas</a>
          <a href="#contacto">Contacto</a>
          {renderBuyCTA('Inscríbete')}
        </div>
        <button className="nav-burger" onClick={() => setMenuOpen(v => !v)} aria-label="Menú" aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mmenu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <a href="#tour" onClick={closeMenu}>La Gira</a>
        <a href="#speakers" onClick={closeMenu}>Speakers</a>
        <a href="#agenda" onClick={closeMenu}>Agenda</a>
        <a href="#entradas" onClick={closeMenu}>Entradas</a>
        <a href="#contacto" onClick={closeMenu}>Contacto</a>
        {renderBuyCTA('Inscríbete', closeMenu)}
      </div>
      <div className={`mmenu-scrim${menuOpen ? ' open' : ''}`} onClick={closeMenu} />

      <main className="page" id="top">

        {/* HERO */}
        <section className="hero wrap">
          <div className="hero-grid">
            <div className="hero-left">
              <span className="hero-status">
                <span className="pulse" />
                {editionsLoading
                  ? <span className="sk-line" style={{ width: 150, height: 12 }} />
                  : <span className={sw}>{city.status}</span>}
              </span>

              <h1>
                <span className="ln">Donde nacen</span>
                <span className="ln accent">las campañas</span>
                <span className="ln outline">que ganan.</span>
              </h1>

              {editionsLoading ? (
                <div className="hero-sub" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="sk-line" style={{ width: '95%', height: 15 }} />
                  <span className="sk-line" style={{ width: '78%', height: 15 }} />
                </div>
              ) : (
                <p className={`hero-sub ${sw}`}>
                  El Congreso Nacional de Marketing Político aterriza en {city.city}. {city.dateLong}. Estrategia, narrativa e inteligencia para quienes hacen política en serio.
                </p>
              )}

              {/* CITY SELECTOR */}
              <div className="city-tabs" role="tablist" aria-label="Selecciona ciudad">
                {editionsLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="city-tab" aria-hidden="true" style={{ pointerEvents: 'none' }}>
                        <span className="ct-dot" />
                        <div className="ct-idx"><span className="sk-line" style={{ width: 46, height: 11 }} /></div>
                        <div className="ct-name"><span className="sk-line" style={{ width: 82, height: 16, marginTop: 6 }} /></div>
                        <div className="ct-date"><span className="sk-line" style={{ width: 60, height: 11, marginTop: 6 }} /></div>
                      </div>
                    ))
                  : cityViews.map((c, i) => (
                  <button key={c.slug} className={`city-tab${activeSlug === c.slug ? ' active' : ''}`}
                    data-city={c.slug} role="tab" onClick={() => switchCity(c.slug)}>
                    <span className="ct-dot" />
                    <div className="ct-idx">{String(i + 1).padStart(2, '0')} · {c.flag}</div>
                    <div className="ct-name">{c.city}</div>
                    <div className="ct-date">{c.dateShort}</div>
                  </button>
                ))}
              </div>

              <div className="hero-cta">
                {renderBuyCTA('Comprar entrada')}
                <a className="btn btn-ghost" href="#tour">Ver la gira</a>
              </div>

              <div className="hero-meta">
                <div className="item">
                  <span className="k">Sede actual</span>
                  <span className={`v ${sw}`}>
                    {editionsLoading ? <span className="sk-line" style={{ width: 70, height: 14 }} /> : city.city}
                  </span>
                </div>
                <div className="item">
                  <span className="k">Fecha</span>
                  <span className={`v ${sw}`}>
                    {editionsLoading ? <span className="sk-line" style={{ width: 110, height: 14 }} /> : city.dateLong}
                  </span>
                </div>
                <div className="item">
                  <span className="k">País</span>
                  <span className={`v ${sw}`}>
                    {editionsLoading ? <span className="sk-line" style={{ width: 64, height: 14 }} /> : city.country}
                  </span>
                </div>
              </div>
            </div>

            {/* COUNTDOWN CARD */}
            <aside className="hero-right">
              <div className="cd-card">
                <div className="cd-top">
                  <span className={`cd-city ${sw}`}>
                    {editionsLoading ? <span className="sk-line" style={{ width: 84, height: 16 }} /> : city.city}
                  </span>
                  <span className={`cd-code ${sw}`}>{editionsLoading ? '' : city.flag}</span>
                </div>
                <div className="cd-label">Faltan</div>
                <div className="cd-grid">
                  {['Días', 'Horas', 'Min', 'Seg'].map((unit, i) => (
                    <div key={unit} className="cd-cell">
                      <div className="num">
                        {editionsLoading
                          ? <span className="sk-line" style={{ width: 34, height: 30, margin: '0 auto' }} />
                          : [cd.d, cd.h, cd.m, cd.s][i]}
                      </div>
                      <div className="unit">{unit}</div>
                    </div>
                  ))}
                </div>
                <div className="cd-foot">
                  <span className={`venue ${sw}`}>
                    {editionsLoading
                      ? <span className="sk-line" style={{ width: 120, height: 12 }} />
                      : <>{city.dateShort} · <strong>{city.country}</strong></>}
                  </span>
                  <span className="cd-live mono">EN VIVO PRONTO</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {/* lista duplicada: el loop infinito del CSS necesita dos copias */}
            {[0, 1].map(copy => (
              <Fragment key={copy}>
                {cityViews.map(c => (
                  <span key={c.slug} className="it"><span className="star">✦</span> {c.city} · {c.dateShort}</span>
                ))}
                <span className="it"><span className="star">✦</span> 3 Ciudades · 3 Países · 1 Comunidad</span>
              </Fragment>
            ))}
          </div>
        </div>

        {/* TOUR / 3 CITIES */}
        <section className="tour band" id="tour">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">La Gira {yearRange}</span>
              <h2 className="h-sec">Un mismo congreso,<br />tres capitales del poder.</h2>
              <p className="lead">Por primera vez, el CNMP se convierte en una gira internacional. Tres paradas, tres países, una sola comunidad que está redefiniendo cómo se hace política en la región.</p>
            </div>

            <div className="route">
              <div className="route-line"><div className="fill" id="route-fill" /></div>
              <div className="route-stops">
                {editionsLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="stop">
                        <div className="node" />
                        <div className="stop-card">
                          <div className="leg"><span className="sk-line" style={{ width: 64, height: 11 }} /></div>
                          <div className="code"><span className="sk-line" style={{ width: 42, height: 22, marginTop: 6 }} /></div>
                          <div className="city"><span className="sk-line" style={{ width: 96, height: 18, marginTop: 8 }} /></div>
                          <div className="country"><span className="sk-line" style={{ width: 72, height: 12, marginTop: 6 }} /></div>
                          <div className="when"><span className="sk-line" style={{ width: 120, height: 12, marginTop: 8 }} /></div>
                          <span className="sk-line" style={{ width: 76, height: 20, marginTop: 12, borderRadius: 100 }} />
                        </div>
                      </div>
                    ))
                  : cityViews.map((c, i) => {
                  return (
                    <div key={c.slug} className={`stop${c.statusType === 'next' ? ' is-next' : ''} reveal${delayClass(i)}`}>
                      <div className="node" />
                      <div className="stop-card">
                        <div className="leg">{c.leg}</div>
                        <div className="code">{c.flag}</div>
                        <div className="city">{c.city}</div>
                        <div className="country">{c.country}</div>
                        <div className="when">{c.dateLong}</div>
                        <span className={`badge ${c.statusType}`}>{c.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="stats" style={{ marginTop: 64 }}>
              <div className="stat reveal">
                <div className="n">
                  {editionsLoading
                    ? <span className="sk-line" style={{ width: 72, height: 38 }} />
                    : <><span className={sw}>{city.stat.a}</span><span className="suf">+</span></>}
                </div>
                <div className="l">Asistentes esperados</div>
              </div>
              <div className="stat reveal d1">
                <div className="n">
                  {editionsLoading
                    ? <span className="sk-line" style={{ width: 56, height: 38 }} />
                    : <span className={sw}>{city.stat.b}</span>}
                </div>
                <div className="l">Conferencistas</div>
              </div>
              <div className="stat reveal d2">
                <div className="n">
                  {editionsLoading
                    ? <span className="sk-line" style={{ width: 56, height: 38 }} />
                    : <span className={sw}>{city.stat.c}</span>}
                </div>
                <div className="l">Días de contenido</div>
              </div>
              <div className="stat reveal d3">
                <div className="n">
                  {editionsLoading
                    ? <span className="sk-line" style={{ width: 56, height: 38 }} />
                    : <span className={sw}>{city.stat.d}</span>}
                </div>
                <div className="l">Países representados</div>
              </div>
            </div>
          </div>
        </section>

        {/* SPEAKERS */}
        <section className="band alt" id="speakers">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Conferencistas</span>
              <h2 className="h-sec">Las mentes detrás<br />de las campañas que importan.</h2>
              <p className="lead">Estrategas, consultores y analistas de toda la región. Algunos ya confirmados, otros que revelaremos en las próximas semanas.</p>
            </div>
            <div className="spk-grid">
              {lecturersLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <article key={`sk-${i}`} className="spk">
                      <div className="spk-photo">
                        <span className="sk-line" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
                      </div>
                      <div className="spk-body">
                        <div className="nm"><span className="sk-line" style={{ width: '70%', height: 16 }} /></div>
                        <div className="rl"><span className="sk-line" style={{ width: '45%', height: 12, marginTop: 8 }} /></div>
                      </div>
                    </article>
                  ))
                : lecturers.length === 0
                ? Array.from({ length: 8 }).map((_, i) => (
                    <article key={i} className="spk reveal">
                      <div className="spk-photo">
                        <span className="badge-st tba">Por anunciar</span>
                        <span className="ph-tag">speaker</span>
                      </div>
                      <div className="spk-body">
                        <div className="nm">Por anunciar</div>
                        <div className="rl">Próximamente</div>
                      </div>
                    </article>
                  ))
                : lecturers.map((l) => (
                    <article key={l.id} className="spk reveal"
                      style={{ cursor: 'pointer' }}
                      onClick={() => router.push(`/lecturer/${l.alt}`)}>
                      <div className="spk-photo">
                        <span className={`badge-st ${l.type === 'INTERNATIONAL' ? 'ok' : 'tba'}`}>
                          {l.type === 'INTERNATIONAL' ? 'Internacional' : 'Nacional'}
                        </span>
                        {l.image
                          ? <img className="spk-photo-img" src={l.image} alt={`${l.firstName} ${l.lastName ?? ''}`} />
                          : <span className="ph-tag">{l.country}</span>
                        }
                      </div>
                      <div className="spk-body">
                        <div className="nm">{l.firstName} {l.lastName}</div>
                        <div className="rl">{l.title || l.position || l.country}</div>
                        {l.socialMedia && (
                          <div className="spk-social">
                            {l.socialMedia.instagram && (
                              <a href={l.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()} aria-label="Instagram">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                              </a>
                            )}
                            {l.socialMedia.x && (
                              <a href={l.socialMedia.x} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()} aria-label="X / Twitter">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                              </a>
                            )}
                            {l.socialMedia.facebook && (
                              <a href={l.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()} aria-label="Facebook">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                              </a>
                            )}
                            {l.socialMedia.youtube && (
                              <a href={l.socialMedia.youtube} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()} aria-label="YouTube">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  ))
              }
            </div>
          </div>
        </section>

        {/* AGENDA */}
        <section className="band" id="agenda">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Cronograma</span>
              <h2 className="h-sec">Dos días, agenda<br />de alto rendimiento.</h2>
            </div>
            <div className={sw}>
              {editionsLoading ? (
                <>
                  <div className="sch-days">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <span key={i} className="sk-line" style={{ width: 130, height: 40, borderRadius: 100 }} />
                    ))}
                  </div>
                  <div className="sch-list">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="sch-row">
                        <div className="time"><span className="sk-line" style={{ width: 58, height: 13 }} /></div>
                        <div>
                          <div className="ttl"><span className="sk-line" style={{ width: '55%', height: 15 }} /></div>
                          <div className="dsc"><span className="sk-line" style={{ width: '35%', height: 12, marginTop: 6 }} /></div>
                        </div>
                        <div className="tag"><span className="sk-line" style={{ width: 52, height: 18 }} /></div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="sch-days">
                    {city.days.map((d, i) => (
                      <button key={i} className={`day-btn${activeDay === i ? ' active' : ''}`}
                        onClick={() => setActiveDay(i)}>{d.label}</button>
                    ))}
                  </div>
                  <div className="sch-list">
                    {city.days[activeDay]?.rows.map((r, i) => (
                      <div key={i} className="sch-row">
                        <div className="time">{r.t}</div>
                        <div>
                          <div className="ttl">{r.title}</div>
                          {r.d && <div className="dsc">{r.d}</div>}
                        </div>
                        <div className="tag">{r.tag}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="band alt" id="dirigido">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">¿Para quién es?</span>
              <h2 className="h-sec">Solo para quienes<br />juegan para ganar.</h2>
              <p className="lead">Este congreso no es para curiosos ni espectadores. Es para quienes saben que la política cambió — y quieren cambiar con ella.</p>
            </div>
            <div className="aud-grid">
              {AUDIENCE.map((a, i) => (
                <div key={i} className={`aud reveal${delayClass(i)}`}>
                  <span className="ix">{a.ix}</span>
                  <p>{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TICKETS */}
        <section className="band" id="entradas">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Entradas</span>
              <h2 className="h-sec">Elige tu lugar<br />en el congreso.</h2>
              <p className={`tk-note ${sw}`}>
                <span className="chip">Entradas independientes</span>
                Precios para <strong style={{ color: '#fff', fontWeight: 600 }}>{city.city}</strong>
                , en pesos colombianos (COP). Cada ciudad tiene su propia boletería.
              </p>
            </div>

            {ventasAbiertas ? (
              <div className={`tk-grid ${sw}`}>
                {localidadesLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <article key={i} className="tk" aria-hidden="true">
                        <span className="sk-line" style={{ width: '50%', height: 16 }} />
                        <span className="sk-line" style={{ width: '75%', height: 34, marginTop: 14 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, margin: '20px 0 24px' }}>
                          <span className="sk-line" style={{ width: '100%', height: 13 }} />
                          <span className="sk-line" style={{ width: '90%', height: 13 }} />
                          <span className="sk-line" style={{ width: '95%', height: 13 }} />
                        </div>
                        <span className="sk-line" style={{ width: '100%', height: 46, borderRadius: 100, marginTop: 'auto' }} />
                      </article>
                    ))
                  : Object.entries(localidades)
                  .filter(([, t]) => t.pushable)
                  .map(([type, t]) => {
                  const isFeat = type === featuredSlug;
                  return (
                    <article key={type} className={`tk${isFeat ? ' feat' : ''} reveal`}>
                      {isFeat && <span className="tk-feat-tag">Más vendido</span>}
                      <div className="tk-tier">{t.name}</div>
                      <div className="tk-price">
                        <span className="cur">COP </span>
                        {formatoPrecio(t.price).replace('COP', '').replace('$', '').trim()}
                      </div>
                      <ul className="tk-list">
                        {t.features.map((f, j) => <li key={j}>{f}</li>)}
                        {t.withMemories && <li style={{ color: 'var(--neon)' }}>Memorias del evento incluidas</li>}
                      </ul>
                      <a className={`btn ${isFeat ? 'btn-neon' : 'btn-ghost'}`} href={`/boleteria?ed=${activeSlug}&localidad=${type}`}>
                        Comprar <span className="arr">→</span>
                      </a>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className={`tk-soon ${sw}`}>
                <span className="eyebrow">Boletería próximamente</span>
                <p style={{ color: 'var(--mute)', marginTop: 12, fontSize: 15 }}>
                  Las entradas para <strong style={{ color: '#fff' }}>{city.city}</strong> estarán disponibles pronto.
                  Puedes registrar tu interés escribiéndonos.
                </p>
                <a className="btn btn-ghost" href="mailto:cnmpcolombia@gmail.com" style={{ marginTop: 20, display: 'inline-flex' }}>
                  Registrar interés <span className="arr">→</span>
                </a>
              </div>
            )}

            {ventasAbiertas && optionalAddOns.length > 0 && (
              <p style={{ color: 'var(--mute)', fontSize: 13, marginTop: 16, textAlign: 'center' }}>
                Add-ons opcionales:{' '}
                {optionalAddOns.map((a, i) => (
                  <Fragment key={a.id}>
                    {i > 0 && ' · '}
                    <strong style={{ color: '#fff' }}>{a.name}</strong>{' '}
                    (COP {formatoPrecio(a.price).replace('COP', '').replace('$', '').trim()})
                  </Fragment>
                ))}
                {' '}· disponibles al momento de la compra.
              </p>
            )}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="band alt" id="testimonios">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Testimonios</span>
              <h2 className="h-sec">Lo que dicen quienes<br />ya vivieron el CNMP.</h2>
            </div>
            <div className="tst-grid">
              {testimonialsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={`sk-${i}`} className="tst">
                      <span className="sk-line" style={{ width: '100%', height: 14 }} />
                      <span className="sk-line" style={{ width: '92%', height: 14, marginTop: 8 }} />
                      <span className="sk-line" style={{ width: '70%', height: 14, marginTop: 8 }} />
                      <div className="who" style={{ marginTop: 18 }}>
                        <div className="av" />
                        <div>
                          <div className="nm"><span className="sk-line" style={{ width: 90, height: 13 }} /></div>
                          <div className="rl"><span className="sk-line" style={{ width: 130, height: 11, marginTop: 6 }} /></div>
                        </div>
                      </div>
                    </div>
                  ))
                : (testimonials.length > 0 ? testimonials : [
                { id: -1, firstName: 'Asistente', lastName: 'verificado', position: 'Consultor político · Edición anterior', content: 'El nivel de los ponentes y la calidad del networking no se compara con ningún otro evento político de la región.', image: null, active: true, createdAt: '', updatedAt: '' },
                { id: -2, firstName: 'Asistente', lastName: 'verificado', position: 'Jefe de campaña · Edición anterior', content: 'Salí con una estrategia completa para mi campaña. Cada panel fue directo al grano, sin relleno.', image: null, active: true, createdAt: '', updatedAt: '' },
                { id: -3, firstName: 'Asistente', lastName: 'verificado', position: 'Estratega digital · Edición anterior', content: 'Conocí a las personas correctas. El CNMP es donde se construyen las alianzas que deciden elecciones.', image: null, active: true, createdAt: '', updatedAt: '' },
              ] as Testimonial[]).map((t, i) => (
                <div key={t.id} className={`tst reveal${delayClass(i)}`}>
                  <p className="quote">{t.content}</p>
                  <div className="who">
                    {t.image
                      ? <img className="av" src={t.image} alt={`${t.firstName} ${t.lastName}`} style={{ objectFit: 'cover' }} />
                      : <div className="av" />
                    }
                    <div>
                      <div className="nm">{t.firstName} {t.lastName}</div>
                      <div className="rl">{t.position}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ALIADOS */}
        <section className="band" id="aliados">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Aliados estratégicos</span>
              <h2 className="h-sec">Aliarse con el poder<br />transforma tu marca.</h2>
              <p className="lead">Conecta con una comunidad de +500 líderes del mundo electoral, un ecosistema de decisión política en LATAM y visibilidad ante millones en redes.</p>
            </div>
            <div className="ally-grid">
              <div className="ally reveal">
                <img src="https://congress-marketing.s3.us-east-2.amazonaws.com/aliados/ACEIPOL-BLANCO-Horizontal.png" alt="ACEIPOL" />
              </div>
              <div className="ally reveal d1">
                <img src="https://congress-marketing.s3.us-east-2.amazonaws.com/aliados/Canal-TRO-30a%C3%B1os-Blanco.png" alt="Canal TRO" />
              </div>
              <div className="ally reveal d2">
                <img src="https://congress-marketing.s3.us-east-2.amazonaws.com/aliados/Federaci%C3%B3n-Colombiana-de-Municipios.png" alt="Federación Colombiana de Municipios" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA / CONTACT */}
        <section className="band" id="contacto" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band reveal">
              <h2>Si tú no estás,<br />tu competencia sí lo estará.</h2>
              <p>Asegura tu lugar en la próxima parada de la gira. Cupos limitados por ciudad, boletería independiente.</p>
              <div className="btns">
                {renderBuyCTA('Inscríbete ahora')}
                <a className="btn btn-ghost" href="mailto:cnmpcolombia@gmail.com">Portafolio de patrocinio</a>
              </div>
            </div>
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
                {editions.map(e => (
                  <a key={e.slug} href={`/boleteria?ed=${e.slug}`}>
                    {e.city || e.country} {e.year}
                    {!e.salesOpen && <span className="soon-pill">Pronto</span>}
                  </a>
                ))}
              </div>
              <div className="foot-col">
                <h4>Evento</h4>
                <a href="#speakers">Conferencistas</a>
                <a href="#agenda">Agenda</a>
                <a href="#entradas">Entradas</a>
                <a href="#aliados">Aliados</a>
              </div>
              <div className="foot-col">
                <h4>Contacto</h4>
                <a href="mailto:cnmpcolombia@gmail.com">cnmpcolombia@gmail.com</a>
                <a href="https://cnmpcolombia.com">cnmpcolombia.com</a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
            </div>
            <div className="foot-bottom">
              <span>© {year} CNMP — Congreso Nacional de Marketing Político.</span>
              <span className="mono">{editions.length} {editions.length === 1 ? 'CIUDAD' : 'CIUDADES'} · {new Set(editions.map(e => e.country)).size} {new Set(editions.map(e => e.country)).size === 1 ? 'PAÍS' : 'PAÍSES'} · 1 COMUNIDAD</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Aviso amigable: boletería próximamente */}
      <div className={`soon-toast${soon ? ' show' : ''}`} role="status" aria-live="polite">
        <span className="soon-toast-ic">🎟️</span>
        <div className="soon-toast-tx">
          <strong>¡Muy pronto!</strong>
          <span>
            La boletería de {city.city || 'esta ciudad'} abre en poco. Te
            avisamos apenas esté lista.
          </span>
        </div>
        <a className="soon-toast-cta" href="mailto:cnmpcolombia@gmail.com">
          Avísenme
        </a>
      </div>

      {/* WhatsApp float */}
      <a className="wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.738-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
        </svg>
      </a>
    </div>
  );
}
