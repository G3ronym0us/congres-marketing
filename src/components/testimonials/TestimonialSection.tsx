// components/testimonials/TestimonialsSection.jsx
'use client';

import { useState, useEffect } from 'react';
import { useCarouselTouchEvents } from '@/hooks/useCarouselTouchEvents';
import { TicketType } from '@/types/tickets';

const testimonials = [
  {
    quote: "Fui como candidato. Salí como ganador.",
    name: "Carlos Gómez",
    role: "Alcalde electo 2023",
    image: "/images/testimonio1.jpg" // Puedes reemplazar con imágenes reales o usar null
  },
  {
    quote: "Ver a Beccassino, Sola y Guinand juntos fue un masterclass de realidad política.",
    name: "Valentina Ruiz",
    role: "Consultora Electoral",
    image: "/images/testimonio2.jpg"
  },
  {
    quote: "Volví con una nueva campaña… y con una nueva forma de pensar el poder.",
    name: "Andrés Páez",
    role: "Director de comunicaciones",
    image: "/images/testimonio3.jpg"
  },
  {
    quote: "La experiencia de aprendizaje más intensiva de mi carrera. Las conexiones que hice fueron invaluables.",
    name: "Natalia Herrera",
    role: "Community Manager",
    image: "/images/testimonio4.jpg"
  },
  {
    quote: "Como consultora política, este congreso me proporcionó herramientas clave para diseñar campañas más efectivas.",
    name: "Érica Cáceres",
    role: "Consultora Política",
    image: "/images/testimonio5.jpg"
  },
  {
    quote: "Salí con muchas ideas nuevas para aplicar en mis próximos proyectos. El nivel de los ponentes fue extraordinario.",
    name: "Alexcevith Acosta",
    role: "Ingeniero Civil Ex Director CAS",
    image: "/images/testimonio6.jpg"
  }
];

interface TestimonialsSectionProps {
  handleButtonClick: (localidadId: TicketType) => void;
}

export default function TestimonialsSection({ handleButtonClick }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const displayCount = 3; // Número de testimonios visibles en desktop
  
  // Usar el custom hook para el carrusel táctil
  useCarouselTouchEvents('.testimonials-carousel');
  
  // Cambiar automáticamente los testimonios cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => 
        prevIndex >= testimonials.length - displayCount ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Cambiar el índice activo
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section id="testimonios" className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Lo que dicen los que ya estuvieron
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Más que opiniones, son pruebas de que el CNMP transforma la manera de hacer política.
          </p>
        </div>

        {/* Carrusel para móvil */}
        <div className="block md:hidden">
          <div className="relative">
            <div className="testimonials-carousel overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
              <div className="flex space-x-4 w-max pl-4">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="w-80 flex-shrink-0 snap-center bg-gradient-to-br from-[#1C2C67]/20 to-[#4B0012]/20 backdrop-filter backdrop-blur-sm p-6 rounded-xl"
                  >
                    <div className="text-2xl text-blue-300 mb-4">🎤</div>
                    <p className="text-gray-300 mb-6 text-lg italic h-28 line-clamp-3">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012] flex items-center justify-center">
                          <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="ml-4">
                        <h4 className="text-white font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Indicadores de desplazamiento */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                {Array.from({ length: testimonials.length - 2 }).map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1 w-${index === 0 ? '12' : '3'} ${index === 0 ? 'bg-blue-500' : 'bg-gray-600'} rounded-full cursor-pointer`}
                    onClick={() => handleDotClick(index)}
                  ></div>
                ))}
              </div>
            </div>
            {/* Indicación de desplazamiento */}
            <div className="text-center text-gray-400 text-sm mt-2">
              <span>Desliza para ver más →</span>
            </div>
          </div>
        </div>

        {/* Vista para desktop - Carrusel controlado */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.slice(activeIndex, activeIndex + displayCount).map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1C2C67]/20 to-[#4B0012]/20 backdrop-filter backdrop-blur-sm p-6 rounded-xl transform transition-all duration-500"
              >
                <div className="text-2xl text-blue-300 mb-4">🎤</div>
                <p className="text-gray-300 mb-6 text-lg italic min-h-[100px]">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012] flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="ml-4">
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Indicadores para desktop */}
          <div className="flex justify-center mt-10">
            <div className="flex space-x-2">
              {Array.from({ length: testimonials.length - displayCount + 1 }).map((_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    activeIndex === index ? 'bg-blue-500 w-8' : 'bg-gray-600'
                  }`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Ver testimonio ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-xl text-white font-semibold">
            👉 ¿Listo para escribir tu propio testimonio?
          </p>
          <p className="text-lg text-gray-300 mt-3 mb-4">
            Este congreso no solo es un evento académico o de networking, sino una verdadera incubadora de talento y de ideas innovadoras que pueden transformar el panorama electoral.
          </p>
          <div className="relative inline-block mt-6">
            <button
              className="bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300"
              onClick={() => handleButtonClick(TicketType.DIAMOND)}
            >
              Reserva tu lugar
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* Estilos para el truncamiento de texto */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Ocultar scrollbar */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}