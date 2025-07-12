'use client';

import { useState } from 'react';
import { useCarouselTouchEvents } from '@/hooks/useCarouselTouchEvents';

const ScheduleSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Aplicar los eventos táctiles para el carrusel móvil
  useCarouselTouchEvents('.schedule-carousel');

  // Array con las URLs de las imágenes del cronograma
  const scheduleImages = [
    'https://congress-marketing.s3.us-east-2.amazonaws.com/cronograma/Carrousel-0.jpeg',
    'https://congress-marketing.s3.us-east-2.amazonaws.com/cronograma/Carrousel-1.jpeg',
    'https://congress-marketing.s3.us-east-2.amazonaws.com/cronograma/Carrousel-2.jpeg',
    'https://congress-marketing.s3.us-east-2.amazonaws.com/cronograma/Carrousel-3.jpeg',
    'https://congress-marketing.s3.us-east-2.amazonaws.com/cronograma/Carrousel-4.jpeg',
    'https://congress-marketing.s3.us-east-2.amazonaws.com/cronograma/Carrousel-5.jpeg',
    'https://congress-marketing.s3.us-east-2.amazonaws.com/cronograma/Carrousel-6.jpeg',
    'https://congress-marketing.s3.us-east-2.amazonaws.com/cronograma/Carrousel-7.jpeg',
    'https://congress-marketing.s3.us-east-2.amazonaws.com/cronograma/Carrousel-8.jpeg',
  ];

  const pdfUrl = 'https://congress-marketing.s3.us-east-2.amazonaws.com/cronograma/Cronograma-CNMP-2025.pdf';

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % scheduleImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + scheduleImages.length) % scheduleImages.length);
  };

  const handleDownloadPDF = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <section id="cronograma" className="py-16 bg-gradient-to-b from-[#0f1424] to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Cronograma del Evento
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-4">
            Descubre el programa completo del CNMP 2025. Dos días intensos de 
            aprendizaje, networking y estrategias que cambiarán tu perspectiva 
            del marketing político.
          </p>
        </div>

        {/* Carrusel de imágenes */}
        <div className="mb-8">
          {/* Vista desktop - Carrusel tradicional */}
          <div className="hidden lg:block relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {scheduleImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <img
                      src={image}
                      alt={`Cronograma página ${index + 1}`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
              
              {/* Controles de navegación */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Indicadores */}
            <div className="flex justify-center mt-6 space-x-2">
              {scheduleImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Vista móvil - Carrusel deslizable */}
          <div className="block lg:hidden">
            <div className="relative">
              <div className="overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide schedule-carousel">
                <div className="flex space-x-4 w-max pl-4">
                  {scheduleImages.map((image, index) => (
                    <div
                      key={index}
                      className="w-80 flex-shrink-0 snap-center"
                    >
                      <div className="bg-gradient-to-br from-[#1C2C67]/20 to-[#4B0012]/20 backdrop-filter backdrop-blur-sm p-4 rounded-xl border border-gray-800">
                        <img
                          src={image}
                          alt={`Cronograma página ${index + 1}`}
                          className="w-full h-auto object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Indicación de desplazamiento */}
              <div className="text-center text-gray-400 text-sm mt-2">
                <span>Desliza para ver más páginas →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de descarga del PDF */}
        <div className="text-center">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <svg 
              className="w-6 h-6 mr-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            Descargar PDF del Cronograma
          </button>
          
          <p className="text-gray-400 text-sm mt-4">
            Descarga el cronograma completo para planificar tu experiencia en el CNMP 2025
          </p>
        </div>
      </div>

      {/* Estilos adicionales para el carrusel móvil */}
      <style jsx global>{`
        /* Ocultar scrollbar pero mantener funcionalidad */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </section>
  );
};

export default ScheduleSection;