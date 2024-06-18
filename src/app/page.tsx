"use client";

import Navbar from "@/components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faFingerprint,
  faPaperPlane,
  faTicket,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Footer from "@/components/Footer";
import CarouselComponent from "@/components/Carousel";
import Head from "next/head";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppIcon";
import { Conferencista } from "@/types/conferencista";
import Image from "next/image";

export default function Landing() {
  const conferencistas: Conferencista[] = [
    {
      nombre: "ANTONIO SOLA",
      alt: "antonio-sola",
      titulo: "‘La nueva era en la industria del marketing político’",
      redesSociales: {
        Instagram:
          "https://www.instagram.com/antoniosola_?igsh=MXRyaXQxbTc1N2VmeA==",
        Facebook: "https://www.facebook.com/AntonioSolaRecheOK?mibextid=LQQJ4d",
        X: "https://x.com/antoniosola_?s=11",
      },
    },
    {
      nombre: "JOSÉ GUINAND",
      alt: "jose-guinand",
      titulo: "‘Disrupción XXI: Campañas en la era digital’",
      redesSociales: {
        Instagram:
          "https://www.instagram.com/guinandestrategia?igsh=OWlqdjc1M2NtcTlr",
        Facebook:
          "https://www.facebook.com/profile.php?id=61560427087270&mibextid=LQQJ4d",
        X: "https://x.com/joseguinandc?s=11",
      },
    },
    {
      nombre: "ÁNGEL BECCASSINO",
      alt: "angel-beccassino",
      titulo: "‘2026: ¿Qué hay que hacer para ganar?’",
      redesSociales: {
        Instagram: "https://www.instagram.com/beccassino?igsh=dG9uaDc1enc3OWZ5",
        X: "https://x.com/beccassino?s=11",
      },
    },
    {
      nombre: "EUGENIE RICHARD",
      alt: "eugenie-richard",
      titulo:
        "‘La comunicación de gobierno: saber construir y comunicar su legado como líder político’",
      redesSociales: {
        Instagram:
          "https://www.instagram.com/richard_eugenie?igsh=MTNuOHRoMGNwYjRobg==",
        X: "https://x.com/moving_world?s=11",
        Facebook: "https://www.facebook.com/eugenie.richard",
      },
    },
    {
      nombre: "JORGE SALIM ELJACH",
      alt: "jorge-salim",
      titulo: "El próximo presidente de Colombia según las redes",
      redesSociales: {
        Instagram:
          "https://www.instagram.com/jorgesalim_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      },
    },
    {
      nombre: "JAMER CHICA",
      alt: "jamer-chica",
      titulo: "‘Ganadores de elecciones, perdedores de Gobiernos’",
      redesSociales: {
        Instagram:
          "https://www.instagram.com/jamerchica?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      },
    },
    {
      nombre: "MARCO ANTONIO FONSECA",
      alt: "marco-fonseca",
      titulo: "‘El próximo presidente de Colombia según las redes’",
      redesSociales: {
        Instagram:
          "https://www.instagram.com/marcoantoniofo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      },
    },
    {
      nombre: "DARMI FUENTES",
      alt: "darmi-fuentes",
      titulo: "‘La construcción arquetípica del discurso político’",
      redesSociales: {
        Facebook: "https://www.facebook.com/darmi.fuentes?mibextid=LQQJ4d",
        Instagram:
          "https://www.instagram.com/darmi_fuentes/?utm_source=ig_web_button_share_sheet",
      },
    },
    {
      nombre: "AUGUSTO REYES",
      alt: "augusto-reyes",
      titulo: "‘¡La política se jodió!’",
      redesSociales: {
        Instagram:
          "https://www.instagram.com/augustoreyes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      },
    },
  ];

  return (
    <>
      <Head>
        <meta
          name="facebook-domain-verification"
          content="jt2ot27pe1huad2jmb79us4h59gucj"
        />
      </Head>
      <Navbar transparent />
      <main>
        <div
          className="relative pt-16 pb-32 flex content-center items-center justify-center"
          style={{
            minHeight: "75vh",
          }}
        >
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}images/bground.jpg')`,
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-black"
            ></span>
          </div>
          <div className="container relative mx-auto">
            <div className="items-center flex flex-wrap">
              <div className="w-full px-4 ml-10 mr-10 text-center">
                <div className="py-12">
                  <h1 className="text-white font-semibold text-5xl">
                    CONGRESO NACIONAL DE MARKETING POLÍTICO – COLOMBIA 2024
                  </h1>
                  <p className="mt-4 text-lg text-justify text-gray-300">
                    El Congreso Nacional de Marketing Político versión Colombia
                    2024, se realizará en la ciudad de Bucaramanga y reunirá a
                    los principales ponentes de la comunicación, la estrategia y
                    el marketing político en Colombia, con el fin de orientar a
                    candidatos, asesores, investigadores, estudiantes
                    universitarios, y partidos políticos interesados en conocer
                    las últimas tendencias de la estrategia de campañas
                    electorales y comunicación de Gobierno.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-gray-300 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </div>

        <section className="pb-20 bg-gray-300 -mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap text-black">
              <Link
                href={process.env.NEXT_PUBLIC_URL + "tickets/buy"}
                className="w-full md:w-4/12 px-4 text-center lg:order-2"
              >
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                      <svg className="animate-bounce w-6 h-6">
                        <FontAwesomeIcon icon={faTicket} />
                      </svg>
                    </div>
                    <h6 className="text-xl font-semibold">
                      COMPRA TUS ENTRADAS
                      <span className="relative flex h-7 w-7">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500"></span>
                      </span>
                    </h6>
                  </div>
                </div>
              </Link>
              <Link
                href="#contacts"
                className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center lg:order-1"
              >
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <FontAwesomeIcon icon={faAward} />
                    </div>
                    <h6 className="text-xl font-semibold ">CONTACTO</h6>
                  </div>
                </div>
              </Link>

              <Link
                href="#conferences"
                className="pt-6 w-full md:w-4/12 px-4 text-center lg:order-3"
              >
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                      <FontAwesomeIcon icon={faFingerprint} />
                    </div>
                    <h6 className="text-xl font-semibold text-black">
                      CONFERENCISTAS INVITADOS
                    </h6>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex flex-wrap items-center mt-32">
              <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-gray-100">
                  <FontAwesomeIcon icon={faUserFriends} />
                </div>
                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                  AGENDA DEL EVENTO
                </h3>
                <p className="text-lg font-light text-justify leading-relaxed mt-4 mb-4 text-gray-700">
                  En el Congreso Nacional de Marketing Político participarán 10
                  conferencistas nacionales e internacionales en temas
                  relacionados sobre la construcción y ejecución de una campaña
                  ganadora. Cada día contaremos con la intervención de 5
                  conferencistas, y se contará con espacios de descanso en cada
                  jornada y una hora libre para almuerzo.
                </p>
                <p className="text-lg font-light text-justify leading-relaxed mt-4 mb-4 text-gray-700">
                  En la jornada de la tarde se organizará un debate entre los 5
                  conferencistas correspondientes al día en un tema de
                  trascendencia nacional.
                </p>
                <p className="text-lg font-light text-justify leading-relaxed mt-4 mb-4 text-gray-700">
                  ¡No puedes dejar de participar!
                </p>
              </div>

              <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-pink-600">
                  <img
                    alt="..."
                    src={
                      process.env.NEXT_PUBLIC_URL + "images/agenda-2024.jpeg"
                    }
                    className="w-full align-middle rounded-t-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20">
          <div
            className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
            style={{ height: "80px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-white fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>

          <div className="container mx-auto px-4">
            <div className="items-center flex flex-wrap">
              <div className="w-full md:w-4/12 ml-auto mr-auto px-4">
                <CarouselComponent />
              </div>
              <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
                <div className="md:pr-12">
                  <h3 className="text-3xl font-semibold">PANELES DE DEBATE</h3>
                  <ul className="list-none mt-6">
                    {conferencistas.map((conferencista, index) => (
                      <li className="py-2" key={index}>
                        <div className="flex items-center">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                              <FontAwesomeIcon icon={faPaperPlane} />
                            </span>
                          </div>
                          <div>
                            <h4 className="text-gray-600">
                              {conferencista.titulo}
                            </h4>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-20 pb-48">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center mb-24">
              <div className="w-full lg:w-6/12 px-4">
                <h2
                  className="text-4xl font-semibold text-nowrap"
                  id="conferences"
                >
                  CONFERENCISTAS PARTICIPANTES
                </h2>
                {/* <p className="text-lg leading-relaxed m-4 text-gray-600">
                  According to the National Oceanic and Atmospheric
                  Administration, Ted, Scambos, NSIDClead scentist, puts the
                  potentially record maximum.
                </p> */}
              </div>
            </div>
            <div className="flex flex-wrap mb-12 gap-y-4">
              {conferencistas.map((conferencista, index) => (
                <Link
                  key={index}
                  href={
                    process.env.NEXT_PUBLIC_URL + `profile/${conferencista.alt}`
                  }
                  className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
                >
                  <div className="px-6">
                    <Image
                      alt={conferencista.nombre}
                      src={`/images/2024/${conferencista.alt}.jpg`}
                      className="shadow-lg rounded-full max-w-full mx-auto"
                      width={120}
                      height={140}
                    />
                    <div className="pt-6 text-center">
                      <h5 className="text-xl font-bold">
                        {conferencista.nombre}
                      </h5>
                      <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                        {conferencista.titulo}
                      </p>
                      <div className="mt-6">
                        {conferencista.redesSociales.Facebook && (
                          <Link
                            href={conferencista.redesSociales.Facebook}
                            className="inline-block bg-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <svg
                              className="w-8 h-8"
                              viewBox="0 0 48 48"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M48 24C48 10.7438 37.2562 0 24 0C10.7438 0 0 10.7438 0 24C0 35.9813 8.775 45.9094 20.25 47.7094V30.9375H14.1562V24H20.25V18.7125C20.25 12.6984 23.8313 9.375 29.3156 9.375C31.9406 9.375 34.6875 9.84375 34.6875 9.84375V15.75H31.6594C28.6781 15.75 27.75 17.6016 27.75 19.5V24H34.4062L33.3422 30.9375H27.75V47.7094C39.225 45.9094 48 35.9813 48 24Z"
                                fill="#1877F2"
                              />
                              <path
                                d="M33.3422 30.9375L34.4062 24H27.75V19.5C27.75 17.6016 28.6781 15.75 31.6594 15.75H34.6875V9.84375C34.6875 9.84375 31.9406 9.375 29.3156 9.375C23.8313 9.375 20.25 12.6984 20.25 18.7125V24H14.1562V30.9375H20.25V47.7094C21.4734 47.9016 22.725 48 24 48C25.275 48 26.5266 47.9016 27.75 47.7094V30.9375H33.3422Z"
                                fill="white"
                              />
                            </svg>
                          </Link>
                        )}
                        {conferencista.redesSociales.Instagram && (
                          <Link
                            href={conferencista.redesSociales.Instagram}
                            className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-8 h-8"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </Link>
                        )}
                        {conferencista.redesSociales.X && (
                          <Link
                            className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none  mr-1 mb-1"
                            href={conferencista.redesSociales.X}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 48 48"
                              className="w-8 w-8"
                            >
                              <path
                                fill="#03a9f4"
                                d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                              />
                              <path
                                fill="#fff"
                                d="M36,17.12c-0.882,0.391-1.999,0.758-3,0.88c1.018-0.604,2.633-1.862,3-3	c-0.951,0.559-2.671,1.156-3.793,1.372C29.789,13.808,24,14.755,24,20v2c-4,0-7.9-3.047-10.327-6c-2.254,3.807,1.858,6.689,2.327,7	c-0.807-0.025-2.335-0.641-3-1c0,0.016,0,0.036,0,0.057c0,2.367,1.661,3.974,3.912,4.422C16.501,26.592,16,27,14.072,27	c0.626,1.935,3.773,2.958,5.928,3c-2.617,2.029-7.126,2.079-8,1.977c8.989,5.289,22.669,0.513,21.982-12.477	C34.95,18.818,35.342,18.104,36,17.12"
                              />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20 relative block bg-gray-900">
          <div
            className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
            style={{ height: "80px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-gray-900 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>

          {/* <div className="container mx-auto px-4 lg:pt-24 lg:pb-64">
            <div className="flex flex-wrap text-center justify-center">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-semibold text-white">
                  Build something
                </h2>
                <p className="text-lg leading-relaxed mt-4 mb-4 text-gray-500">
                  Put the potentially record low maximum sea ice extent tihs
                  year down to low ice. According to the National Oceanic and
                  Atmospheric Administration, Ted, Scambos.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap mt-12 justify-center">
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <FontAwesomeIcon icon={faMedal} />{" "}
                </div>
                <h6 className="text-xl mt-5 font-semibold text-white">
                  Excelent Services
                </h6>
                <p className="mt-2 mb-4 text-gray-500">
                  Some quick example text to build on the card title and make up
                  the bulk of the cards content.
                </p>
              </div>
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <FontAwesomeIcon icon={faPoll} />{" "}
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">
                  Grow your market
                </h5>
                <p className="mt-2 mb-4 text-gray-500">
                  Some quick example text to build on the card title and make up
                  the bulk of the s content.
                </p>
              </div>
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">
                  Launch time
                </h5>
                <p className="mt-2 mb-4 text-gray-500">
                  Some quick example text to build on the card title and make up
                  the bulk of the cards content.
                </p>
              </div> */}
          {/* </div> */}
          {/* </div> */}
        </section>
        {/* <section className="relative block py-24 lg:pt-0 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300">
                  <div className="flex-auto p-5 lg:p-10">
                    <h4 className="text-2xl font-semibold">
                      Want to work with us?
                    </h4>
                    <p className="leading-relaxed mt-1 mb-4 text-gray-600">
                      Complete this form and we will get back to you in 24
                      hours.
                    </p>
                    <div className="relative w-full mb-3 mt-8">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="full-name"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Full Name"
                        style={{ transition: "all .15s ease" }}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Email"
                        style={{ transition: "all .15s ease" }}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="message"
                      >
                        Message
                      </label>
                      <textarea
                        rows={4}
                        cols={80}
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Type a message..."
                      />
                    </div>
                    <div className="text-center mt-6">
                      <button
                        className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        style={{ transition: "all .15s ease" }}
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}
