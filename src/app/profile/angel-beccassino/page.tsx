"use client";

import Navbar from "../../../components/navbar";
import Footer from "../../../components/Footer";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faHandPointUp,
  faLifeRing,
  faUniversity,
} from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  return (
    <>
      <Navbar transparent />
      <main className="profile-page">
        <section className="relative block" style={{ height: "500px" }}>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}images/bground.jpg')`,
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
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
        </section>
        <section className="relative py-16 bg-gray-300">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-6/12 text-center px-4 lg:order-1 flex justify-center mt-10">
                    <div className="relative">
                      <img
                        alt="..."
                        src={
                          process.env.NEXT_PUBLIC_URL +
                          "images/angel-beccassino.jpg"
                        }
                        className="shadow-lg rounded-full max-w-full mx-auto"
                        style={{ maxWidth: "120px" }}
                      />
                      <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                        Angel Beccassino
                      </h3>
                      <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                        <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
                        ‘La construcción de una candidatura ganadora’.
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 lg:order-2">
                    <div className="text-center py-4 lg:pt-4 pt-8">
                      <div className="block mb-2 text-gray-700 mt-10 mb-4">
                        <FontAwesomeIcon icon={faUniversity} className="mr-2" />
                        SUBTEMAS
                      </div>
                      <div className="block text-gray-500">
                        <ul className="mb-6">
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            La lectura del escenario
                          </li>
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            La definición de agenda
                          </li>
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            El diseño de la estrategia
                          </li>
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            La estructura operativa
                          </li>
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            Las tácticas al interior de la estrategia
                          </li>
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            El control de escenarios de crisis
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-12">
                  {/* <div className="mb-2 text-gray-700 mt-10">
                    <i className="fas fa-briefcase mr-2 text-lg text-gray-500"></i>
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div className="mb-2 text-gray-700">
                    <i className="fas fa-university mr-2 text-lg text-gray-500"></i>
                    University of Computer Science
                  </div> */}
                </div>
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <div className="mb-2 text-gray-700">
                        <i className="fas fa-university mr-2 text-lg text-gray-500 font-bold"></i>
                        HOJA DE VIDA
                      </div>
                      <ul className="mb-6 text-justify text-gray-500">
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Estudió economía y filosofía en la Universidad
                          Nacional de Buenos Aires.{" "}
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Estratega de comunicación.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Creador de campañas para empresas, medios de
                          comunicación, proyectos políticos y gobiernos en
                          países de América Latina.{" "}
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Ha trabajado en la comunicación de gestión de
                          gobiernos, empresas y campañas de candidatos políticos
                          en Argentina, México, Colombia, Brasil, Venezuela,
                          Bolivia, Ecuador, entre otros países, y es autor de
                          una decena de libros sobre posicionamiento de ciudades
                          y marketing político electoral.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Es conferencista habitual en Cumbres Mundiales de
                          Comunicación Política y de Marketing de Gobierno, así
                          como conferencista invitado en universidades de España
                          y Latinoamérica, y co-autor del libro sobre
                          comunicación política premiado en los Victory Awards
                          2016, de la Washington Academy of Political Arts and
                          Sciences.
                        </li>
                      </ul>

                      <div className="mb-2 text-gray-700">
                        <i className="fas fa-university mr-2 text-lg text-gray-500 font-bold"></i>
                        CAMPAÑAS
                      </div>
                      <ul className="mb-6 text-justify text-gray-500">
                        <li>
                          <FontAwesomeIcon icon={faBullhorn} className="mr-2" />{" "}
                          Estratega de comunicación de la segunda vuelta
                          electoral en la que ganó la reelección presidencial
                          Juan Manuel Santos.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faBullhorn} className="mr-2" />{" "}
                          Estratega de la primera y segunda vuelta de Gustavo
                          Petro en 2018.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faBullhorn} className="mr-2" />{" "}
                          Estratega de la primera y segunda vuelta de Rodolfo
                          Hernández en 2022.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faBullhorn} className="mr-2" />{" "}
                          Estratega, asesor o consultor en decenas de campañas
                          presidenciales, de alcaldías, gobernaciones y para el
                          Senado y Cámara de Representantes, así como de
                          plebiscitos y referendos en Colombia, Venezuela,
                          Bolivia, Ecuador, Perú, Nicaragua y Bolivia.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faBullhorn} className="mr-2" />{" "}
                          Estratega del posicionamiento del Polo Democrático
                          desde su creación y durante sus cinco primeros años, y
                          de las campañas que produjeron triunfos de sus
                          candidatos al Congreso de Colombia y a la Alcaldía de
                          Bogotá (Luis Eduardo Garzón, 2002).
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faBullhorn} className="mr-2" />{" "}
                          Estratega de la reingeniería del Partido de la U,
                          partido de gobierno durante el segundo gobierno de
                          Juan Manuel Santos. Consultor estratégico del MAS,
                          partido de gobierno en Bolivia, en la primera campaña
                          presidencial de Evo Morales y en la última campaña
                          presidencial de Luis Arce.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
