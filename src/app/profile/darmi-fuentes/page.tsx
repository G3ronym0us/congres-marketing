"use client";

import Navbar from "../../../components/navbar";
import Footer from "../../../components/Footer";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBriefcase,
  faBullhorn,
  faHandPointUp,
  faLifeRing,
  faTrophy,
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
                          "images/darmi-fuentes.jpg"
                        }
                        className="shadow-lg rounded-full max-w-full mx-auto"
                        style={{ maxWidth: "120px" }}
                      />
                      <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                        Darmi Fuentes
                      </h3>
                      <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                        <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
                        ‘El poder de las ideas en una campaña política’
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 lg:order-2">
                    <div className="text-center py-4 lg:pt-4 pt-8">
                      <div className="block mb-2 text-gray-700 mt-10 mb-4">
                        <FontAwesomeIcon icon={faUniversity} className="mr-2" />
                        SUBTEMAS
                      </div>
                      <div className="block">
                        <ul className="mb-6">
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            Una idea puede cambiarlo todo.
                          </li>
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            Claves para formular bien un programa.
                          </li>
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            Secretos de la relación entre un candidato y sus
                            aliados: una propuesta común, la agenda compartida y
                            el trabajo colaborativo.
                          </li>
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            Promesa de valor: los candidatos a Concejos y
                            Asambleas también tienen propuesta.
                          </li>
                          <li>
                            <FontAwesomeIcon
                              icon={faHandPointUp}
                              className="mr-2"
                            />
                            Un discurso eficaz, una campaña exitosa.
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
                        FORMACIÓN ACADEMICA
                      </div>
                      <ul className="mb-6 text-justify">
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Comunicador social y periodista de la Universidad
                          Autónoma de Bucaramanga, Grado Cum Laude.
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Curso de formación permanente en teoría política de la
                          Universidad de Salamanca en Agosto - noviembre de
                          2012.
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Maestría en Ciencia Política de la Universidad
                          Autónoma de Bucaramanga.
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Tesis meritoria: Relaciones de poder, diez caras de la
                          influencia de Ecopetrol y el Proyecto de Modernización
                          de la Refinería de Barrancabermeja.
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Otras áreas de formación: Semiología, Marketing
                          político, Opinión pública.
                        </li>
                      </ul>
                      <div className="mb-2 text-gray-700">
                        <i className="fas fa-university mr-2 text-lg text-gray-500 font-bold"></i>
                        EXPERIENCIA LABORAL
                      </div>

                      <ul className="mb-6 text-justify">
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Consultor Independiente. Marzo 2017 - Actualidad
                          <ul>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Enlace institucional de la UIS en Bogotá. Capitol
                              Consulting. Agosto – noviembre de 2022
                            </li>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Asesor de proyectos especiales. Corporación
                              Kairos. Abril de 2020 – julio 2022
                            </li>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Líder Social. Formulación del Plan de Convivencia
                              y Seguridad de Cantagallo, Bolívar
                            </li>
                          </ul>
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Como asesor en Global Resourcing Colombia, Bogotá:
                          <ul>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Asesor para la comunicación y generación de nuevos
                              productos. Trair Colombia S.A. (Empresa de
                              turismo)
                            </li>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Tallerista de vocería ante medios de comunicación
                              para directivos de la Cámara de Comercio.
                              Corporación de Periodistas de Santander
                            </li>
                          </ul>
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Jefe Oficina de Información y Prensa. Cámara de
                          Representantes – Congreso de la República. Septiembre
                          2016 – febrero 2017
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Consultor Aquilae et Rhinos Consultores S.A.S:
                          <ul>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Asesor estratégico Alcaldía de Barrancabermeja.
                              Enero - junio de 2016
                            </li>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Redactor principal de la Estrategia de la
                              Santandereanidad. Mayo - julio de 2016
                            </li>
                          </ul>
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Docente universitario:
                          <ul>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Universidad Autónoma de Bucaramanga, UNAB.
                              Facultad de Comunicación Social y Artes
                              Audiovisuales. Cátedra Periodismo y contexto
                              internacional. Enero - diciembre de 2015
                            </li>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Universidad Nacional Abierta y a Distancia, UNAD.
                              Escuela de Ciencias Sociales, Artes y Humanidades.
                              Tutor de Competencias Comunicativas, febrero -
                              junio de 2019. Y de Cibercultura, Comunicación y
                              Educación e Historia de la Comunicación; noviembre
                              de 2020 – abril de 2021
                            </li>
                          </ul>
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Consultor NSG S.A.S. Bogotá. Investigación y
                          caracterización de actores sociopolíticos de
                          Barrancabermeja. Mayo - noviembre de 2013
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Asesor Asamblea de Santander
                          <ul>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Enero - noviembre de 2012. Despacho de la
                              Presidencia
                            </li>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Diciembre de 2012. Oficina de comunicaciones
                            </li>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Diciembre de 2013 - octubre de 2014. Convenio
                              Aseduis
                            </li>
                          </ul>
                        </li>

                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Asesor de comunicaciones
                          <ul>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Despacho del Gobernador de Santander
                            </li>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Periodo constitucional 2008 – 2011
                            </li>
                          </ul>
                        </li>

                        <li>
                          <FontAwesomeIcon
                            icon={faUniversity}
                            className="mr-2"
                          />{" "}
                          Asesor externo permanente
                          <ul>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Instituto de Altos Estudios para el Desarrollo
                              Municipal – IDEM
                            </li>
                            <li className="ml-8">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />{" "}
                              Bucaramanga, enero 2005 – mayo de 2006
                            </li>
                          </ul>
                        </li>
                      </ul>

                      <div className="mb-2 text-gray-700">
                        <i className="fas fa-university mr-2 text-lg text-gray-500 font-bold"></i>
                        LIBRO
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faBook} />
                        Estrategia de la Santandereanidad Encomendado y
                        publicado por el Centro Cultural del Oriente
                        Bucaramanga, julio de 2016
                      </div>
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
