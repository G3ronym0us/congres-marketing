"use client";

import Navbar from "../../components/navbar";
import Footer from "../../components/Footer";
import React from "react";

export default function LocationsAndPrices() {
  const locations = [
    {
      name: "LOCALIDAD DIAMANTE",
      price: "$500.000",
      benefits: [
        "Ingreso a todas las jornadas del CNMP 2024.",
        "Ingreso al cóctel oficial del CNMP 2024.",
        "Meet & Greet con Antonio Sola.",
        "Memorias de todo el CNMP 2024 (Material audiovisual).",
        "Refrigerios.",
        "Libreta y esfero oficial del CNMP 2024.",
        "Certificado de participación digital.",
      ],
    },
    {
      name: "LOCALIDAD ORO",
      price: "$380.000",
      benefits: [
        "Ingreso a todas las jornadas del CNMP 2024.",
        "Ingreso al cóctel oficial del CNMP 2024.",
        "Refrigerios.",
        "Libreta y esfero oficial del CNMP 2024.",
        "Certificado de participación digital.",
      ],
    },
    {
      "name": "LOCALIDAD VIP",
      "price": "$300.000",
      "benefits": [
        "Ingreso a todas las jornadas del CNMP 2024.",
        "Ingreso al cóctel oficial del CNMP 2024.",
        "Refrigerios.",
        "Libreta y esfero oficial del CNMP 2024.",
        "Certificado de participación digital."
      ]
    },
    {
      "name": "LOCALIDAD PLATEA IZQUIERDA Y DERECHA",
      "price": "$250.000",
      "benefits": [
        "Ingreso a todas las jornadas del CNMP 2024.",
        "Ingreso al cóctel oficial del CNMP 2024.",
        "Refrigerios.",
        "Libreta y esfero oficial del CNMP 2024.",
        "Certificado de participación digital."
      ]
    },
    {
      "name": "LOCALIDAD GENERAL",
      "price": "$200.000",
      "benefits": [
        "Ingreso a todas las jornadas del CNMP 2024.",
        "Refrigerios.",
        "Libreta y esfero oficial del CNMP 2024.",
        "Certificado de participación digital."
      ]
    }  ];

    return (
      <>
        <Navbar transparent />
        <main className="bg-black text-white" >
          <div className="container mx-auto px-4 pt-28">
            <h1 className="text-white font-semibold text-4xl md:text-5xl text-center mb-12">
              LOCALIDADES Y PRECIOS CNMP 2024
            </h1>
          </div>
  
          <section className="pb-12">
            <div className="container mx-auto px-4">
              {locations.map((location, index) => (
                <div key={index} className="mb-12 bg-gradient-to-r from-black from-20% via-[#4B0012] via-70% p-6 rounded-lg">
                  <h2 className="text-3xl font-semibold mb-4">{location.name}: {location.price}</h2>
                  <ul className="list-disc list-inside">
                    {location.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="mb-2">{benefit}</li>
                    ))}
                  </ul>
                </div>
              ))}
  
              <div className="mt-12 bg-gradient-to-r from-black from-20% via-[#4B0012] via-70% p-6 rounded-lg">
                <h2 className="text-3xl font-semibold mb-4">STREAMING DEL EVENTO: $200.000</h2>
                <p className="mb-4">
                  Quienes no tengan la posibilidad de asistir presencialmente al CNMP 2024, podrán hacerlo de manera virtual a través de un grupo cerrado de Facebook a través del Streaming Oficial del CNMP 2024.
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li>Ingreso virtual a todas las jornadas del CNMP 2024.</li>
                  <li>Certificado de participación digital.</li>
                </ul>
                <p className="mb-4">
                  Nota: El streaming no incluye memorias del evento.
                </p>
              </div>
  
              <div className="mt-12 bg-gradient-to-r from-black from-20% via-[#4B0012] via-70% p-6 rounded-lg">
                <h2 className="text-3xl font-semibold mb-4">MEMORIAS DEL EVENTO: $200.000</h2>
                <p className="mb-4">
                  Las memorias del evento se refieren a la grabación del evento en video con las respectivas intervenciones de todos los conferencistas.
                  <br />
                  Solo podrán acceder a las memorias del CNMP 2024, los asistentes presenciales al evento. Su valor será de $200.000 para todas las localidades, a excepción de la LOCALIDAD DIAMANTE, que las incluye dentro de la tarifa.
                </p>
              </div>
  
              <div className="mt-12 bg-gradient-to-r from-black from-20% via-[#4B0012] via-70% p-6 rounded-lg">
                <h2 className="text-3xl font-semibold mb-4">NOTAS IMPORTANTES:</h2>
                <ul className="list-disc list-inside">
                  <li>Ninguna de las localidades incluye hospedaje.</li>
                  <li>Ninguna de las localidades incluye desayunos o almuerzos.</li>
                  <li>Ninguna de las localidades incluye transportes.</li>
                  <li>Los refrigerios en todas las localidades serán uno en la primera jornada, uno en la segunda jornada y uno en la tercera jornada.</li>
                  <li>Solo la LOCALIDAD DIAMANTE incluye las memorias del evento. Los demás interesados deberán adquirirlas con pago independiente.</li>
                  <li>No se podrán adquirir entradas por jornadas independientes. Las entradas se otorgan para el evento en general.</li>
                </ul>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
}