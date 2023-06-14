"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faCoffee,
  faFingerprint,
  faLightbulb,
  faMedal,
  faPaperPlane,
  faPoll,
  faRetweet,
  faRocket,
  faTicket,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Footer from "@/components/Footer";
import CarouselComponent from "@/components/Carousel";
import Head from "next/head";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppIcon";

export default function Landing() {
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
                    CONGRESO NACIONAL DE MARKETING POLÍTICO – COLOMBIA 2023
                  </h1>
                  <p className="mt-4 text-lg text-justify text-gray-300">
                    El Congreso Nacional de Marketing político, reúne a los
                    principales estrategas y consultores de la comunicación y el
                    marketing político en Colombia, con el fin de orientar a
                    candidatos, asesores, investigadores y estudiantes
                    universitarios, y partidos políticos interesados en conocer
                    las últimas tendencias en estrategia y comunicación política
                    para ganar elecciones.
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
              <a
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
              </a>

              <a
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
              </a>
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
                    src={process.env.NEXT_PUBLIC_URL + "images/agenda.png"}
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
                {/* <img
                  alt="..."
                  className="max-w-full rounded-lg shadow-lg"
                  src={process.env.NEXT_PUBLIC_URL + "images/paneles.jpeg"}
                /> */}
                <CarouselComponent />
              </div>
              <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
                <div className="md:pr-12">
                  {/* <div className="text-pink-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-pink-300">
                    <FontAwesomeIcon icon={faRocket} />
                  </div> */}
                  <h3 className="text-3xl font-semibold">PANELES DE DEBATE</h3>
                  {/* <p className="mt-4 text-lg leading-relaxed text-gray-600">
                    The extension comes with three pre-built pages to help you
                    get started faster. You can change the text and images and
                    youre good to go.
                  </p> */}
                  <ul className="list-none mt-6">
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">
                            ¿Cómo construir una campaña victoriosa?
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">
                            La construcción de la organización electoral de la
                            campaña política.
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">El día ‘E’</h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />{" "}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">
                            El papel del programa de gobierno en la campaña
                            electoral
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />{" "}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">
                            El costo de perder una elección
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />{" "}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">
                            La fotografía política; clave para la victoria.
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />{" "}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">
                            Cómo convertir hechos en noticia.
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />{" "}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">
                            El secreto para una campaña ganadora.
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />{" "}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">
                            Diseño de la estrategia general.
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />{" "}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">
                            El marketing digital en política.
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                            <FontAwesomeIcon icon={faPaperPlane} />{" "}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-600">
                            El poder de las ideas en la campaña política.
                          </h4>
                        </div>
                      </div>
                    </li>
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
            <div className="flex flex-wrap mb-12">
              <a
                href={process.env.NEXT_PUBLIC_URL + "profile/victor-vargas"}
                className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
              >
                <div className="px-6">
                  <img
                    alt="..."
                    src={
                      process.env.NEXT_PUBLIC_URL + "images/victor-vargas.jpg"
                    }
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "120px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">Víctor Vargas Vega</h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      ‘Neuropolítica: Influyendo masas’
                    </p>
                    {/* <div className="mt-6">
                      <button
                        className="bg-blue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <i className="fab fa-twitter"></i>
                      </button>
                      <button
                        className="bg-blue-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </button>
                      <button
                        className="bg-pink-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <i className="fab fa-dribbble"></i>
                      </button>
                    </div> */}
                  </div>
                </div>
              </a>

              <a
                href={process.env.NEXT_PUBLIC_URL + "profile/angel-beccassino"}
                className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
              >
                <div className="px-6">
                  <img
                    alt="..."
                    src={
                      process.env.NEXT_PUBLIC_URL +
                      "images/angel-beccassino.jpg"
                    }
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "120px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">Ángel Beccassino</h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      ‘La construcción de una candidatura ganadora’
                    </p>
                    {/* <div className="mt-6">
                      <button
                        className="bg-blue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <i className="fab fa-twitter"></i>
                      </button>
                      <button
                        className="bg-blue-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </button>
                      <button
                        className="bg-pink-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <i className="fab fa-dribbble"></i>
                      </button>
                    </div> */}
                  </div>
                </div>
              </a>

              <a
                href={process.env.NEXT_PUBLIC_URL + "profile/jorge-salim"}
                className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
              >
                <div className="px-6">
                  <img
                    alt="..."
                    src={process.env.NEXT_PUBLIC_URL + "images/jorge-salim.jpg"}
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "120px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">Jorge Salim Eljach</h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      ‘10 reglas infalibles para ganar la elección’
                    </p>
                    <div className="mt-6">
                      <a
                        href="https://www.facebook.com/salim.eljach"
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
                      </a>
                      <a
                        href="https://instagram.com/jorgesalim_"
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
                      </a>
                      <a
                        className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none  mr-1 mb-1"
                        href="https://twitter.com/salimeljach"
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
                      </a>
                    </div>
                  </div>
                </div>
              </a>

              <a
                href={process.env.NEXT_PUBLIC_URL + "profile/darmi-fuentes"}
                className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
              >
                <div className="px-6">
                  <img
                    alt="..."
                    src={
                      process.env.NEXT_PUBLIC_URL + "images/darmi-fuentes.jpg"
                    }
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "120px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">Darmi Fuentes</h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      ‘El poder de las ideas en una campaña política’
                    </p>
                    {/* <div className="mt-6">
                      <button
                        className="bg-red-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <i className="fab fa-google"></i>
                      </button>
                      <button
                        className="bg-blue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <i className="fab fa-twitter"></i>
                      </button>
                      <button
                        className="bg-gray-800 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <i className="fab fa-instagram"></i>
                      </button>
                    </div> */}
                  </div>
                </div>
              </a>
            </div>

            <div className="flex flex-wrap mb-12">
              <a
                href={process.env.NEXT_PUBLIC_URL + "profile/jorge-sandoval"}
                className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
              >
                <div className="px-6">
                  <img
                    alt="..."
                    src={
                      process.env.NEXT_PUBLIC_URL + "images/jorge-sandoval.jpg"
                    }
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "120px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">Jorge Sandoval</h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      ‘Fotografía del candidato: Lo que más se ve y menos se
                      cuida’
                    </p>
                    <div className="mt-6">
                      {/* <a
                        href="https://www.facebook.com/salim.eljach"
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
                      </a> */}
                      <a
                        href="https://instagram.com/jorgesandoval_fotografia"
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
                      </a>
                      <a
                        className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none  mr-1 mb-1"
                        href="https://twitter.com/jorgesandoval_s"
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
                      </a>
                    </div>
                  </div>
                </div>
              </a>

              <a
                href={process.env.NEXT_PUBLIC_URL + "profile/jamer-chica"}
                className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
              >
                <div className="px-6">
                  <img
                    alt="..."
                    src={process.env.NEXT_PUBLIC_URL + "images/jamer-chica.jpg"}
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "120px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">Jamer Chica</h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      ‘El secreto de la victoria electoral’
                    </p>
                    <div className="mt-6">
                      <a
                        href="https://www.facebook.com/jamerchica"
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
                      </a>
                      <a
                        href="https://instagram.com/jamerchica"
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
                      </a>
                      <a
                        className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none  mr-1 mb-1"
                        href="https://twitter.com/jamerchica"
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
                      </a>
                    </div>
                  </div>
                </div>
              </a>

              <a
                href={process.env.NEXT_PUBLIC_URL + "profile/robison-castillo"}
                className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
              >
                <div className="px-6">
                  <img
                    alt="..."
                    src={
                      process.env.NEXT_PUBLIC_URL +
                      "images/robison-castillo.jpg"
                    }
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "120px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">
                      Robinson Castillo Charris
                    </h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      ‘Marketing Mediático: Cómo hacer que los hechos de la
                      campaña se hagan noticia’
                    </p>
                    <div className="mt-6">
                      <a
                        href="https://www.facebook.com/robincastillo"
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
                      </a>
                      <a
                        href="https://instagram.com/robincastillo"
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
                      </a>
                      <a
                        className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none  mr-1 mb-1"
                        href="https://twitter.com/robincastillo"
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
                      </a>
                    </div>
                  </div>
                </div>
              </a>

              <a
                href={
                  process.env.NEXT_PUBLIC_URL + "profile/cristian-baracaldo"
                }
                className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
              >
                <div className="px-6">
                  <img
                    alt="..."
                    src={
                      process.env.NEXT_PUBLIC_URL +
                      "images/cristian-baracaldo.jpg"
                    }
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "120px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">Cristian Baracaldo</h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      ‘Cómo crear contenido digital estratégico y expansión de
                      pauta para ganar campañas’
                    </p>
                    <div className="mt-6">
                      <a
                        href="https://www.facebook.com/cris.baracaldo"
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
                      </a>
                      <a
                        href="https://instagram.com/cris.baracaldo"
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
                      </a>
                      {/* <a
                        className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none  mr-1 mb-1"
                        href="https://twitter.com/salimeljach"
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
                      </a> */}
                      <a
                        href="https://tiktok.com/cris.baracaldo"
                        className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 50 50"
                          className="w-8 h-8"
                        >
                          {" "}
                          <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
                        </svg>
                      </a>
                      {/* <a
                        href="https://instagram.com/cris.baracaldo"
                        className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          className="w-8 h-8"
                        >
                          <path
                            fill="#455A64"
                            d="M14.539 6h2.125l1.37 5.496h.133l1.308-5.493h2.147l-2.458 8.036V20h-2.112v-5.703L14.539 6zM21.525 11.923c0-.784.254-1.411.759-1.874.504-.466 1.182-.7 2.035-.7.778 0 1.413.245 1.908.737.495.488.743 1.121.743 1.894v5.235c0 .866-.242 1.548-.728 2.044C25.756 19.753 25.09 20 24.235 20c-.823 0-1.477-.259-1.974-.767-.493-.508-.738-1.194-.738-2.055v-5.256H21.525zM23.455 17.368c0 .275.066.494.205.646.132.15.322.226.571.226.255 0 .454-.077.604-.234.149-.151.226-.366.226-.638v-5.522c0-.22-.079-.399-.231-.536-.151-.135-.352-.205-.599-.205-.229 0-.417.07-.561.205-.143.137-.215.316-.215.536V17.368zM33.918 9.605V20h-1.875v-1.266c-.346.414-.705.728-1.081.941C30.59 19.89 30.227 20 29.876 20c-.435 0-.76-.149-.981-.452-.221-.3-.329-.751-.329-1.357V9.605h1.874v7.886c0 .236.04.41.12.519.075.104.207.162.38.162.141 0 .315-.071.522-.215.213-.141.406-.324.581-.544V9.605H33.918z"
                          />
                          <path
                            fill="#FFF"
                            d="M38.799,26.439c0-2.342-1.94-4.24-4.329-4.24c-3.412-0.143-6.905-0.203-10.47-0.198c-3.563-0.005-7.056,0.056-10.47,0.198c-2.387,0-4.327,1.898-4.327,4.24C9.061,28.291,8.995,30.145,9,32.001c-0.005,1.853,0.06,3.707,0.204,5.561c0,2.345,1.938,4.243,4.326,4.243c3.414,0.14,6.907,0.2,10.47,0.195c3.564,0.008,7.058-0.056,10.47-0.195c2.389,0,4.329-1.898,4.329-4.243c0.142-1.854,0.209-3.708,0.201-5.561C39.008,30.145,38.941,28.291,38.799,26.439z"
                          />
                          <g>
                            <path
                              fill="#F44336"
                              d="M33.851 30.346c-.219 0-.368.058-.458.18-.064.091-.145.299-.145.752v.774h1.193v-.774c0-.446-.083-.655-.151-.757C34.205 30.402 34.061 30.346 33.851 30.346zM26.865 30.386c-.086.042-.17.105-.258.193v5.876c.11.111.217.191.316.242.111.055.224.08.346.08.231 0 .303-.091.326-.123.057-.071.119-.219.119-.54v-5.005c0-.278-.053-.493-.152-.625C27.428 30.306 27.164 30.236 26.865 30.386z"
                            />
                            <path
                              fill="#F44336"
                              d="M38.799,26.439c0-2.342-1.94-4.24-4.329-4.24c-3.412-0.143-6.905-0.203-10.47-0.198c-3.563-0.005-7.056,0.056-10.47,0.198c-2.387,0-4.327,1.898-4.327,4.24C9.061,28.291,8.995,30.145,9,32.001c-0.005,1.853,0.06,3.707,0.204,5.561c0,2.345,1.938,4.243,4.326,4.243c3.414,0.14,6.907,0.2,10.47,0.195c3.564,0.008,7.058-0.056,10.47-0.195c2.389,0,4.329-1.898,4.329-4.243c0.142-1.854,0.209-3.708,0.201-5.561C39.008,30.145,38.941,28.291,38.799,26.439z M15.701,38.382c0,0.111-0.092,0.204-0.206,0.204h-2.049c-0.114,0-0.206-0.093-0.206-0.204v-11.03h-1.914c-0.113,0-0.205-0.092-0.205-0.203v-1.904c0-0.112,0.092-0.204,0.205-0.204h6.291c0.114,0,0.206,0.092,0.206,0.204v1.904c0,0.111-0.091,0.203-0.206,0.203h-1.916V38.382z M22.995,38.382c0,0.111-0.092,0.204-0.206,0.204h-1.822c-0.114,0-0.206-0.093-0.206-0.204v-0.551c-0.243,0.233-0.486,0.418-0.738,0.56c-0.397,0.227-0.776,0.336-1.16,0.336c-0.488,0-0.864-0.176-1.117-0.517c-0.238-0.324-0.361-0.803-0.361-1.421v-8.1c0-0.112,0.092-0.204,0.207-0.204h1.821c0.114,0,0.206,0.092,0.206,0.204v7.428c0,0.244,0.044,0.343,0.072,0.382c0.013,0.017,0.05,0.067,0.205,0.067c0.052,0,0.172-0.022,0.389-0.169c0.176-0.115,0.334-0.259,0.473-0.425v-7.283c0-0.112,0.092-0.204,0.207-0.204h1.821c0.114,0,0.206,0.092,0.206,0.204v9.692H22.995z M30,36.373c0,0.736-0.159,1.31-0.473,1.708c-0.326,0.418-0.797,0.626-1.398,0.626c-0.383,0-0.733-0.077-1.046-0.233c-0.166-0.083-0.327-0.191-0.479-0.325v0.233c0,0.114-0.093,0.204-0.206,0.204h-1.837c-0.114,0-0.207-0.09-0.207-0.204v-13.14c0-0.112,0.092-0.203,0.207-0.203h1.837c0.113,0,0.206,0.091,0.206,0.203v3.717c0.15-0.136,0.31-0.25,0.474-0.343c0.309-0.17,0.625-0.256,0.941-0.256c0.641,0,1.143,0.238,1.484,0.706c0.328,0.45,0.495,1.101,0.495,1.933L30,36.373L30,36.373z M36.729,33.765c0,0.113-0.093,0.205-0.207,0.205h-3.273v1.621c0,0.592,0.082,0.845,0.148,0.951c0.053,0.088,0.152,0.199,0.438,0.199c0.23,0,0.388-0.055,0.469-0.164c0.037-0.058,0.139-0.28,0.139-0.988v-0.675c0-0.114,0.093-0.204,0.207-0.204h1.872c0.114,0,0.205,0.09,0.205,0.204v0.729c0,1.044-0.249,1.844-0.737,2.384c-0.49,0.543-1.23,0.82-2.198,0.82c-0.872,0-1.574-0.296-2.079-0.871c-0.5-0.571-0.755-1.354-0.755-2.333v-4.352c0-0.892,0.278-1.63,0.83-2.196c0.55-0.568,1.274-0.857,2.144-0.857c0.89,0,1.587,0.271,2.072,0.803c0.48,0.526,0.724,1.284,0.724,2.251v2.474H36.729z"
                            />
                          </g>
                        </svg>
                      </a> */}
                      <a
                        href="https://linkedin.com/crisbaracaldo"
                        className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#0288D1"
                            d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                          />
                          <path
                            fill="#FFF"
                            d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            <div className="flex flex-wrap">
              <a
                href={process.env.NEXT_PUBLIC_URL + "profile/adelina-covo"}
                className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
              >
                <div className="px-6">
                  <img
                    alt="..."
                    src={
                      process.env.NEXT_PUBLIC_URL + "images/adelina-covo.jpg"
                    }
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "120px" }}
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">Adelina Covo</h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      ‘Cómo blindar una elección’
                    </p>
                    <div className="mt-6">
                      <a
                        href="https://www.facebook.com/LasHistoriasDeAdelina"
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
                      </a>
                      <a
                        className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none  mr-1 mb-1"
                        href="https://twitter.com/adelina_covo"
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
                      </a>
                      <a
                        className="inline-block w-8 h-8 rounded-full outline-none focus:outline-none  mr-1 mb-1"
                        href="https://www.youtube.com/@NuestraHistoria"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          className="w-8 w-8"
                        >
                          <path
                            fill="#455A64"
                            d="M14.539 6h2.125l1.37 5.496h.133l1.308-5.493h2.147l-2.458 8.036V20h-2.112v-5.703L14.539 6zM21.525 11.923c0-.784.254-1.411.759-1.874.504-.466 1.182-.7 2.035-.7.778 0 1.413.245 1.908.737.495.488.743 1.121.743 1.894v5.235c0 .866-.242 1.548-.728 2.044C25.756 19.753 25.09 20 24.235 20c-.823 0-1.477-.259-1.974-.767-.493-.508-.738-1.194-.738-2.055v-5.256H21.525zM23.455 17.368c0 .275.066.494.205.646.132.15.322.226.571.226.255 0 .454-.077.604-.234.149-.151.226-.366.226-.638v-5.522c0-.22-.079-.399-.231-.536-.151-.135-.352-.205-.599-.205-.229 0-.417.07-.561.205-.143.137-.215.316-.215.536V17.368zM33.918 9.605V20h-1.875v-1.266c-.346.414-.705.728-1.081.941C30.59 19.89 30.227 20 29.876 20c-.435 0-.76-.149-.981-.452-.221-.3-.329-.751-.329-1.357V9.605h1.874v7.886c0 .236.04.41.12.519.075.104.207.162.38.162.141 0 .315-.071.522-.215.213-.141.406-.324.581-.544V9.605H33.918z"
                          />
                          <path
                            fill="#FFF"
                            d="M38.799,26.439c0-2.342-1.94-4.24-4.329-4.24c-3.412-0.143-6.905-0.203-10.47-0.198c-3.563-0.005-7.056,0.056-10.47,0.198c-2.387,0-4.327,1.898-4.327,4.24C9.061,28.291,8.995,30.145,9,32.001c-0.005,1.853,0.06,3.707,0.204,5.561c0,2.345,1.938,4.243,4.326,4.243c3.414,0.14,6.907,0.2,10.47,0.195c3.564,0.008,7.058-0.056,10.47-0.195c2.389,0,4.329-1.898,4.329-4.243c0.142-1.854,0.209-3.708,0.201-5.561C39.008,30.145,38.941,28.291,38.799,26.439z"
                          />
                          <g>
                            <path
                              fill="#F44336"
                              d="M33.851 30.346c-.219 0-.368.058-.458.18-.064.091-.145.299-.145.752v.774h1.193v-.774c0-.446-.083-.655-.151-.757C34.205 30.402 34.061 30.346 33.851 30.346zM26.865 30.386c-.086.042-.17.105-.258.193v5.876c.11.111.217.191.316.242.111.055.224.08.346.08.231 0 .303-.091.326-.123.057-.071.119-.219.119-.54v-5.005c0-.278-.053-.493-.152-.625C27.428 30.306 27.164 30.236 26.865 30.386z"
                            />
                            <path
                              fill="#F44336"
                              d="M38.799,26.439c0-2.342-1.94-4.24-4.329-4.24c-3.412-0.143-6.905-0.203-10.47-0.198c-3.563-0.005-7.056,0.056-10.47,0.198c-2.387,0-4.327,1.898-4.327,4.24C9.061,28.291,8.995,30.145,9,32.001c-0.005,1.853,0.06,3.707,0.204,5.561c0,2.345,1.938,4.243,4.326,4.243c3.414,0.14,6.907,0.2,10.47,0.195c3.564,0.008,7.058-0.056,10.47-0.195c2.389,0,4.329-1.898,4.329-4.243c0.142-1.854,0.209-3.708,0.201-5.561C39.008,30.145,38.941,28.291,38.799,26.439z M15.701,38.382c0,0.111-0.092,0.204-0.206,0.204h-2.049c-0.114,0-0.206-0.093-0.206-0.204v-11.03h-1.914c-0.113,0-0.205-0.092-0.205-0.203v-1.904c0-0.112,0.092-0.204,0.205-0.204h6.291c0.114,0,0.206,0.092,0.206,0.204v1.904c0,0.111-0.091,0.203-0.206,0.203h-1.916V38.382z M22.995,38.382c0,0.111-0.092,0.204-0.206,0.204h-1.822c-0.114,0-0.206-0.093-0.206-0.204v-0.551c-0.243,0.233-0.486,0.418-0.738,0.56c-0.397,0.227-0.776,0.336-1.16,0.336c-0.488,0-0.864-0.176-1.117-0.517c-0.238-0.324-0.361-0.803-0.361-1.421v-8.1c0-0.112,0.092-0.204,0.207-0.204h1.821c0.114,0,0.206,0.092,0.206,0.204v7.428c0,0.244,0.044,0.343,0.072,0.382c0.013,0.017,0.05,0.067,0.205,0.067c0.052,0,0.172-0.022,0.389-0.169c0.176-0.115,0.334-0.259,0.473-0.425v-7.283c0-0.112,0.092-0.204,0.207-0.204h1.821c0.114,0,0.206,0.092,0.206,0.204v9.692H22.995z M30,36.373c0,0.736-0.159,1.31-0.473,1.708c-0.326,0.418-0.797,0.626-1.398,0.626c-0.383,0-0.733-0.077-1.046-0.233c-0.166-0.083-0.327-0.191-0.479-0.325v0.233c0,0.114-0.093,0.204-0.206,0.204h-1.837c-0.114,0-0.207-0.09-0.207-0.204v-13.14c0-0.112,0.092-0.203,0.207-0.203h1.837c0.113,0,0.206,0.091,0.206,0.203v3.717c0.15-0.136,0.31-0.25,0.474-0.343c0.309-0.17,0.625-0.256,0.941-0.256c0.641,0,1.143,0.238,1.484,0.706c0.328,0.45,0.495,1.101,0.495,1.933L30,36.373L30,36.373z M36.729,33.765c0,0.113-0.093,0.205-0.207,0.205h-3.273v1.621c0,0.592,0.082,0.845,0.148,0.951c0.053,0.088,0.152,0.199,0.438,0.199c0.23,0,0.388-0.055,0.469-0.164c0.037-0.058,0.139-0.28,0.139-0.988v-0.675c0-0.114,0.093-0.204,0.207-0.204h1.872c0.114,0,0.205,0.09,0.205,0.204v0.729c0,1.044-0.249,1.844-0.737,2.384c-0.49,0.543-1.23,0.82-2.198,0.82c-0.872,0-1.574-0.296-2.079-0.871c-0.5-0.571-0.755-1.354-0.755-2.333v-4.352c0-0.892,0.278-1.63,0.83-2.196c0.55-0.568,1.274-0.857,2.144-0.857c0.89,0,1.587,0.271,2.072,0.803c0.48,0.526,0.724,1.284,0.724,2.251v2.474H36.729z"
                            />
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </a>
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
