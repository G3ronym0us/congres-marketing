"use client";

import Navbar from "../../components/navbar";
import Footer from "../../components/Footer";
import React from "react";

export default function LocationsAndPrices() {
  return (
    <>
      <Navbar transparent />
      <main className="locations-page">
        <section className="relative block h-96">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}images/bground.jpg')`,
            }}
          >
            <span className="w-full h-full absolute opacity-60 bg-black"></span>
          </div>
          <div
            className="absolute bottom-0 w-full pointer-events-none overflow-hidden h-28"
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
        <section className="relative py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="text-center mt-12 mb-6">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800">
                    LOCALIDADES Y PRECIOS CNMP 2024
                  </h3>
                </div>
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-8/12 px-4 mb-6 text-justify text-gray-600">
                      <div className="mb-8">
                        <h4 className="text-2xl font-semibold leading-normal mb-2 text-gray-800">
                          LOCALIDAD DIAMANTE: $500.000
                        </h4>
                        <ul className="list-disc list-inside text-left mb-4">
                          <li>Ingreso a todas las jornadas del CNMP 2024.</li>
                          <li>Ingreso al cóctel oficial del CNMP 2024.</li>
                          <li>Meet & Greet con Antonio Sola.</li>
                          <li>Memorias de todo el CNMP 2024 (Material audiovisual).</li>
                          <li>Refrigerios.</li>
                          <li>Libreta y esfero oficial del CNMP 2024.</li>
                          <li>Certificado de participación digital.</li>
                        </ul>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-2xl font-semibold leading-normal mb-2 text-gray-800">
                          LOCALIDAD ORO: $380.000
                        </h4>
                        <ul className="list-disc list-inside text-left mb-4">
                          <li>Ingreso a todas las jornadas del CNMP 2024.</li>
                          <li>Ingreso al cóctel oficial del CNMP 2024.</li>
                          <li>Refrigerios.</li>
                          <li>Libreta y esfero oficial del CNMP 2024.</li>
                          <li>Certificado de participación digital.</li>
                        </ul>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-2xl font-semibold leading-normal mb-2 text-gray-800">
                          LOCALIDAD VIP: $300.000
                        </h4>
                        <ul className="list-disc list-inside text-left mb-4">
                          <li>Ingreso a todas las jornadas del CNMP 2024.</li>
                          <li>Ingreso al cóctel oficial del CNMP 2024.</li>
                          <li>Refrigerios.</li>
                          <li>Libreta y esfero oficial del CNMP 2024.</li>
                          <li>Certificado de participación digital.</li>
                        </ul>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-2xl font-semibold leading-normal mb-2 text-gray-800">
                          LOCALIDAD PLATEA IZQUIERDA Y DERECHA: $250.000
                        </h4>
                        <ul className="list-disc list-inside text-left mb-4">
                          <li>Ingreso a todas las jornadas del CNMP 2024.</li>
                          <li>Ingreso al cóctel oficial del CNMP 2024.</li>
                          <li>Refrigerios.</li>
                          <li>Libreta y esfero oficial del CNMP 2024.</li>
                          <li>Certificado de participación digital.</li>
                        </ul>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-2xl font-semibold leading-normal mb-2 text-gray-800">
                          LOCALIDAD GENERAL: $200.000
                        </h4>
                        <ul className="list-disc list-inside text-left mb-4">
                          <li>Ingreso a todas las jornadas del CNMP 2024.</li>
                          <li>Ingreso al cóctel oficial del CNMP 2024.</li>
                          <li>Refrigerios.</li>
                          <li>Libreta y esfero oficial del CNMP 2024.</li>
                          <li>Certificado de participación digital.</li>
                        </ul>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-2xl font-semibold leading-normal mb-2 text-gray-800">
                          STREAMING DEL EVENTO: $200.000
                        </h4>
                        <p className="mb-4">
                          Quienes no tengan la posibilidad de asistir presencialmente al CNMP 2024, podrán hacerlo de manera virtual a través de un grupo cerrado de Facebook a través del Streaming Oficial del CNMP 2024.
                        </p>
                        <ul className="list-disc list-inside text-left mb-4">
                          <li>Ingreso virtual a todas las jornadas del CNMP 2024.</li>
                          <li>Certificado de participación digital.</li>
                        </ul>
                        <p className="mb-4">
                          Nota: El streaming no incluye memorias del evento.
                        </p>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-2xl font-semibold leading-normal mb-2 text-gray-800">
                          MEMORIAS DEL EVENTO: $200.000
                        </h4>
                        <p className="mb-4">
                          Las memorias del evento se refieren a la grabación del evento en video con las respectivas intervenciones de todos los conferencistas.
                          <br />
                          Solo podrán acceder a las memorias del CNMP 2024, los asistentes presenciales al evento. Su valor será de $200.000 para todas las localidades, a excepción de la LOCALIDAD DIAMANTE, que las incluye dentro de la tarifa.
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          <strong>NOTAS:</strong>
                          <ul className="list-disc list-inside text-left mb-4">
                            <li>Ninguna de las localidades incluye hospedaje.</li>
                            <li>Ninguna de las localidades incluye desayunos o almuerzos.</li>
                            <li>Ninguna de las localidades incluye transportes.</li>
                            <li>Los refrigerios en todas las localidades serán uno en la primera jornada, uno en la segunda jornada y uno en la tercera jornada.</li>
                            <li>Solo la LOCALIDAD DIAMANTE incluye las memorias del evento. Los demás interesados deberán adquirirlas con pago independiente.</li>
                            <li>No se podrán adquirir entradas por jornadas independientes. Las entradas se otorgan para el evento en general.</li>
                          </ul>
                        </p>
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
