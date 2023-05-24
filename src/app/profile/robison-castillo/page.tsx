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
                          "images/robison-castillo.jpg"
                        }
                        className="shadow-lg rounded-full max-w-full mx-auto"
                        style={{ maxWidth: "120px" }}
                      />
                      <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                        Robinson Castillo Charris
                      </h3>
                      <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                        <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
                        ‘Marketing Mediático: Cómo hacer que los hechos de la
                        campaña se hagan noticia’
                      </div>
                    </div>
                  </div>
                  {/* <div className="w-full lg:w-6/12 px-4 lg:order-2">
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
                  </div> */}
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
                        HOJA DE VIDA{" "}
                      </div>
                      <ul className="mb-6 text-justify text-gray-500">
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Comunicador Social-Periodista de la Universidad
                          Autónoma del Caribe de Barranquilla.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Maestría en Comunicación Política de la Universidad
                          Externado de Colombia.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Consultor internacional en Comunicación Parlamentaria.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Columnista de la revista digital KienyKe.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Escritor y convencido de la acción mediática
                          reiterada, como método esencial del posicionamiento de
                          marcas.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Ex director de comunicaciones de la Cámara de
                          Representantes, Senado de la República.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Ex asesor en comunicaciones del Concejo de Bogotá.
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
