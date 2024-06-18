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
    nombre: "Darmi Fuentes",
    alt: "darmi-fuentes",
    titulo: "‘La construcción arquetípica del discurso político’",
    formacion: [
      "Comunicador social y periodista de la Universidad Autónoma de Bucaramanga, Grado Cum Laude",
      "Curso de formación permanente en teoría política de la Universidad de Salamanca, agosto - noviembre de 2012",
      "Maestría en Ciencia Política de la Universidad Autónoma de Bucaramanga",
      "Tesis meritoria: Relaciones de poder, diez caras de la influencia de Ecopetrol y el Proyecto de Modernización de la Refinería de Barrancabermeja",
      "Otras áreas de formación: Semiología, Marketing político, Opinión pública",
    ],
    experiencias: [
      "Consultor Independiente, desde marzo de 2017",
      "Enlace institucional de la UIS en Bogotá. Capitol Consulting, agosto – noviembre de 2022",
      "Asesor de proyectos especiales. Corporación Kairos, abril de 2020 – julio 2022",
      "Líder Social. Formulación del Plan de Convivencia y Seguridad de Cantagallo, Bolívar",
      "Consultor en Global Resourcing Colombia, Bogotá",
      "- Asesor para la comunicación y generación de nuevos productos. Trair Colombia S.A.",
      "- Tallerista de vocería ante medios de comunicación para directivos de la Cámara de Comercio. Corporación de Periodistas de Santander",
      "- Jefe Oficina de Información y Prensa. Cámara de Representantes – Congreso de la República, septiembre 2016 – febrero 2017",
      "Consultor Aquilae et Rhinos Consultores S.A.S",
      "- Asesor estratégico Alcaldía de Barrancabermeja, enero - junio de 2016",
      "- Redactor principal de la Estrategia de la Santandereanidad, mayo - julio de 2016",
      "Docente universitario en UNAB y UNAD",
      "Consultor NSG S.A.S. Bogotá, mayo - noviembre de 2013",
      "Asesor Asamblea de Santander, enero - noviembre de 2012",
      "- Asesor Despacho de la Presidencia, diciembre de 2012",
      "- Asesor Oficina de comunicaciones, diciembre de 2013 - octubre de 2014",
      "- Asesor Convenio Aseduis",
      "Asesor de comunicaciones, Despacho del Gobernador de Santander, periodo constitucional 2008 – 2011",
      "Asesor externo permanente, Instituto de Altos Estudios para el Desarrollo Municipal – IDEM, Bucaramanga, enero 2005 – mayo de 2006",
    ],
    publicaciones: [
      "Estrategia de la Santandereanidad, Centro Cultural del Oriente Bucaramanga, julio de 2016",
    ],
    redesSociales: {
      Facebook: "https://www.facebook.com/darmi.fuentes?mibextid=LQQJ4d",
      Instagram:
        "https://www.instagram.com/darmi_fuentes/?utm_source=ig_web_button_share_sheet",
    },
  };

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
                      {conferencista.roles && conferencista.roles.length > 0 && (
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
