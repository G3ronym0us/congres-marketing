'use client';

import Navbar from '@/components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAward,
  faFingerprint,
  faPaperPlane,
  faTicket,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Footer from '@/components/Footer';
import CarouselComponent from '@/components/Carousel';
import Head from 'next/head';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppIcon';
import { Conferencista } from '@/types/conferencista';
import Image from 'next/image';
import LecturerCard from '@/components/lecturer-card';
import politics from '../../public/images/2024/conferencistas.png';

export default function Landing() {
  const conferencistas: Conferencista[] = [
    {
      nombre: 'ANTONIO SOLA',
      alt: 'antonio-sola',
      titulo: '‘La nueva era en la industria del marketing político’',
      redesSociales: {
        Instagram:
          'https://www.instagram.com/antoniosola_?igsh=MXRyaXQxbTc1N2VmeA==',
        Facebook: 'https://www.facebook.com/AntonioSolaRecheOK?mibextid=LQQJ4d',
        X: 'https://x.com/antoniosola_?s=11',
      },
    },
    {
      nombre: 'JOSÉ GUINAND',
      alt: 'jose-guinand',
      titulo: '‘Disrupción XXI: Campañas en la era digital’',
      redesSociales: {
        Instagram:
          'https://www.instagram.com/guinandestrategia?igsh=OWlqdjc1M2NtcTlr',
        Facebook:
          'https://www.facebook.com/profile.php?id=61560427087270&mibextid=LQQJ4d',
        X: 'https://x.com/joseguinandc?s=11',
      },
    },
    {
      nombre: 'ÁNGEL BECCASSINO',
      alt: 'angel-beccassino',
      titulo: '‘2026: ¿Qué hay que hacer para ganar?’',
      redesSociales: {
        Instagram: 'https://www.instagram.com/beccassino?igsh=dG9uaDc1enc3OWZ5',
        X: 'https://x.com/beccassino?s=11',
      },
    },
    {
      nombre: 'EUGENIE RICHARD',
      alt: 'eugenie-richard',
      titulo:
        '‘La comunicación de gobierno: saber construir y comunicar su legado como líder político’',
      redesSociales: {
        Instagram:
          'https://www.instagram.com/richard_eugenie?igsh=MTNuOHRoMGNwYjRobg==',
        X: 'https://x.com/moving_world?s=11',
        Facebook: 'https://www.facebook.com/eugenie.richard',
      },
    },
    {
      nombre: 'JORGE SALIM ELJACH',
      alt: 'jorge-salim',
      titulo: 'El próximo presidente de Colombia según las redes',
      redesSociales: {
        Instagram:
          'https://www.instagram.com/jorgesalim_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      },
    },
    {
      nombre: 'JAMER CHICA',
      alt: 'jamer-chica',
      titulo: '‘Ganadores de elecciones, perdedores de Gobiernos’',
      redesSociales: {
        Instagram:
          'https://www.instagram.com/jamerchica?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      },
    },
    {
      nombre: 'MARCO ANTONIO FONSECA',
      alt: 'marco-fonseca',
      titulo: '‘El próximo presidente de Colombia según las redes’',
      redesSociales: {
        Instagram:
          'https://www.instagram.com/marcoantoniofo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      },
    },
    {
      nombre: 'DARMI FUENTES',
      alt: 'darmi-fuentes',
      titulo: '‘La construcción arquetípica del discurso político’',
      redesSociales: {
        Facebook: 'https://www.facebook.com/darmi.fuentes?mibextid=LQQJ4d',
        Instagram:
          'https://www.instagram.com/darmi_fuentes/?utm_source=ig_web_button_share_sheet',
      },
    },
    {
      nombre: 'AUGUSTO REYES',
      alt: 'augusto-reyes',
      titulo: '‘¡La política se jodió!’',
      redesSociales: {
        Instagram:
          'https://www.instagram.com/augustoreyes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      },
    },
  ];

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="facebook-domain-verification"
          content="jt2ot27pe1huad2jmb79us4h59gucj"
        />
      </Head>
      <Navbar transparent />
      <main className="bg-black">
        <div
          className="relative pt-16 pb-10 flex content-center items-center justify-center"
          style={{
            minHeight: '100vh',
          }}
        >
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              background:
                'linear-gradient(135deg, rgba(41, 50, 100, 0.8) 0%, rgba(0, 0, 20, 0.9) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)',
              backgroundColor: '#0a0b14',
              backgroundBlendMode: 'overlay',
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-black"
            ></span>
          </div>
          <div className="container relative mx-auto px-4 mt-10">
            <div className="items-center flex flex-wrap">
              <div className="w-full px-4 text-center md:text-left md:grid md:grid-cols-2 md:gap-4">
                <div className="py-6 flex flex-col items-center">
                  <h1 className="text-white font-semibold text-3xl md:text-4xl text-center md:text-left mb-4">
                    CONGRESO NACIONAL DE MARKETING POLÍTICO – COLOMBIA 2024
                  </h1>
                  <p className="mt-4 text-base md:text-lg text-center text-gray-300 md:text-left">
                    El Congreso Nacional de Marketing Político versión Colombia
                    2024, se realizará en la ciudad de Bucaramanga y reunirá a
                    los principales ponentes de la comunicación, la estrategia y
                    el marketing político en Colombia.
                  </p>
                  <div className="flex items-center mt-6 w-full">
                    <Link href={`/tickets/buy`}>
                      <button className="text-white text-xl font-semibold bg-[#1C2C67] text-center px-6 py-4 rounded w-full md:w-max">
                        <FontAwesomeIcon icon={faTicket} className="mr-4" />
                        Comprar Entradas
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="w-full rounded-lg overflow-hidden md:mx-10 md:mt-5">
                    <Image
                      src={politics}
                      alt="image"
                    />
                </div>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="px-4 py-10 text-white bg-gradient-to-r from-black from-20% via-[#4B0012] via-70% md:grid md:grid-cols-2 md:gap-8 md:mx-28">
            <div className="mb-8 md:mx-10" id="agenda">
              <h3 className="text-4xl mb-4 font-semibold leading-normal">
                AGENDA DEL EVENTO
              </h3>
              <p className="text-base md:text-xl font-light text-justify leading-relaxed mb-4 text-gray-300">
                En el Congreso Nacional de Marketing Político participarán 10
                conferencistas nacionales e internacionales en temas
                relacionados sobre la construcción y ejecución de una campaña
                ganadora. Cada día contaremos con la intervención de 5
                conferencistas, y se contará con espacios de descanso en cada
                jornada y una hora libre para almuerzo.
              </p>
              <p className="text-base md:text-xl font-light text-justify leading-relaxed mb-4 text-gray-300">
                En la jornada de la tarde se organizará un debate entre los 5
                conferencistas correspondientes al día en un tema de
                trascendencia nacional.
              </p>
              <p className="text-base md:text-xl font-light text-justify leading-relaxed mb-4 text-gray-300">
                ¡No puedes dejar de participar!
              </p>
            </div>

            <div className="w-full">
              <div className="relative flex flex-col min-w-0 break-words bg-white mx-20 mb-6 shadow-lg rounded-lg">
                <img
                  alt="Agenda del evento"
                  src={process.env.NEXT_PUBLIC_URL + 'images/agenda-2024.jpeg'}
                  className="w-full align-middle rounded-t-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div
            id="panels"
            className="px-4 py-10 bg-gradient-to-l from-black from-20% via-[#4B0012] via-70% md:grid md:grid-cols-2 md:gap-8 md:mx-28"
          >
            <div className="mb-8 md:mx-20">
              <CarouselComponent />
            </div>
            <div>
              <h3 className="text-2xl text-white font-semibold mb-4">
                PANELES DE DEBATE
              </h3>
              <ul className="list-none mt-4">
                {conferencistas.map((conferencista, index) => (
                  <li className="py-2" key={index}>
                    <div className="flex items-center">
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-blue-200 mr-3">
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </span>
                      <h4 className="text-gray-300 text-sm">
                        {conferencista.titulo}
                      </h4>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="px-4 md:flex md:flex-col md:items-center">
            <div className="text-center mb-12">
              <h2
                className="text-3xl font-semibold text-white"
                id="conferences"
              >
                CONFERENCISTAS PARTICIPANTES
              </h2>
            </div>
            <div className="grid grid-cols-1 md:mt-8 md:grid-cols-3 md:w-3/5 gap-8">
              {conferencistas.map((conferencista, index) => (
                <Link
                  key={index}
                  href={
                    process.env.NEXT_PUBLIC_URL + `profile/${conferencista.alt}`
                  }
                >
                  <LecturerCard conferencista={conferencista} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}
