'use client';

import Navbar from '@/components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAward,
  faCalendarAlt,
  faDownload,
  faFingerprint,
  faMapMarkerAlt,
  faPaperPlane,
  faTicket,
  faUserFriends,
  faLightbulb,
  faComments,
  faNetworkWired,
  faEnvelope,
  faPhone,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Footer from '@/components/Footer';
import CarouselComponent from '@/components/Carousel';
import Head from 'next/head';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppIcon';
import { Conferencista } from '@/types/conferencista';
import Image from 'next/image';
import LecturerCard from '@/components/lecturer-card';
import { useState, useEffect } from 'react';
import { Tooltip } from '@chakra-ui/react';
import { useCarouselTouchEvents } from '@/hooks/useCarouselTouchEvents';
import TestimonialSection from '@/components/testimonials/TestimonialSection';
import TicketsSection from '@/components/tickets/TicketsSections';
import ContactSection from '@/components/contactSection';
export default function Landing() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useCarouselTouchEvents('.overflow-x-auto');

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

  // Lista de conferencistas internacionales
  const conferencistasInternacionales = [
    {
      nombre: 'ANTONIO SOLA',
      alt: 'antonio-sola',
      titulo: 'La nueva era en la industria del marketing político.',
      pais: 'España',
      redesSociales: {
        Instagram: 'https://www.instagram.com/antoniosola_',
        Facebook: 'https://www.facebook.com/AntonioSolaRecheOK',
        X: 'https://x.com/antoniosola_',
      },
    },
    {
      nombre: 'MAXI AGUIAR',
      alt: 'maxi-aguiar',
      titulo: null,
      pais: 'Argentina',
      redesSociales: {
        Instagram: 'https://www.instagram.com/maxiaguiar',
      },
    },
    {
      nombre: 'GIOVANNI BERROA',
      alt: 'giovanni-berroa',
      titulo: null,
      pais: 'Perú',
      redesSociales: {
        Instagram: 'https://www.instagram.com/giovanniberroa',
      },
    },
    {
      nombre: 'EUGENIE RICHARD',
      alt: 'eugenie-richard',
      titulo:
        'La comunicación de gobierno: saber construir y comunicar su legado como líder político.',
      pais: 'Francia',
      redesSociales: {
        Instagram: 'https://www.instagram.com/richard_eugenie',
        X: 'https://x.com/moving_world',
        Facebook: 'https://www.facebook.com/eugenie.richard',
      },
    },
    {
      nombre: 'DAVID ROSS',
      alt: 'david-ross',
      titulo: null,
      pais: 'México',
      redesSociales: {
        Instagram: 'https://www.instagram.com/davidross',
      },
    },
    {
      nombre: 'FERNANDO DOPAZO',
      alt: 'fernando-dopazo',
      titulo: null,
      pais: 'Argentina',
      redesSociales: {
        Instagram: 'https://www.instagram.com/fernandodopazo',
      },
    },
    {
      nombre: 'VÍCTOR VARGAS',
      alt: 'victor-vargas',
      titulo: null,
      pais: 'México',
      redesSociales: {
        Instagram: 'https://www.instagram.com/victorvargas',
      },
    },
    {
      nombre: 'ÁNGEL BECCASSINO',
      alt: 'angel-beccassino',
      titulo: '2026: ¿Qué hay que hacer para ganar?',
      pais: 'Argentina',
      redesSociales: {
        Instagram: 'https://www.instagram.com/angelbeccassino',
      },
    },
    {
      nombre: 'HÉCTOR VENEGAS',
      alt: 'hector-venegas',
      titulo: null,
      pais: 'Ecuador',
      redesSociales: {
        Instagram: 'https://www.instagram.com/hectorvenegas',
      },
    },
    {
      nombre: 'LEANDRO FAGÚNDEZ',
      alt: 'leandro-fagundez',
      titulo: null,
      pais: 'Uruguay',
      redesSociales: {
        Instagram: 'https://www.instagram.com/leandrofagundez',
      },
    },
  ];

  // Lista de conferencistas nacionales
  const conferencistasNacionales = [
    {
      nombre: 'MARTHA HERNÁNDEZ',
      alt: 'martha-hernandez',
      titulo: null,
      redesSociales: {
        Instagram: 'https://www.instagram.com/marthahernandez',
      },
    },
    {
      nombre: 'JOSÉ GUINAND',
      alt: 'jose-guinand',
      titulo: 'Disrupción XXI: La nueva frontera electoral.',
      redesSociales: {
        Instagram: 'https://www.instagram.com/guinandestrategia',
        X: 'https://x.com/joseguinandc',
      },
    },
    {
      nombre: 'DARMI FUENTES',
      alt: 'darmi-fuentes',
      titulo: 'La construcción arquetípica del discurso político.',
      redesSociales: {
        Instagram: 'https://www.instagram.com/darmifuentes',
      },
    },
    {
      nombre: 'LUCIANA BECCASSINO',
      alt: 'luciana-beccassino',
      titulo: null,
      redesSociales: {
        Instagram: 'https://www.instagram.com/lucianabeccassino',
      },
    },
    {
      nombre: 'JAIME MÓVIL',
      alt: 'jaime-movil',
      titulo: null,
      redesSociales: {
        Instagram: 'https://www.instagram.com/jaimemovil',
      },
    },
    {
      nombre: 'ERIKA CÁCERES',
      alt: 'erika-caceres',
      titulo: null,
      redesSociales: {
        Instagram: 'https://www.instagram.com/erikacaceres',
      },
    },
    {
      nombre: 'PEDRO A. RODRÍGUEZ',
      alt: 'pedro-rodriguez',
      titulo: null,
      redesSociales: {
        Instagram: 'https://www.instagram.com/pedroarodriguez',
      },
    },
    {
      nombre: 'JAMER CHICA',
      alt: 'jamer-chica',
      titulo: 'El secreto de la victoria electoral.',
      redesSociales: {
        Instagram: 'https://www.instagram.com/jamerchica',
      },
    },
    {
      nombre: 'JORGE SALIM ELJACH',
      alt: 'jorge-salim',
      titulo: 'El próximo presidente de Colombia según las redes.',
      redesSociales: {
        Instagram: 'https://www.instagram.com/jorgesalimeljach',
      },
    },
    {
      nombre: 'ARLEY BASTIDAS',
      alt: 'arley-bastidas',
      titulo: null,
      redesSociales: {
        Instagram: 'https://www.instagram.com/arleybastidas',
      },
    },
    {
      nombre: 'HEINER BERTEL',
      alt: 'heiner-bertel',
      titulo: null,
      redesSociales: {
        Instagram: 'https://www.instagram.com/heinerbertel',
      },
    },
    {
      nombre: 'FREDDY SERRANO',
      alt: 'freddy-serrano',
      titulo: null,
      redesSociales: {
        Instagram: 'https://www.instagram.com/freddyserrano',
      },
    },
  ];

  // Audiencia a la que va dirigido
  const audienciaObjetivo = [
    'Eres candidato a una elección y necesitas una narrativa ganadora.',
    'Eres consultor, estratega o jefe de campaña y quieres estar al nivel de los grandes.',
    'Eres comunicador político, periodista o asesor de gobierno, y buscas dominar las nuevas herramientas de persuasión.',
    'Eres estudiante de ciencias políticas, comunicación o marketing, y quieres conectarte con los mejores del mundo real.',
    'Eres parte de un equipo de gobierno y quieres aprender cómo comunicar bien lo que haces.',
    'O simplemente… eres alguien que no le tiene miedo al poder, sino a no saber usarlo.',
  ];

  // Mensaje para los tooltips de compra
  const mensajeCompra =
    'Para realizar la compra, comunícate directamente con los administradores al WhatsApp: +57 318 120 0000';

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
        {' '}
        {/* Añadido padding-top para evitar que el contenido quede bajo la navbar */}
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
                      className="text-white font-semibold bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-center px-8 py-4 rounded-lg shadow-lg opacity-75 cursor-not-allowed"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onClick={(e) => e.preventDefault()}
                      title={mensajeCompra}
                    >
                      <FontAwesomeIcon icon={faTicket} className="mr-2" />
                      Inscríbete Ahora
                    </button>
                    {showTooltip && (
                      <div className="absolute z-10 w-72 px-4 py-2 mt-2 text-white bg-gray-900 rounded-lg shadow-lg">
                        <p className="text-sm">{mensajeCompra}</p>
                      </div>
                    )}
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
                  <img
                    src="/images/2024/conferencistas.png"
                    alt="Conferencistas 2025"
                    className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-[#1C2C67] text-white px-6 py-3 rounded-lg shadow-lg">
                    <div className="text-sm uppercase tracking-wide">
                      Edición
                    </div>
                    <div className="text-3xl font-bold">2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Conferencistas con Carrusel para Móvil */}
        <section id="conferencistas" className="py-16 bg-[#0f1424]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Estrategas. Narradores. Maestros del poder.
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-4">
                El CNMP2025 reúne a los grandes nombres del marketing político
                internacional. No vienen a repetir fórmulas. Vienen a revelar lo
                que realmente funciona.
              </p>
            </div>

            {/* Conferencistas Internacionales */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <span className="text-blue-300 mr-2">🌎</span> Internacionales
              </h3>

              {/* Carrusel para móvil */}
              <div className="block lg:hidden">
                <div className="relative">
                  <div className="overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                    <div className="flex space-x-4 w-max pl-4">
                      {conferencistasInternacionales
                        .filter((c) => c.titulo)
                        .map((conferencista, index) => (
                          <div
                            key={index}
                            className="w-72 flex-shrink-0 snap-center bg-gradient-to-br from-[#1C2C67]/30 to-[#4B0012]/30 backdrop-filter backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-800"
                          >
                            <div className="p-5">
                              <div className="flex items-center mb-3">
                                <h3 className="text-xl font-bold text-white">
                                  {conferencista.nombre}
                                </h3>
                                <span className="ml-2 text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                  {conferencista.pais}
                                </span>
                              </div>
                              <div className="mb-4">
                                <img
                                  src={`/images/2024/${conferencista.alt}.jpg`}
                                  alt={conferencista.nombre}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                              </div>
                              <p className="text-blue-300 mb-4 h-12 line-clamp-2">
                                "{conferencista.titulo}"
                              </p>
                              <div className="flex space-x-3">
                                {conferencista.redesSociales.Instagram && (
                                  <a
                                    href={conferencista.redesSociales.Instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </a>
                                )}
                                {conferencista.redesSociales.Facebook && (
                                  <a
                                    href={conferencista.redesSociales.Facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </a>
                                )}
                                {conferencista.redesSociales.X && (
                                  <a
                                    href={conferencista.redesSociales.X}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                    >
                                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  {/* Indicadores de desplazamiento */}
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
                      <div className="h-1 w-3 bg-gray-600 rounded-full"></div>
                      <div className="h-1 w-3 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  {/* Indicación de desplazamiento */}
                  <div className="text-center text-gray-400 text-sm mt-2">
                    <span>Desliza para ver más →</span>
                  </div>
                </div>
              </div>

              {/* Vista para desktop (grid original) */}
              <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {conferencistasInternacionales
                  .filter((c) => c.titulo)
                  .map((conferencista, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-[#1C2C67]/30 to-[#4B0012]/30 backdrop-filter backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-blue-500 transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <h3 className="text-xl font-bold text-white">
                            {conferencista.nombre}
                          </h3>
                          <span className="ml-2 text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                            {conferencista.pais}
                          </span>
                        </div>
                        <div className="mb-4">
                          <img
                            src={`/images/2024/${conferencista.alt}.jpg`}
                            alt={conferencista.nombre}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-blue-300 mb-4">
                          "{conferencista.titulo}"
                        </p>
                        <div className="flex space-x-3">
                          {conferencista.redesSociales.Instagram && (
                            <a
                              href={conferencista.redesSociales.Instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </a>
                          )}
                          {conferencista.redesSociales.Facebook && (
                            <a
                              href={conferencista.redesSociales.Facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </a>
                          )}
                          {conferencista.redesSociales.X && (
                            <a
                              href={conferencista.redesSociales.X}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Conferencistas Nacionales */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <span className="text-blue-300 mr-2">🇨🇴</span> Nacionales
              </h3>

              {/* Carrusel para móvil */}
              <div className="block lg:hidden">
                <div className="relative">
                  <div className="overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                    <div className="flex space-x-4 w-max pl-4">
                      {conferencistasNacionales
                        .filter((c) => c.titulo)
                        .map((conferencista, index) => (
                          <div
                            key={index}
                            className="w-64 flex-shrink-0 snap-center bg-gradient-to-br from-[#1C2C67]/20 to-[#4B0012]/20 backdrop-filter backdrop-blur-sm p-4 rounded-xl border border-gray-800"
                          >
                            <h3 className="text-lg font-bold text-white mb-1 truncate">
                              {conferencista.nombre}
                            </h3>
                            <div className="mb-4">
                              <img
                                src={`/images/2024/${conferencista.alt}.jpg`}
                                alt={conferencista.nombre}
                                className="w-full h-36 object-cover object-top rounded-lg"
                              />
                            </div>
                            <p className="text-blue-300 text-sm mb-4 h-10 line-clamp-2">
                              {conferencista.titulo}
                            </p>
                            <div className="flex space-x-3">
                              {conferencista.redesSociales.Instagram && (
                                <a
                                  href={conferencista.redesSociales.Instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-white"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </a>
                              )}
                              {conferencista.redesSociales.X && (
                                <a
                                  href={conferencista.redesSociales.X}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-white"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                  >
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  {/* Indicadores de desplazamiento */}
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
                      <div className="h-1 w-3 bg-gray-600 rounded-full"></div>
                      <div className="h-1 w-3 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  {/* Indicación de desplazamiento */}
                  <div className="text-center text-gray-400 text-sm mt-2">
                    <span>Desliza para ver más →</span>
                  </div>
                </div>
              </div>

              {/* Vista para desktop (grid original) */}
              <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {conferencistasNacionales
                  .filter((c) => c.titulo)
                  .map((conferencista, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-[#1C2C67]/20 to-[#4B0012]/20 backdrop-filter backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300"
                    >
                      <h3 className="text-lg font-bold text-white mb-1">
                        {conferencista.nombre}
                      </h3>
                      <div className="mb-4">
                        <img
                          src={`/images/2024/${conferencista.alt}.jpg`}
                          alt={conferencista.nombre}
                          className="w-full h-48 object-cover object-top rounded-lg"
                        />
                      </div>
                      <p className="text-blue-300 text-sm mb-4">
                        {conferencista.titulo}
                      </p>
                      <div className="flex space-x-3">
                        {conferencista.redesSociales.Instagram && (
                          <a
                            href={conferencista.redesSociales.Instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </a>
                        )}
                        {conferencista.redesSociales.X && (
                          <a
                            href={conferencista.redesSociales.X}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Panel de precandidatos */}
            <div className="bg-gradient-to-r from-[#1C2C67]/30 to-[#4B0012]/30 p-6 rounded-xl border border-white/10">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">🎙️</span>
                <h3 className="text-2xl font-bold text-white">
                  Panel de precandidatos presidenciales 2026
                </h3>
              </div>
              <p className="text-gray-300">
                En el marco del evento, se realizará un panel en el que 4
                pre-candidatos presidenciales participarán, con la dirección de
                un periodista en un debate sobre tres temas coyunturales para el
                país. Estos candidatos serán elegidos con base en quienes tengan
                mayor favorabilidad de opinión y reconocimiento en el mes de
                junio del 2025.
              </p>
            </div>
          </div>
        </section>
        {/* Estilos adicionales para el carrusel */}
        <style jsx global>{`
          /* Ocultar scrollbar pero mantener funcionalidad */
          .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }

          /* Estilo para limitar el número de líneas de texto */
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
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
        <TicketsSection  />
        
        {/* Testimonios */}
        <TestimonialSection mensajeCompra={mensajeCompra} />

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
