"use client"

import Navbar from '@/components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PurchaseSuccess() {
  const params = useParams();
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    if (params?.reference) {
      setReference(params.reference as string);
    }
  }, [params]);

  const bgStyle = {
    height: '100vh',
    backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}images/locality-bg.png')`,
  };

  return (
    <>
      <Navbar />
      <div className="grid lg:grid-cols-1 w-full" style={bgStyle}>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-6xl mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Compra Realizada con Éxito!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Gracias por tu compra. Tu número de referencia es: <span className="font-bold">{reference}</span>
            </p>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
              <p className="font-bold">Información Importante</p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Recibirás un correo electrónico con tu(s) boleto(s) adjunto(s) en breve.
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Si no recibes el correo en los próximos 15 minutos, por favor revisa tu carpeta de spam o contáctanos.
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </>
  );
}