'use client';

import { downloadCertificate, getTicket } from '@/services/tickets';
import { Ticket, traductions } from '@/types/tickets';
import {
  faDownload,
  faSpinner,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { WHATSAPP_URL } from '@/data/contactData';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import '../../landing.css';

export default function TicketDetailPage() {
  const params = useParams();
  const { t } = useLanguage();

  const [uuid, setUuid] = useState<string>();
  const [ticket, setTicket] = useState<Ticket>();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setUuid(params?.document ? (params.document as string) : '');
  }, []);

  useEffect(() => {
    if (uuid) {
      setLoading(true);
      loadTicket(uuid);
    }
  }, [uuid]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal animations
  useEffect(() => {
    if (!ioRef.current) {
      ioRef.current = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('in');
            ioRef.current?.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
    }
    const io = ioRef.current;
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
  });

  const loadTicket = async (uuid: string) => {
    const ticket = await getTicket(uuid);
    setTicket(ticket);
    setLoading(false);
  };

  const handleDownloadCertificate = async () => {
    if (ticket?.uuid) {
      try {
        setDownloading(true);
        if (document) {
          const blob = await downloadCertificate(ticket.uuid);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `certificado-${ticket.name?.trim()}-${ticket.lastname?.trim()}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error('Error al descargar el certificado:', error);
        alert(t('ticketView.downloadError'));
      } finally {
        setDownloading(false);
      }
    }
  };

  return (
    <div className="cnmp-root">
      <div className="bg-field" />

      {/* NAVBAR */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="/"><img className="logo" src="/logo-principal.png" alt="CNMP 2026" /></a>
        <div className="nav-links">
          <a href="/#tour">{t('landing.nav.tour')}</a>
          <a href="/#speakers">{t('landing.nav.speakers')}</a>
          <a href="/#agenda">{t('landing.nav.agenda')}</a>
          <a href="/#entradas">{t('landing.nav.tickets')}</a>
          <a href="/#contacto">{t('landing.nav.contact')}</a>
          <a className="btn btn-neon" href="/#entradas">{t('landing.nav.register')} <span className="arr">→</span></a>
          <LanguageSwitcher className="ml-1" />
        </div>
      </nav>

      <main className="page" style={{ paddingTop: '80px' }}>

        {loading && (
          <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="pulse" style={{ width: 16, height: 16, margin: '0 auto 20px' }} />
              <p style={{ fontFamily: 'var(--display)', letterSpacing: '.2em', color: 'var(--mute)', fontSize: 13, textTransform: 'uppercase' }}>
                {t('ticketView.loading')}
              </p>
            </div>
          </div>
        )}

        {!loading && !ticket && (
          <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ maxWidth: 460, padding: '0 20px' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 64, color: 'var(--neon)', marginBottom: 16 }}>?</div>
              <h1 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 30, marginBottom: 12 }}>{t('ticketView.notFoundTitle')}</h1>
              <p style={{ color: 'var(--mute)', marginBottom: 20 }}>{t('ticketView.notFoundText')}</p>
              <p style={{ color: 'var(--mute)', fontSize: 14, marginBottom: 8 }}>{t('ticketView.helpText')}</p>
              <a href="mailto:cnmpcolombia@gmail.com" style={{ color: 'var(--neon)', fontWeight: 600 }}>cnmpcolombia@gmail.com</a>
            </div>
          </div>
        )}

        {!loading && ticket && (
          <>
            {/* ── HERO: info (izq) + tarjeta QR/certificado (der) ── */}
            <section className="lp-hero">
              <div className="wrap">
                <div className="lp-hero-grid">
                  {/* Izquierda: datos del boleto */}
                  <div className="lp-hero-info">
                    <span className="eyebrow">{t('ticketView.official')} · #CNMP2025</span>

                    <span className="badge-st ok" style={{ fontSize: 11, padding: '6px 14px', borderRadius: 100, margin: '18px 0', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <FontAwesomeIcon icon={faCheckCircle} /> {t('ticketView.confirmed')}
                    </span>

                    <h1 className="lp-name" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', maxWidth: '100%' }}>
                      {ticket.name?.trim()}<br />
                      <span style={{ color: 'var(--neon)' }}>{ticket.lastname?.trim()}</span>
                    </h1>

                    <div className="lp-pills">
                      <span className="lp-pill">🎟 {traductions[ticket.type] ?? ticket.type}</span>
                      <span className="lp-pill">{t('ticketView.document')}: {ticket.document?.trim()}</span>
                    </div>
                  </div>

                  {/* Derecha: QR + certificado */}
                  <div className="lp-sidebar-card" style={{ position: 'static' }}>
                    <div style={{ background: '#fff', padding: 20, display: 'flex', justifyContent: 'center' }}>
                      {ticket.qrUrl
                        ? <img src={ticket.qrUrl} alt={t('ticketView.qrAlt')} style={{ width: 200, height: 200 }} />
                        : <div style={{ width: 200, height: 200 }} />}
                    </div>
                    <div className="lp-sidebar-body">
                      <div className="lp-sidebar-name">{t('ticketView.accessCode')}</div>
                      <p style={{ color: 'var(--mute)', fontSize: 13, marginTop: 8 }}>{t('ticketView.qrHint')}</p>

                      {ticket.certificateUrl ? (
                        <button
                          onClick={handleDownloadCertificate}
                          disabled={downloading}
                          className="btn btn-neon"
                          style={{ width: '100%', justifyContent: 'center', marginTop: 18, opacity: downloading ? 0.7 : 1 }}
                        >
                          <FontAwesomeIcon icon={downloading ? faSpinner : faDownload} spin={downloading} />
                          {' '}{downloading ? t('ticketView.downloading') : t('ticketView.downloadCert')}
                        </button>
                      ) : (
                        <button className="btn btn-ghost" disabled style={{ width: '100%', justifyContent: 'center', marginTop: 18, opacity: 0.5, cursor: 'not-allowed' }}>
                          <FontAwesomeIcon icon={faDownload} /> {t('ticketView.certUnavailable')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── CONTENT ── */}
            <section className="band" style={{ paddingTop: 16 }}>
              <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Detalles del evento + Certificado (2 columnas) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  <div className="lp-card reveal">
                    <span className="eyebrow">{t('ticketView.eventDetails')}</span>
                    <ul className="lp-list" style={{ marginTop: 14 }}>
                      <li><span className="lp-list-dot">✦</span>{t('ticketView.date')}: {t('ticketView.eventDate')}</li>
                      <li><span className="lp-list-dot">✦</span>{t('ticketView.location')}: Cartagena, Colombia</li>
                    </ul>
                  </div>
                  <div className="lp-card reveal">
                    <span className="eyebrow">{t('ticketView.certificate')}</span>
                    <p className="lp-bio" style={{ marginTop: 12 }}>
                      {ticket.certificateUrl ? t('ticketView.certAvailable') : t('ticketView.certPending')}
                    </p>
                  </div>
                </div>

                {/* Instrucciones: 3 columnas */}
                <div className="lp-card reveal">
                  <span className="eyebrow">{t('ticketView.instructionsTitle')}</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28, marginTop: 18 }}>
                    <div>
                      <h4 className="lp-card-title" style={{ fontSize: 16 }}>{t('ticketView.before')}</h4>
                      <ul className="lp-list">
                        <li><span className="lp-list-dot">✓</span>{t('ticketView.before1')}</li>
                        <li><span className="lp-list-dot">✓</span>{t('ticketView.before2')}</li>
                        <li><span className="lp-list-dot">✓</span>{t('ticketView.before3')}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="lp-card-title" style={{ fontSize: 16 }}>{t('ticketView.during')}</h4>
                      <ul className="lp-list">
                        <li><span className="lp-list-dot">✓</span>{t('ticketView.during1')}</li>
                        <li><span className="lp-list-dot">✓</span>{t('ticketView.during2')}</li>
                        <li><span className="lp-list-dot">✓</span>{t('ticketView.during3')}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="lp-card-title" style={{ fontSize: 16 }}>{t('ticketView.after')}</h4>
                      <ul className="lp-list">
                        <li><span className="lp-list-dot">✓</span>{t('ticketView.after1')}</li>
                        <li><span className="lp-list-dot">✓</span>{t('ticketView.after2')}</li>
                        <li><span className="lp-list-dot">✓</span>{t('ticketView.after3')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--mute)', fontSize: 13, marginTop: 4 }}>
                  <strong style={{ color: '#fff' }}>{t('ticketView.importantLabel')}</strong> {t('ticketView.importantText')}
                  {' '}· ID: {ticket.uuid?.substring(0, 8)}
                </p>
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
                <p className="desc">{t('landing.footer.desc')}</p>
              </div>
              <div className="foot-col">
                <h4>{t('landing.footer.event')}</h4>
                <a href="/#speakers">{t('landing.footer.speakers')}</a>
                <a href="/#agenda">{t('landing.footer.agenda')}</a>
                <a href="/#entradas">{t('landing.footer.tickets')}</a>
              </div>
              <div className="foot-col">
                <h4>{t('landing.footer.contact')}</h4>
                <a href="mailto:cnmpcolombia@gmail.com">cnmpcolombia@gmail.com</a>
                <a href="https://cnmpcolombia.com">cnmpcolombia.com</a>
              </div>
            </div>
            <div className="foot-bottom">
              <span>{t('landing.footer.rights', { year: new Date().getFullYear() })}</span>
            </div>
          </div>
        </footer>
      </main>

      {/* WhatsApp */}
      <a className="wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.738-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" /></svg>
      </a>
    </div>
  );
}
