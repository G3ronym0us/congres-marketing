import Image from 'next/image';
import React from 'react';
import facebook from '../../public/images/2024/icons/facebook.png';
import instagram from '../../public/images/2024/icons/instagram.png';
import x from '../../public/images/2024/icons/x.png';

interface Props {
  conferencista: {
    nombre: string;
    titulo: string;
    redesSociales: {
      Facebook?: string;
      Instagram?: string;
      X?: string;
    };
    alt: string;
  };
}

const LecturerCard: React.FC<Props> = ({ conferencista }) => {
  const handleSocialClick = (e: React.MouseEvent<HTMLDivElement>, link: string) => {
    e.stopPropagation();  // Detiene la propagación del evento
    e.preventDefault();   // Previene el comportamiento por defecto
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="px-6">
      <div className="relative group overflow-hidden">
        <Image
          alt={conferencista.nombre}
          src={`/images/2024/${conferencista.alt}.jpg`}
          className="shadow-lg max-w-full mx-auto transition-opacity duration-300 group-hover:opacity-80"
          width={500}
          height={800}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex justify-center space-x-4">
            {conferencista.redesSociales.Facebook && (
              <div
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => handleSocialClick(e, conferencista.redesSociales.Facebook!)}
              >
                <Image src={facebook} alt='facebook-icon' width={32} height={32} />
              </div>
            )}
            {conferencista.redesSociales.Instagram && (
              <div
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => handleSocialClick(e, conferencista.redesSociales.Instagram!)}
              >
                <Image src={instagram} alt='instagram-icon' width={32} height={32} />
              </div>
            )}
            {conferencista.redesSociales.X && (
              <div
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => handleSocialClick(e, conferencista.redesSociales.X!)}
              >
                <Image src={x} alt='x-icon' width={32} height={32} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="pt-6 text-center">
        <h5 className="text-xl font-bold text-white">{conferencista.nombre}</h5>
        <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
          {conferencista.titulo}
        </p>
      </div>
    </div>
  );
};

export default LecturerCard;