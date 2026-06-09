'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getLecturerByAlt } from '@/services/user';
import { Lecturer } from '@/types/lecturer';
import { WHATSAPP_URL } from '@/data/contactData';
import '../../landing.css';

/* ── small inline SVG icons ── */
const IconIG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);
const IconFB = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);
const IconYT = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function LecturerDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const slug = params?.alt as string;
    if (!slug) return;
    setLoading(true);
    getLecturerByAlt(slug)
      .then(setLecturer)
      .catch(() => setLecturer(null))
      .finally(() => setLoading(false));
  }, [params?.alt]);

  // Reveal animations
  useEffect(() => {
    if (!ioRef.current) {
      ioRef.current = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('in');
            ioRef.current?.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
    }
    const io = ioRef.current;
    document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
  });

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
          <a className="btn btn-neon" href="/#entradas">Inscríbete <span className="arr">→</span></a>
        </div>
      </nav>

      <main className="page" style={{ paddingTop: '80px' }}>

        {loading && (
          <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="pulse" style={{ width: 16, height: 16, margin: '0 auto 20px' }} />
              <p style={{ fontFamily: 'var(--display)', letterSpacing: '.2em', color: 'var(--mute)', fontSize: 13, textTransform: 'uppercase' }}>
                Cargando conferencista…
              </p>
            </div>
          </div>
        )}

        {!loading && !lecturer && (
          <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 64, color: 'var(--neon)', marginBottom: 16 }}>?</div>
              <h1 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 32, marginBottom: 12 }}>Conferencista no encontrado</h1>
              <p style={{ color: 'var(--mute)', marginBottom: 28 }}>No pudimos encontrar el perfil solicitado.</p>
              <button className="btn btn-ghost" onClick={() => router.push('/')}>← Volver al inicio</button>
            </div>
          </div>
        )}

        {!loading && lecturer && (
          <>
            {/* ── HERO ── */}
            <section className="lp-hero">
              <div className="wrap">
                <button className="lp-back btn btn-ghost" onClick={() => router.back()}>
                  ← Volver
                </button>

                <div className="lp-hero-grid">
                  {/* Left: info */}
                  <div className="lp-hero-info">
                    <span className={`badge-st ${lecturer.type === 'INTERNATIONAL' ? 'ok' : 'tba'}`} style={{ fontSize: 11, padding: '6px 14px', borderRadius: 100, marginBottom: 22, display: 'inline-block' }}>
                      {lecturer.type === 'INTERNATIONAL' ? 'Internacional' : 'Nacional'}
                    </span>

                    <h1 className="lp-name">
                      {lecturer.firstName}<br />
                      <span style={{ color: 'var(--neon)' }}>{lecturer.lastName}</span>
                    </h1>

                    {lecturer.nickname && (
                      <p className="lp-nickname">"{lecturer.nickname}"</p>
                    )}

                    <div className="lp-pills">
                      <span className="lp-pill">📍 {lecturer.country}</span>
                      {lecturer.position && <span className="lp-pill">{lecturer.position}</span>}
                    </div>

                    {/* Social links */}
                    {lecturer.socialMedia && (
                      <div className="lp-social-hero">
                        {lecturer.socialMedia.instagram && (
                          <a href={lecturer.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="lp-social-btn" aria-label="Instagram"><IconIG /></a>
                        )}
                        {lecturer.socialMedia.x && (
                          <a href={lecturer.socialMedia.x} target="_blank" rel="noopener noreferrer" className="lp-social-btn" aria-label="X"><IconX /></a>
                        )}
                        {lecturer.socialMedia.facebook && (
                          <a href={lecturer.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="lp-social-btn" aria-label="Facebook"><IconFB /></a>
                        )}
                        {lecturer.socialMedia.youtube && (
                          <a href={lecturer.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="lp-social-btn" aria-label="YouTube"><IconYT /></a>
                        )}
                      </div>
                    )}

                    <a className="btn btn-neon" href="/#entradas" style={{ marginTop: 28 }}>
                      Ver entradas <span className="arr">→</span>
                    </a>
                  </div>

                  {/* Right: photo */}
                  <div className="lp-hero-photo">
                    <div className="lp-photo-wrap">
                      <img
                        src={lecturer.image || '/logo-principal.png'}
                        alt={`${lecturer.firstName} ${lecturer.lastName ?? ''}`}
                        onError={e => { (e.target as HTMLImageElement).src = '/logo-principal.png'; }}
                      />
                      <div className="lp-photo-grad" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── CONTENT ── */}
            <section className="band" style={{ paddingTop: 64 }}>
              <div className="wrap">
                <div className="lp-content-grid">

                  {/* Sticky sidebar */}
                  <aside className="lp-sidebar">
                    <div className="lp-sidebar-card">
                      <img
                        src={lecturer.image || '/logo-principal.png'}
                        alt={`${lecturer.firstName} ${lecturer.lastName ?? ''}`}
                        className="lp-sidebar-img"
                        onError={e => { (e.target as HTMLImageElement).src = '/logo-principal.png'; }}
                      />
                      <div className="lp-sidebar-body">
                        <div className="lp-sidebar-name">{lecturer.firstName} {lecturer.lastName}</div>
                        <div className="lp-sidebar-country">{lecturer.country}</div>
                        {lecturer.socialMedia && (
                          <div className="spk-social" style={{ marginTop: 16 }}>
                            {lecturer.socialMedia.instagram && (
                              <a href={lecturer.socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconIG /></a>
                            )}
                            {lecturer.socialMedia.x && (
                              <a href={lecturer.socialMedia.x} target="_blank" rel="noopener noreferrer" aria-label="X"><IconX /></a>
                            )}
                            {lecturer.socialMedia.facebook && (
                              <a href={lecturer.socialMedia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFB /></a>
                            )}
                            {lecturer.socialMedia.youtube && (
                              <a href={lecturer.socialMedia.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IconYT /></a>
                            )}
                          </div>
                        )}
                        <a className="btn btn-neon" href="/#entradas" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
                          Comprar entrada <span className="arr">→</span>
                        </a>
                      </div>
                    </div>
                  </aside>

                  {/* Main content */}
                  <div className="lp-main">

                    {lecturer.title && (
                      <div className="lp-card reveal">
                        <span className="eyebrow">Su conferencia</span>
                        <h2 className="lp-card-title" style={{ marginTop: 14 }}>{lecturer.title}</h2>
                      </div>
                    )}

                    {lecturer.biography && (
                      <div className="lp-card reveal">
                        <span className="eyebrow">Biografía</span>
                        <div className="lp-bio">
                          {lecturer.biography.split('\n').filter(Boolean).map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {lecturer.experienceAreas && lecturer.experienceAreas.length > 0 && (
                      <div className="lp-card reveal">
                        <span className="eyebrow">Áreas de experiencia</span>
                        <div className="lp-tags">
                          {lecturer.experienceAreas.map((area, i) => (
                            <span key={i} className="lp-tag">{area}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {lecturer.createdMethodologies && lecturer.createdMethodologies.length > 0 && (
                      <div className="lp-card reveal">
                        <span className="eyebrow">Metodologías creadas</span>
                        <div className="lp-tags">
                          {lecturer.createdMethodologies.map((m, i) => (
                            <span key={i} className="lp-tag lp-tag-alt">{m}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {lecturer.awards && lecturer.awards.length > 0 && (
                      <div className="lp-card reveal">
                        <span className="eyebrow">Premios y reconocimientos</span>
                        <ul className="lp-list">
                          {lecturer.awards.map((a, i) => (
                            <li key={i}><span className="lp-list-dot">✦</span>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {lecturer.academicFormations && lecturer.academicFormations.length > 0 && (
                      <div className="lp-card reveal">
                        <span className="eyebrow">Formación académica</span>
                        <div className="lp-timeline">
                          {lecturer.academicFormations.map((f, i) => (
                            <div key={i} className="lp-tl-item">
                              <div className="lp-tl-dot" />
                              <div className="lp-tl-body">
                                <div className="lp-tl-title">{f.title}</div>
                                {f.institution && <div className="lp-tl-sub">{f.institution}</div>}
                                {(f.year || f.place) && (
                                  <div className="lp-tl-meta">
                                    {f.year && <span>{f.year}</span>}
                                    {f.place && <span>{f.place}</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {lecturer.publications && lecturer.publications.length > 0 && (
                      <div className="lp-card reveal">
                        <span className="eyebrow">Publicaciones</span>
                        <div className="lp-timeline">
                          {lecturer.publications.map((pub, i) => (
                            <div key={i} className="lp-tl-item">
                              <div className="lp-tl-dot" />
                              <div className="lp-tl-body">
                                <div className="lp-tl-title">{pub.title}</div>
                                {pub.editorial && <div className="lp-tl-sub">{pub.editorial}</div>}
                                {(pub.year || pub.role) && (
                                  <div className="lp-tl-meta">
                                    {pub.year && <span>{pub.year}</span>}
                                    {pub.role && <span>{pub.role}</span>}
                                  </div>
                                )}
                                {pub.description && <p className="lp-tl-desc">{pub.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="cta-band reveal" style={{ marginTop: 8 }}>
                      <h2>¿Quieres escuchar a {lecturer.firstName}?</h2>
                      <p>Asegura tu lugar en la próxima parada de la gira. Cupos limitados por ciudad.</p>
                      <div className="btns">
                        <a className="btn btn-neon" href="/#entradas">Inscríbete ahora <span className="arr">→</span></a>
                        <a className="btn btn-ghost" href="/#speakers">Ver todos los speakers</a>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>
          </>
        )}

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
                <a href="/#entradas">Entradas</a>
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
