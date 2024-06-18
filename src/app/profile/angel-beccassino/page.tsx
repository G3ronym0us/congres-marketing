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
    nombre: "ÁNGEL BECCASSINO",
    alt: "angel-beccassino",
    titulo: "‘2026: ¿Qué hay que hacer para ganar?’",
    descripcion: "Estratega de comunicación, creador de campañas para empresas, medios de comunicación, proyectos políticos y gobiernos en países de América Latina. Ha trabajado para gobiernos, empresas y campañas de candidatos políticos en Argentina, México, Colombia, Brasil, Venezuela, Bolivia, Ecuador, entre otros países, y es autor de una decena de libros sobre posicionamiento de ciudades y marketing político electoral, entre ellos “Los Estados Unidos de Trump”, en el que predijo el resultado de las elecciones presidenciales estadounidenses en que triunfó el candidato republicano. \n Es conferencista habitual en Cumbres Mundiales de Comunicación Política y de Marketing de Gobierno, así como conferencista invitado en universidades de España y Latinoamérica, y co-autor del libro sobre comunicación política premiado en los Victory Awards 2016, de la Washington Academy of Political Arts and Sciences. Es autodidacta, con estudios de ciencias económicas y filosofía en la Universidad de Buenos Aires, sin graduación, y publicista honoris causa de la Universidad Latina (Unilatina, Colombia).",
    roles: [
        "Estratega de la renovación de posicionamiento del Partido Conservador en Colombia con énfasis en jóvenes y con relación al tema medioambiental, durante la presidencia del partido por Carlos Holguín Sardi",
        "Estratega de la reingeniería del Partido de la U, partido de tres de los últimos cuatro gobiernos de Colombia",
        "Asesor estratégico del MAS, partido de gobierno en Bolivia",
        "Estratega de la segunda vuelta electoral en que ganó la reelección presidencial Juan Manuel Santos, posicionándolo en el liderazgo de Paz que posteriormente le valió el reconocimiento como Premio Nóbel de Paz",
        "Estratega de la consulta para la candidatura presidencial de partidos y movimientos de izquierda, y luego del triunfo en dicha consulta, de la primera y segunda vuelta de Gustavo Petro en Colombia, durante 2018",
        "Estratega, asesor o consultor, de decenas de campañas políticas electorales, que incluyen presidenciales, de alcaldías, gobernaciones y para el Senado y Cámara de Representantes, así como de plebiscitos y referendos en Colombia, Venezuela, Ecuador y Bolivia"
    ],
    publicaciones: [
        "El laberinto de la paz, Ediciones B (actual sello de Penguin/Random House), Bogotá, 2015",
        "Room Service, Aguilar, Bogotá, 2013 y Penguin Random House, USA, 2013",
        "Cómo funcionan las cosas, con Alex Vernot, Ediciones B (actual sello de Penguin/Random House), Bogotá, 2011",
        "Cómo ganar cuando todos pierden. La Crisis como Oportunidad, con Fernando Vásquez, Planeta, Bogotá, 2009",
        "La Nueva Política, Grijalbo Mondadori (actual Penguin/Random House), Bogotá, 2008",
        "El Precio del Poder. Cómo se vende la imagen de un político. Aguilar (actual Penguin/Random House), Bogotá, 2005",
        "El Triunfo de Lucho y Pablo, o la Derrota de las Maquinarias. Grijalbo Mondadori (actual Penguin/Random House), Bogotá, 2003",
        "Peñalosa y una ciudad 2600 metros más cerca de las estrellas. Grijalbo Mondadori (actual Penguin/Random House), Bogotá, 2000"
    ],
    redesSociales: {
        Instagram: "https://www.instagram.com/beccassino?igsh=dG9uaDc1enc3OWZ5",
        X: "https://x.com/beccassino?s=11"
    }
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
                      {conferencista.roles.length > 0 && (
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
                      {conferencista.premios && conferencista.premios.length > 0 && (
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
                      {conferencista.publicaciones && conferencista.publicaciones.length > 0 && (
                        <>
                          <div className="mb-2 text-gray-700">
                            <i className="fas fa-university mr-2 text-lg text-gray-500 font-bold"></i>
                            PUBLICACIONES
                          </div>
                          <ul className="mb-6 text-justify text-gray-500">
                            {conferencista.publicaciones?.map((publicacion, index) => (
                              <li key={index}>
                                <FontAwesomeIcon
                                  icon={faBook}
                                  className="mr-2"
                                />
                                {publicacion}
                              </li>
                            ))}
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
