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
import Image from "next/image";
import { Conferencista } from "@/types/conferencista";

export default function Profile() {
  const conferencista: Conferencista = {
    nombre: "Antonio Sola",
    alt: "antonio-sola",
    titulo: "‘La nueva era en la industria del marketing político’",
    descripcion: "Conocido en el mundo de la consultoría política como El creador de presidentes, es hoy uno de los estrategas políticos más destacados y reconocidos a nivel mundial, especialmente en LATAM. Ha participado en más de 500 campañas electorales, en más de 35 países, y ha sido estratega principal en importantes campañas presidenciales ganadoras como la de Juan Manuel Santos (Colombia), Mariano Rajoy (España), Felipe Calderón y Vicente Fox (México), Michel Martelly y Jovenel Moïse (Haití), Lenin Moreno (Ecuador), Otto Pérez Molina (Guatemala), Biram Dahy Abeid (Mauritania), Cyril Ramaphosam, Lindiwe Sisulu (Sudáfrica), y Joseph Boakai (Liberia). Es el impulsor de la Fundación Liderar con Sentido Común, que preside desde sus orígenes en 2019. También es fundador de la Escuela Política Fratelli Tutti (2021).",
    roles: [
      "Estratega Político en Campañas Electorales y Gobiernos",
      "Presidente de la Fundación Liderar con Sentido Común",
      "Fundador de la Escuela Política Fratelli Tutti"
    ],
    premios: [
      "Condecorado con la Cruz de Oficial de la Orden del Mérito Civil, concedida por la Monarquía de España, a propuesta del Gobierno de España en 2011.",
      "Listado USA Top Ten Consultores de habla hispana en Consultoría Política.",
      "Primer español premiado por The Abolition Institute por su compromiso y trabajo contra la esclavitud y por su defensa de los Derechos Humanos en países como Mauritania, Haití y Sudáfrica, galardonado con ‘Aichana Abeid Boilil Award’.",
      "Premio de reconocimiento a la trayectoria en el mundo de la consultoría política en 2020 por la Asociación Latinoamericana de Consultores Políticos (ALACOP).",
      "Embajador Itinerante de Haití para el Desarrollo de Inversiones Internacionales."
    ],
    publicaciones: [
      "Sociedad en jaque, sentido común al rescate (El Viso Media, 2021), publicado por los integrantes del grupo de pensamiento Líderes del Sentido Común.",
      "¿Cómo sobrevivir al mundo que viene? Descubre todo lo que te va a pasar leas o no leas este libro (DEUSTO, 2021), publicado junto con Fernando Carrera.",
      "Hoy hemos perdido dos aptitudes en la política: la de querer conocer y la de querer entender. Para lograr transformar el mundo que vivimos en uno mejor, a través de la política, debemos formarnos en la comprensión."
    ],
    redesSociales: {
      Instagram: "https://www.instagram.com/antoniosola_?igsh=MXRyaXQxbTc1N2VmeA==",
      Facebook: "https://www.facebook.com/AntonioSolaRecheOK?mibextid=LQQJ4d",
      X: "https://x.com/antoniosola_?s=11"
    }
  }
  

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
                      <Image
                        alt={conferencista.nombre}
                        src={`/images/2024/${conferencista.alt}.jpg`}
                        className="shadow-lg rounded-full max-w-full mx-auto"
                        width={120}
                        height={140}
                      />
                      <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                        {conferencista.nombre}
                      </h3>
                      <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                        <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
                        {conferencista.titulo}
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 lg:order-2">
                    <div className="text-center py-4 lg:pt-4 pt-8">
                      {conferencista.roles &&
                        conferencista.roles.length > 0 && (
                          <>
                            <div className="mb-2 text-gray-700 mt-10">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="mr-2"
                              />
                              ROLES
                            </div>

                            <div className="block text-gray-500 mx-14">
                              <ul className="mb-6">
                                {conferencista.roles.map((rol, index) => (
                                  <li key={index}>
                                    <FontAwesomeIcon
                                      icon={faHandPointUp}
                                      className="mr-2"
                                    />
                                    {rol}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                    </div>
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4 text-gray-500">
                      <div className="text-justify mb-4">
                        {conferencista.descripcion}
                      </div>
                      {conferencista.premios &&
                        conferencista.premios.length > 0 && (
                          <>
                            <div className="mb-2 text-gray-700">
                              <i className="fas fa-university mr-2 text-lg text-gray-500 font-bold"></i>
                              PREMIOS
                            </div>
                            <ul className="mb-6 text-justify text-gray-500">
                              {conferencista.premios?.map((premio, index) => (
                                <li key={index}>
                                  <FontAwesomeIcon
                                    icon={faTrophy}
                                    className="mr-2"
                                  />
                                  {premio}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      {conferencista.publicaciones &&
                        conferencista.publicaciones.length > 0 && (
                          <>
                            <div className="mb-2 text-gray-700">
                              <i className="fas fa-university mr-2 text-lg text-gray-500 font-bold"></i>
                              PUBLICACIONES
                            </div>
                            <ul className="mb-6 text-justify text-gray-500">
                              {conferencista.publicaciones?.map(
                                (publicacion, index) => (
                                  <li key={index}>
                                    <FontAwesomeIcon
                                      icon={faBook}
                                      className="mr-2"
                                    />
                                    {publicacion}
                                  </li>
                                )
                              )}
                            </ul>
                          </>
                        )}
                      {conferencista.formacion &&
                        conferencista.formacion.length > 0 && (
                          <>
                            <div className="mb-2 text-gray-700">
                              <i className="fas fa-university mr-2 text-lg text-gray-500 font-bold"></i>
                              FORMACIÓN
                            </div>
                            <ul className="mb-6 text-justify text-gray-500">
                              {conferencista.formacion?.map(
                                (estudio, index) => (
                                  <li key={index}>
                                    <FontAwesomeIcon
                                      icon={faUniversity}
                                      className="mr-2"
                                    />
                                    {estudio}
                                  </li>
                                )
                              )}
                            </ul>
                          </>
                        )}
                      {conferencista.experiencias &&
                        conferencista.experiencias.length > 0 && (
                          <>
                            <div className="mb-2 text-gray-700">
                              <i className="fas fa-university mr-2 text-lg text-gray-500 font-bold"></i>
                              EXPERIENCIA
                            </div>
                            <ul className="mb-6 text-justify text-gray-500">
                              {conferencista.experiencias?.map(
                                (experiencia, index) => (
                                  <li key={index}>
                                    <FontAwesomeIcon
                                      icon={faBullhorn}
                                      className="mr-2"
                                    />
                                    {experiencia}
                                  </li>
                                )
                              )}
                            </ul>
                          </>
                        )}
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
