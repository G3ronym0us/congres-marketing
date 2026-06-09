'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatoPrecio, PRECIO_MEMORIAS } from '@/data/ticketsData';
import { WHATSAPP_URL } from '@/data/contactData';
import { useLocalidades } from '@/hooks/useLocalidades';
import { TicketType } from '@/types/tickets';
import '../landing.css';

const FEATURED = TicketType.DIAMOND;

const NOTES = [
  'Ninguna de las localidades incluye hospedaje, desayunos, almuerzos ni transportes.',
  'Los refrigerios están incluidos en todas las localidades presenciales (uno por jornada).',
  'Las memorias están incluidas en la Localidad Diamante. El resto de asistentes puede adquirirlas por separado.',
  'No se pueden adquirir entradas por jornadas independientes. Las entradas aplican para el evento completo.',
  'El streaming no incluye memorias del evento.',
  'Cupos limitados por localidad. Precios sujetos a cambio según disponibilidad.',
];

export default function BoleteriaPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { localidades } = useLocalidades();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (type: string) =>
    router.push(`/quantity-select?localidad=${type}`);

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

      <main className="page" style={{ paddingTop: 100 }}>

        {/* ── HEADER ── */}
        <section className="wrap" style={{ paddingBottom: 0 }}>
          <div style={{ maxWidth: 720, marginBottom: 56 }}>
            <span className="eyebrow">Colombia · 28–29 Ago 2026</span>
            <h1 className="h-sec" style={{ marginTop: 16, fontSize: 'clamp(40px,6vw,72px)' }}>
              Elige tu lugar<br />
              <span style={{ color: 'var(--neon)' }}>en el congreso.</span>
            </h1>
            <p className="lead">
              Cupos limitados por localidad. Boletería independiente por ciudad —
              esta página corresponde a la parada de <strong style={{ color: '#fff' }}>Colombia 2026</strong>.
            </p>
          </div>
        </section>

        {/* ── TICKET GRID ── */}
        <section id="entradas-grid" className="band" style={{ paddingTop: 0 }}>
          <div className="wrap">

            <div className="bol-grid">
              {Object.entries(localidades)
                .filter(([, t]) => t.pushable)
                .map(([type, t]) => {
                const isFeat = type === FEATURED;
                return (
                  <article key={type} className={`bol-card${isFeat ? ' bol-feat' : ''}`}>
                    {isFeat && <span className="tk-feat-tag">Más completo</span>}

                    <div className="bol-card-top">
                      <span className="bol-icon">{t.icon}</span>
                      <div>
                        <div className="bol-tier">{t.name}</div>
                        {type === TicketType.STREAMING && (
                          <div className="bol-sub">Acceso virtual</div>
                        )}
                      </div>
                    </div>

                    <div className="bol-price">
                      <span className="bol-cur">COP </span>
                      {formatoPrecio(t.price).replace('COP', '').replace('$', '').trim()}
                    </div>

                    <ul className="tk-list">
                      {t.features.map((f, i) => <li key={i}>{f}</li>)}
                      {t.withMemories && (
                        <li style={{ color: 'var(--neon)' }}>Memorias del evento incluidas</li>
                      )}
                    </ul>

                    <button
                      className={`btn ${isFeat ? 'btn-neon' : 'btn-ghost'}`}
                      style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                      onClick={() => go(type)}
                    >
                      Comprar entrada <span className="arr">→</span>
                    </button>
                  </article>
                );
              })}
            </div>

            {/* ── MEMORIAS ADD-ON ── */}
            <div className="bol-addon">
              <div className="bol-addon-left">
                <span className="eyebrow">Add-on opcional</span>
                <h3 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 'clamp(20px,3vw,28px)', marginTop: 10 }}>
                  📀 Memorias del evento
                </h3>
                <p style={{ color: 'var(--mute)', marginTop: 10, fontSize: 15, maxWidth: '52ch' }}>
                  Grabación completa de todas las conferencias, presentaciones de los speakers
                  y material exclusivo del congreso. Acceso digital permanente.
                  Disponible para todas las localidades <em>excepto</em> Diamante (ya incluido).
                </p>
              </div>
              <div className="bol-addon-right">
                <div className="bol-addon-price">
                  <span style={{ color: 'var(--mute)', fontSize: 14, fontFamily: 'var(--display)' }}>COP</span>
                  <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 'clamp(30px,4vw,42px)' }}>
                    {formatoPrecio(PRECIO_MEMORIAS).replace('COP', '').replace('$', '').trim()}
                  </span>
                </div>
                <p style={{ color: 'var(--mute-2)', fontSize: 12, fontFamily: 'var(--display)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 4 }}>
                  Se añade al momento de la compra
                </p>
              </div>
            </div>

            {/* ── NOTAS ── */}
            <div className="bol-notes">
              <span className="eyebrow" style={{ marginBottom: 20, display: 'block' }}>Notas importantes</span>
              <ul className="lp-list">
                {NOTES.map((n, i) => (
                  <li key={i}><span className="lp-list-dot">→</span>{n}</li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* ── CTA ── */}
        <section className="band" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band">
              <h2>Si tú no estás,<br />tu competencia sí lo estará.</h2>
              <p>Asegura tu lugar antes de que se agoten los cupos. Cada localidad tiene disponibilidad limitada.</p>
              <div className="btns">
                <button className="btn btn-neon" onClick={() => go(FEATURED)}>
                  Comprar entrada Diamante <span className="arr">→</span>
                </button>
                <a className="btn btn-ghost" href="mailto:cnmpcolombia@gmail.com">
                  Portafolio de patrocinio
                </a>
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
