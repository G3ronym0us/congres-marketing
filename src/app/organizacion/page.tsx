"use client";

import Navbar from "../../components/navbar";
import Footer from "../../components/Footer";
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
                          "images/jose.jpg"
                        }
                        className="shadow-lg rounded-full max-w-full mx-auto"
                        style={{ maxWidth: "150px" }}
                      />
                      <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                        José Guinand
                      </h3>
                      <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                        <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
                        ‘Colombiano’
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-12"></div>
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4 mb-6 text-justify text-gray-500">
                      <div className="mb-2 text-gray-700 text-center">
                        <FontAwesomeIcon icon={faUniversity} className="mr-2" />
                        PERFIL{" "}
                      </div>
                      <p className="mb-4">
                        Manager, estratega y consultor político con más de 10
                        años de experiencia en dirección de campañas
                        electorales, formación y preparación de candidatos,
                        creación de estrategia política y asesor de Gobiernos en
                        comunicación pública.
                      </p>
                      <p className="mb-4">
                        Su tasa de éxito lo ubica como uno de los estrategas más
                        efectivos de la comunicación disruptiva en medios
                        convencionales y digitales.
                      </p>
                      <ul>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Creador y organizador del Congreso Nacional de
                          Marketing Político (Colombia).
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Fundador de la Asociación Nacional de Consultores
                          Políticos ASOCOPOL
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Condecorado con la medalla María Manuela Beltrán,
                          otorgada a la excelencia, por parte de la
                          municipalidad de El Socorro, Santander.
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                          Reconocido como el concejal más jóven de Colombia
                          (2016).
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
