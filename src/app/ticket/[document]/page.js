"use client"

import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { faChair, faFile, faLifeRing, faTicket, faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {

  const params = useParams();

  const [document, setDocument] = useState('');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDocument(params.document);
  }, [])

  useEffect(() => {
    if (document) {
      setLoading(true)
      const url = process.env.NEXT_PUBLIC_URL + 'api/ticket/' + document
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())
        .then((response) => {
          setTicket(response);
          setLoading(false)
        }).
        catch((error) => {
          console.log(error);
          setLoading(false)

        });
    }
  }, [document])


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
          <div className="container mx-auto px-20">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-6/12 text-center px-4 lg:order-1 flex justify-center mt-10">
                    <div className="relative">
                      <div className="text-3xl leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                        <FontAwesomeIcon icon={faTicket} className="mr-2 text-blue-500" />
                        Consulta de Boleto
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-6">
                </div>
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      {
                        ticket ? (
                          <ul className="mb-6 text-justify text-gray-500">
                            <li className="text-2xl mb-2">
                              <FontAwesomeIcon icon={faUser} className="mr-2" />
                              <span className="font-bold">Nombres: </span>
                              <span>{ticket.name}</span>
                            </li>
                            <li className="text-2xl mb-2">
                              <FontAwesomeIcon icon={faUser} className="mr-2" />
                              <span className="font-bold">Apellidos: </span>
                              <span>{ticket.lastname}</span>
                            </li>
                            <li className="text-2xl mb-2">
                              <FontAwesomeIcon icon={faFile} className="mr-2" />
                              <span className="font-bold">Documento: </span>
                              <span>{ticket.document}</span>
                            </li>
                            <li className="text-2xl mb-2">
                              <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
                              <span className="font-bold">Zona: </span>
                              <span>{ticket.type}</span>
                            </li>
                            <li className="text-2xl mb-2">
                              <FontAwesomeIcon icon={faChair} className="mr-2" />
                              <span className="font-bold">Asiento: </span>
                              <span>{ticket.row + '-' + ticket.number}</span>
                            </li>
                            <li className="text-2xl mb-2">
                              <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
                              <span className="font-bold">Rol: </span>
                              <span>{ticket.role}</span>
                            </li>
                          </ul>
                        ) : (loading ? (
                          <>
                            <div className="text-2xl font-bold">Cargando ...</div>
                          </>
                        ) : (
                          <>
                            <div className="text-3xl font-bold">Este documento no tiene boleto asignado!</div>
                          </>
                        )

                        )
                      }
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
