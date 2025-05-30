'use client';

import Navbar from '@/components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppIcon';
import { useState, useEffect } from 'react';
import TestimonialSection from '@/components/testimonials/TestimonialSection';
import TicketsSection from '@/components/tickets/TicketsSections';
import ContactSection from '@/components/contactSection';
import ConferencistasSection from '@/components/ConferencistasSection';
import { TicketType } from '@/types/tickets';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const router = useRouter();

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNav, setShowNav] = useState(false);

  // Simulando la fecha del congreso 2025 (1 y 2 de agosto de 2025)
  const eventDate = new Date('2025-08-01T09:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setDays(Math.floor(difference / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((difference / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((difference / 1000 / 60) % 60));
        setSeconds(Math.floor((difference / 1000) % 60));
      }
    }, 1000);

    // Efecto para cambiar el fondo del navbar al hacer scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Audiencia a la que va dirigido
  const audienciaObjetivo = [
    'Eres candidato a una elección y necesitas una narrativa ganadora.',
    'Eres consultor, estratega o jefe de campaña y quieres estar al nivel de los grandes.',
    'Eres comunicador político, periodista o asesor de gobierno, y buscas dominar las nuevas herramientas de persuasión.',
    'Eres estudiante de ciencias políticas, comunicación o marketing, y quieres conectarte con los mejores del mundo real.',
    'Eres parte de un equipo de gobierno y quieres aprender cómo comunicar bien lo que haces.',
    'O simplemente… eres alguien que no le tiene miedo al poder, sino a no saber usarlo.',
  ];

    const handleButtonClick = (localidadId: TicketType) => {
      // Redireccionar a la página de detalles de compra con la localidad seleccionada
      router.push(`/quantity-select?localidad=${localidadId}`);
    };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="facebook-domain-verification"
          content="jt2ot27pe1huad2jmb79us4h59gucj"
        />
        <title>Congreso Nacional de Marketing Político - Colombia 2025</title>
        <meta
          name="description"
          content="CNMP 2025 – Donde nacen las campañas ganadoras. El evento más importante de marketing político en Cartagena, Colombia."
        />
      </Head>
      <Navbar transparent={!showNav} />
      <main>
        {/* Hero Section */}
        <div
          className="relative pb-10 flex content-center items-center justify-center pt-20"
          style={{
            minHeight: '100vh',
            backgroundImage: "url('/images/2025/hero-background.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              background:
                'linear-gradient(135deg, rgba(28, 44, 103, 0.92) 0%, rgba(75, 0, 18, 0.92) 100%)',
              backgroundBlendMode: 'overlay',
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75"
            ></span>
          </div>
          <div className="container relative mx-auto px-4">
            <div className="flex flex-wrap items-center">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center md:text-left">
                <h1 className="text-white font-bold text-4xl md:text-5xl xl:text-6xl leading-tight mb-6">
                  CNMP 2025
                  <br />
                  <span className="text-blue-300">
                    Donde nacen las campañas ganadoras
                  </span>
                </h1>
                <p className="mt-4 text-lg text-gray-300 max-w-lg mx-auto md:mx-0">
                  El poder no se improvisa. Se construye con estrategia, con
                  narrativa, con inteligencia. El Congreso Nacional de Marketing
                  Político vuelve en su tercera edición para redefinir lo que
                  significa hacer política en el siglo XXI. Un encuentro para
                  quienes entienden que ganar elecciones es solo el primer paso.
                </p>

                {/* Countdown */}
                <div className="my-8 flex justify-center md:justify-start">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm px-3 py-2 rounded-lg">
                      <div className="text-3xl font-bold text-white">
                        {days}
                      </div>
                      <div className="text-xs text-gray-300">DÍAS</div>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm px-3 py-2 rounded-lg">
                      <div className="text-3xl font-bold text-white">
                        {hours}
                      </div>
                      <div className="text-xs text-gray-300">HORAS</div>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm px-3 py-2 rounded-lg">
                      <div className="text-3xl font-bold text-white">
                        {minutes}
                      </div>
                      <div className="text-xs text-gray-300">MIN</div>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm px-3 py-2 rounded-lg">
                      <div className="text-3xl font-bold text-white">
                        {seconds}
                      </div>
                      <div className="text-xs text-gray-300">SEG</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center md:justify-start">
                  <div className="relative inline-block">
                    <button
                      className="text-white font-semibold bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-center px-8 py-4 rounded-lg shadow-lg "
                      onClick={() => handleButtonClick(TicketType.DIAMOND)}
                    >
                      <FontAwesomeIcon icon={faTicket} className="mr-2" />
                      Inscríbete Ahora
                    </button>
                  </div>
                </div>

                <div className="flex items-center mt-8 justify-center md:justify-start gap-4">
                  <div className="flex items-center text-gray-300">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="mr-2 text-blue-300"
                    />
                    <span>1 y 2 de agosto, 2025</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="mr-2 text-blue-300"
                    />
                    <span>Cartagena, Colombia</span>
                  </div>
                </div>

                <div className="mt-8 text-gray-300">
                  <p className="text-lg">
                    En 2025, Cartagena será testigo de un evento sin
                    precedentes:
                  </p>
                  <ul className="list-none mt-4 space-y-2">
                    <li className="flex items-center">
                      <span className="text-blue-300 mr-2">✔</span>
                      <span>500 asistentes</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-300 mr-2">✔</span>
                      <span>Conferencistas de 7 países</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-300 mr-2">✔</span>
                      <span>Un panel con precandidatos presidenciales</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-300 mr-2">✔</span>
                      <span>
                        Y una comunidad que no cree en lo ordinario y
                        tradicional.
                      </span>
                    </li>
                  </ul>
                  <p className="mt-4 font-semibold">
                    👉 Si tú no estás, tu competencia sí lo estará.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-5/12 px-4 mt-12 lg:mt-0">
                <div className="relative">
                  <iframe
                    src="https://www.youtube.com/embed/IzsLiH6IRXQ?autoplay=1&mute=1"
                    title="Video CNMP 2025" 
                    className="w-full rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    height="315"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  {/*
                  <div className="absolute -bottom-4 -right-4 bg-[#1C2C67] text-white px-6 py-3 rounded-lg shadow-lg">
                    <div className="text-sm uppercase tracking-wide">
                      Edición
                    </div>
                    <div className="text-3xl font-bold">2025</div>
                  </div>
                  */}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Conferencistas Section (componente modularizado) */}
        <ConferencistasSection />
        
        {/* Dirigido a */}
        <section id="dirigido-a" className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
              ¿Quién debería estar en el CNMP2025?
            </h2>
            <p className="text-xl text-gray-300 text-center mb-10 max-w-3xl mx-auto">
              Solo quienes juegan para ganar. Este congreso no es para curiosos,
              ni para espectadores. Es para quienes saben que la política
              cambió, y quieren cambiar con ella.
            </p>

            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <span className="text-blue-300 mr-2">🎯</span> Este evento es
                para ti si:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {audienciaObjetivo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-gradient-to-br from-[#1C2C67]/20 to-[#4B0012]/20 backdrop-filter backdrop-blur-sm p-6 rounded-xl"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012] flex items-center justify-center mt-1">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="ml-4 text-gray-300">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-gradient-to-br from-[#1C2C67]/30 to-[#4B0012]/30 p-6 rounded-xl border border-white/10">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🔐</span>
                  <h3 className="text-xl font-semibold text-white">
                    Lo que ocurre en el CNMP
                  </h3>
                </div>
                <p className="text-gray-300">
                  Aquí se habla de estrategia, se diseccionan campañas, se
                  revelan errores y se comparten victorias. Si estás en ese
                  juego: este es tu lugar.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Entradas */}
        <TicketsSection handleButtonClick={handleButtonClick} />
        
        {/* Testimonios */}
        <TestimonialSection handleButtonClick={handleButtonClick} />

        {/* Aliados */}
        <section
          id="aliados"
          className="py-16 bg-gradient-to-b from-black to-[#0f1424]"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
                Aliarse con el poder transforma tu marca
              </h2>
              <p className="text-xl text-gray-300 text-center mb-10">
                Formar parte del CNMP2025 como aliado estratégico es conectarse
                con:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/10 backdrop-filter backdrop-blur-sm p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-white font-semibold mb-2">
                    Una comunidad de +500 líderes
                  </h3>
                  <p className="text-gray-400">del mundo electoral</p>
                </div>

                <div className="bg-white/10 backdrop-filter backdrop-blur-sm p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">🔄</div>
                  <h3 className="text-white font-semibold mb-2">
                    Un ecosistema de decisión política
                  </h3>
                  <p className="text-gray-400">en Colombia y LATAM</p>
                </div>

                <div className="bg-white/10 backdrop-filter backdrop-blur-sm p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">👁️</div>
                  <h3 className="text-white font-semibold mb-2">
                    Visibilidad ante 2.5 millones
                  </h3>
                  <p className="text-gray-400">de personas en redes sociales</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1C2C67]/30 to-[#4B0012]/30 p-6 rounded-xl border border-white/10 mb-10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-blue-300 mr-2">🎯</span> Ideal para:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Universidades y centros académicos
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Entidades territoriales
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Marcas y medios de comunicación
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Agencias de estrategia y tecnología política
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  <span className="text-blue-300 mr-1">📩</span> Solicita
                  nuestro portafolio de patrocinio al correo:
                </p>
                <a
                  href="mailto:cnmpcolombia@gmail.com"
                  className="text-white text-xl font-semibold hover:text-blue-300 transition-colors"
                >
                  cnmpcolombia@gmail.com
                </a>
                <p className="text-xl text-white font-semibold mt-6">
                  🤝 El momento de influir es ahora.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}