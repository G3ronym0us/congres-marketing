'use client';

import { useState, useEffect } from 'react';
import { useCarouselTouchEvents } from '@/hooks/useCarouselTouchEvents';
import {
  getInternationalWithTitle,
  getNationalWithTitle,
} from '@/services/user';
import { Lecturer } from '@/types/lecturer';
import { useRouter } from 'next/navigation';

const ConferencistasSection = () => {
  const router = useRouter();
  const [internationalLecturers, setInternationalLecturers] = useState<
    Lecturer[]
  >([]);
  const [nationalLecturers, setNationalLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del backend
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        setError(null);

        const [internationalData, nationalData] = await Promise.all([
          getInternationalWithTitle(),
          getNationalWithTitle(),
        ]);

        setInternationalLecturers(internationalData);
        setNationalLecturers(nationalData);
      } catch (err) {
        setError('Error al cargar los conferencistas. Intenta nuevamente.');
        console.error('Error loading lecturers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  // Aplicar los eventos táctiles para el carrusel móvil
  useCarouselTouchEvents('.overflow-x-auto');

  // Componente para mostrar loading
  const LoadingCard = () => (
    <div className="bg-gradient-to-br from-[#1C2C67]/30 to-[#4B0012]/30 backdrop-filter backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-800 animate-pulse">
      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className="h-6 bg-gray-600 rounded w-3/4"></div>
        </div>
        <div className="mb-4">
          <div className="w-full h-48 bg-gray-600 rounded-lg"></div>
        </div>
        <div className="h-4 bg-gray-600 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-4/6"></div>
      </div>
    </div>
  );

  // Componente para mostrar error
  const ErrorMessage = () => (
    <div className="col-span-full text-center py-12">
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-red-400 font-semibold mb-2">Error al cargar</h3>
        <p className="text-gray-300 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  // Componente para tarjeta de conferencista
  const LecturerCard = ({
    lecturer,
    size = 'large',
  }: {
    lecturer: Lecturer;
    size?: 'large' | 'small';
  }) => {
    const isLarge = size === 'large';
    const cardClass = isLarge
      ? 'bg-gradient-to-br from-[#1C2C67]/30 to-[#4B0012]/30 backdrop-filter backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-blue-500 transition-all duration-300'
      : 'w-64 flex-shrink-0 snap-center bg-gradient-to-br from-[#1C2C67]/20 to-[#4B0012]/20 backdrop-filter backdrop-blur-sm p-4 rounded-xl border border-gray-800';

    return (
      <div className={`cursor-pointer ${cardClass}`} onClick={() => router.push(`/lecturer/${lecturer.alt}`)}>
        <div className={isLarge ? 'p-6' : ''}>
          <div className="flex items-center mb-3">
            <h3
              className={`font-bold text-white ${isLarge ? 'text-xl' : 'text-lg'} ${!isLarge ? 'truncate' : ''}`}
            >
              {lecturer.firstName} {lecturer.lastName}
            </h3>
            {isLarge && (
              <span className="ml-2 text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                {lecturer.country}
              </span>
            )}
          </div>
          <div className="mb-4">
            <img
              src={lecturer.image}
              alt={`${lecturer.firstName} ${lecturer.lastName}`}
              className={`w-full object-cover object-top rounded-lg ${isLarge ? 'h-48' : 'h-36'}`}
            />
          </div>
          {lecturer.title && (
            <p
              className={`text-blue-300 mb-4 ${isLarge ? '' : 'text-sm h-10 line-clamp-2'} ${isLarge ? '' : 'line-clamp-2'}`}
            >
              {isLarge ? `"${lecturer.title}"` : lecturer.title}
            </p>
          )}
          <div className="flex space-x-3">
            {lecturer.socialMedia?.instagram && (
              <a
                href={lecturer.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            )}
            {lecturer.socialMedia?.facebook && (
              <a
                href={lecturer.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            )}
            {lecturer.socialMedia?.x && (
              <a
                href={lecturer.socialMedia.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            )}
            {lecturer.socialMedia?.youtube && (
              <a
                href={lecturer.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="conferencistas" className="py-16 bg-[#0f1424]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Estrategas. Narradores. Maestros del poder.
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-4">
            El CNMP2025 reúne a los grandes nombres del marketing político
            internacional. No vienen a repetir fórmulas. Vienen a revelar lo que
            realmente funciona.
          </p>
        </div>

        {/* Conferencistas Internacionales */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
            <span className="text-blue-300 mr-2">🌎</span> Internacionales
          </h3>

          {loading && (
            <>
              {/* Loading para móvil */}
              <div className="block lg:hidden">
                <div className="overflow-x-auto pb-6">
                  <div className="flex space-x-4 w-max pl-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-72 flex-shrink-0">
                        <LoadingCard />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loading para desktop */}
              <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            </>
          )}

          {error && <ErrorMessage />}

          {!loading && !error && (
            <>
              {/* Carrusel para móvil */}
              <div className="block lg:hidden">
                <div className="relative">
                  <div className="overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                    <div className="flex space-x-4 w-max pl-4">
                      {internationalLecturers.map((lecturer) => (
                        <div
                          key={lecturer.id}
                          className="w-72 flex-shrink-0 snap-center"
                        >
                          <LecturerCard lecturer={lecturer} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Indicadores de desplazamiento */}
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
                      <div className="h-1 w-3 bg-gray-600 rounded-full"></div>
                      <div className="h-1 w-3 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  {/* Indicación de desplazamiento */}
                  <div className="text-center text-gray-400 text-sm mt-2">
                    <span>Desliza para ver más →</span>
                  </div>
                </div>
              </div>

              {/* Vista para desktop */}
              <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {internationalLecturers.map((lecturer) => (
                  <LecturerCard key={lecturer.id} lecturer={lecturer} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Conferencistas Nacionales */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
            <span className="text-blue-300 mr-2">🇨🇴</span> Nacionales
          </h3>

          {loading && (
            <>
              {/* Loading para móvil */}
              <div className="block lg:hidden">
                <div className="overflow-x-auto pb-6">
                  <div className="flex space-x-4 w-max pl-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-64 flex-shrink-0">
                        <LoadingCard />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loading para desktop */}
              <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            </>
          )}

          {!loading && !error && (
            <>
              {/* Carrusel para móvil */}
              <div className="block lg:hidden">
                <div className="relative">
                  <div className="overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                    <div className="flex space-x-4 w-max pl-4">
                      {nationalLecturers.map((lecturer) => (
                        <LecturerCard
                          key={lecturer.id}
                          lecturer={lecturer}
                          size="small"
                        />
                      ))}
                    </div>
                  </div>
                  {/* Indicadores de desplazamiento */}
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
                      <div className="h-1 w-3 bg-gray-600 rounded-full"></div>
                      <div className="h-1 w-3 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  {/* Indicación de desplazamiento */}
                  <div className="text-center text-gray-400 text-sm mt-2">
                    <span>Desliza para ver más →</span>
                  </div>
                </div>
              </div>

              {/* Vista para desktop */}
              <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nationalLecturers.map((lecturer) => (
                  <div
                    key={lecturer.id}
                    className="bg-gradient-to-br from-[#1C2C67]/20 to-[#4B0012]/20 backdrop-filter backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold text-white mb-1">
                      {lecturer.firstName} {lecturer.lastName}
                    </h3>
                    <div className="mb-4">
                      <img
                        src={lecturer.image}
                        alt={`${lecturer.firstName} ${lecturer.lastName}`}
                        className="w-full h-48 object-cover object-top rounded-lg"
                      />
                    </div>
                    {lecturer.title && (
                      <p className="text-blue-300 text-sm mb-4">
                        {lecturer.title}
                      </p>
                    )}
                    <div className="flex space-x-3">
                      {lecturer.socialMedia?.instagram && (
                        <a
                          href={lecturer.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      )}
                      {lecturer.socialMedia?.x && (
                        <a
                          href={lecturer.socialMedia.x}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Panel de precandidatos */}
        <div className="bg-gradient-to-r from-[#1C2C67]/30 to-[#4B0012]/30 p-6 rounded-xl border border-white/10">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🎙️</span>
            <h3 className="text-2xl font-bold text-white">
              Panel de precandidatos presidenciales 2026
            </h3>
          </div>
          <p className="text-gray-300">
            En el marco del evento, se realizará un panel en el que 4
            pre-candidatos presidenciales participarán, con la dirección de un
            periodista en un debate sobre tres temas coyunturales para el país.
            Estos candidatos serán elegidos con base en quienes tengan mayor
            favorabilidad de opinión y reconocimiento en el mes de junio del
            2025.
          </p>
        </div>
      </div>

      {/* Estilos adicionales para el carrusel */}
      <style jsx global>{`
        /* Ocultar scrollbar pero mantener funcionalidad */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        /* Estilo para limitar el número de líneas de texto */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default ConferencistasSection;
