'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/navbar';
import { downloadCertificate, getTicket } from '@/services/tickets';
import { Seat, traductions } from '@/types/tickets';
import {
  faChair,
  faDownload,
  faFile,
  faLifeRing,
  faTicket,
  faUser,
  faUserGroup,
  faSpinner,
  faCheckCircle,
  faCalendarAlt,
  faMapMarkerAlt,
  faQrcode,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppIcon';

export default function TicketDetailPage() {
  const params = useParams();

  const [uuid, setUuid] = useState<string>();
  const [ticket, setTicket] = useState<Seat>();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setUuid(params?.document ? (params.document as string) : '');
  }, []);

  useEffect(() => {
    if (uuid) {
      setLoading(true);
      loadTicket(uuid);
    }
  }, [uuid]);

  const loadTicket = async (uuid: string) => {
    const ticket = await getTicket(uuid);
    setTicket(ticket);
    setLoading(false);
  };

  const handleDownloadCertificate = async () => {
    if (ticket?.uuid) {
      try {
        setDownloading(true);
        if (document) {
          const blob = await downloadCertificate(ticket.uuid);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `certificado-${ticket.name}-${ticket.lastname}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error('Error al descargar el certificado:', error);
        alert(
          'Hubo un error al descargar el certificado. Por favor, inténtelo de nuevo.',
        );
      } finally {
        setDownloading(false);
      }
    }
  };

  return (
    <>
      <Navbar transparent={false} />
      <main>
        {/* Hero Section - Siguiendo el estilo de la landing */}
        <div
          className="relative pt-20 pb-10 flex content-center items-center justify-center"
        >
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: "url('/images/2025/hero-background.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              className="absolute top-0 w-full h-full bg-center bg-cover"
              style={{
                background:
                  'linear-gradient(135deg, rgba(28, 44, 103, 0.92) 0%, rgba(75, 0, 18, 0.92) 100%)',
                backgroundBlendMode: 'overlay',
              }}
            >
              <span
                id="blackOverlay"
                className="w-full h-full absolute opacity-75"
              ></span>
            </div>
          </div>

          <div className="container relative mx-auto px-4" data-aos="fade-in">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
                <div>
                  <h1 className="text-white font-bold text-4xl md:text-5xl">
                    Consulta de Boleto
                    <span className="block text-blue-300 text-2xl md:text-3xl mt-2">
                      CNMP Colombia 2025
                    </span>
                  </h1>
                  <p className="mt-4 text-lg text-gray-300">
                    Verifica los detalles de tu boleto para el Congreso Nacional de Marketing Político
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>  

        {/* Contenido principal */}
        <section className="py-16 -mt-20 relative z-10">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl shadow-xl">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-700 text-xl font-medium">Cargando información del boleto...</p>
              </div>
            ) : ticket ? (
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Cabecera del boleto */}
                <div className="bg-gradient-to-r from-[#1C2C67] to-[#4B0012] py-6 px-6 md:px-10">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faTicket} className="text-white text-3xl" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-white text-xl md:text-2xl font-bold">Boleto Oficial</h2>
                        <p className="text-blue-300">#CNMP2025</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-center px-4 py-2 border border-blue-300 rounded-lg bg-white bg-opacity-10 mr-4">
                        <div className="text-blue-300 text-sm">ESTADO</div>
                        <div className="text-white font-semibold flex items-center justify-center">
                          <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-400" />
                          CONFIRMADO
                        </div>
                      </div>
                      <div className="text-white text-center">
                        <div className="text-blue-300 text-sm">ZONA</div>
                        <div className="font-bold text-lg">{traductions[ticket.type]}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalles del boleto - Sistema de grid responsivo */}
                <div className="p-6 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Columna izquierda - Datos personales */}
                    <div>
                      <h3 className="text-[#1C2C67] text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
                        Información del Asistente
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="flex">
                          <div className="w-10 flex-shrink-0">
                            <FontAwesomeIcon icon={faUser} className="text-[#1C2C67]" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Nombre completo</p>
                            <p className="text-gray-800 font-semibold text-lg">
                              {ticket.name} {ticket.lastname}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="w-10 flex-shrink-0">
                            <FontAwesomeIcon icon={faFile} className="text-[#1C2C67]" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Documento</p>
                            <p className="text-gray-800 font-semibold text-lg">{ticket.document}</p>
                          </div>
                        </div>
                        
                        
                      </div>
                    </div>
                    
                    {/* Columna derecha - Detalles del evento y asiento */}
                    <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8">
                      <h3 className="text-[#4B0012] text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
                        Detalles del Evento
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="flex">
                          <div className="w-10 flex-shrink-0">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-[#4B0012]" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Fecha</p>
                            <p className="text-gray-800 font-semibold text-lg">1 y 2 de agosto, 2025</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="w-10 flex-shrink-0">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#4B0012]" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Ubicación</p>
                            <p className="text-gray-800 font-semibold text-lg">Cartagena, Colombia</p>
                          </div>
                        </div>
                      
                      </div>
                    </div>
                  </div>
                  
                  {/* Sección de código QR y certificado */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* QR Code */}
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <FontAwesomeIcon icon={faQrcode} className="text-[#1C2C67] text-2xl mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Código de Acceso</h3>
                      </div>
                      <div className="bg-white p-4 rounded-lg inline-block shadow-md">
                        {/* Este div simula el código QR - En un caso real sería generado dinámicamente */}
                        <div className="w-40 h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                          Código QR
                        </div>
                      </div>
                      <p className="mt-4 text-gray-600 text-sm">
                        Presenta este código en la entrada del evento para registrar tu asistencia
                      </p>
                    </div>
                    
                    {/* Certificado */}
                    <div className="bg-gradient-to-r from-[#1C2C67]/10 to-[#4B0012]/10 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faDownload} className="text-[#4B0012] text-2xl mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Certificado de Asistencia</h3>
                      </div>
                      <p className="text-gray-700 mb-6">
                        Podrás descargar tu certificado oficial de asistencia al CNMP 2025 después del evento. 
                        El certificado estará disponible una vez hayas registrado tu asistencia.
                      </p>
                      <button
                        onClick={handleDownloadCertificate}
                        className={`bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white px-6 py-3 rounded-lg flex items-center justify-center w-full md:w-auto transition-all ${
                          true ? 'opacity-75 cursor-wait' : 'hover:shadow-lg'
                        }`}
                        disabled={true}
                      >
                        {downloading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                            <span>Descargando...</span>
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faDownload} className="mr-2" />
                            <span>Descargar Certificado</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Footer del boleto */}
                <div className="bg-gray-50 py-4 px-6 md:px-10 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between">
                    <p className="text-gray-500 text-sm mb-2 md:mb-0">
                      <span className="font-semibold">Importante:</span> Este boleto es personal e intransferible. Se requiere presentar un documento de identidad.
                    </p>
                    <div>
                      <span className="text-sm text-gray-500">ID: {ticket.uuid?.substring(0, 8)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-xl p-8 text-center">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-3xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Boleto no encontrado</h2>
                <p className="text-gray-600 max-w-lg mx-auto mb-8">
                  No pudimos encontrar un boleto asociado con el documento proporcionado. Por favor, verifica el código y vuelve a intentarlo.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
                  <h3 className="font-semibold text-[#1C2C67] mb-3">¿Necesitas ayuda?</h3>
                  <p className="text-gray-600 mb-4">
                    Si tienes problemas para acceder a tu boleto, por favor contáctanos:
                  </p>
                  <a 
                    href="mailto:cnmpcolombia@gmail.com" 
                    className="text-[#4B0012] font-semibold hover:underline"
                  >
                    cnmpcolombia@gmail.com
                  </a>
                </div>
              </div>
            )}
            
            {/* Sección de instrucciones - Solo visible cuando hay un ticket */}
            {ticket && (
              <div className="mt-12 bg-gradient-to-br from-[#1C2C67]/5 to-[#4B0012]/5 rounded-xl p-6 md:p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Instrucciones para el Evento
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-xl font-bold text-[#1C2C67]">1</span>
                    </div>
                    <h4 className="text-lg font-semibold text-center mb-2">Antes del Evento</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#1C2C67] mr-2">✓</span>
                        <span>Mantén tu boleto a mano (digital o impreso)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#1C2C67] mr-2">✓</span>
                        <span>Trae tu documento de identidad</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#1C2C67] mr-2">✓</span>
                        <span>Llega con al menos 30 minutos de anticipación</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-xl font-bold text-[#1C2C67]">2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-center mb-2">Durante el Evento</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#1C2C67] mr-2">✓</span>
                        <span>Registra tu asistencia en los puntos señalados</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#1C2C67] mr-2">✓</span>
                        <span>Respeta la ubicación asignada</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#1C2C67] mr-2">✓</span>
                        <span>Sigue las indicaciones del personal</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-xl font-bold text-[#1C2C67]">3</span>
                    </div>
                    <h4 className="text-lg font-semibold text-center mb-2">Después del Evento</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#1C2C67] mr-2">✓</span>
                        <span>Descarga tu certificado de asistencia</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#1C2C67] mr-2">✓</span>
                        <span>Accede al material exclusivo del evento</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#1C2C67] mr-2">✓</span>
                        <span>Comparte tu experiencia usando #CNMP2025</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}