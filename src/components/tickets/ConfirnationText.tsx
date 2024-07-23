import React from 'react';
import { Locality } from '@/types/tickets';


interface Props {
    locality: Locality,
}

const ConfirmationText: React.FC<Props> = ({ locality }) => {
  const getTextColorClass = () => {
    if (locality && localityColors[locality]) {
      // Convertir el color hexadecimal a un nombre de clase de Tailwind
      const colorName = getColorName(localityColors[locality]);
      return `text-${colorName}`;
    }
    return 'text-black'; // Color por defecto
  };

  const getColorName = (hexColor) => {
    // Mapeo de colores hexadecimales a nombres de clases de Tailwind
    const colorMap = {
      '#150FBF': 'blue-700',
      '#FFD700': 'yellow-400',
      '#FF69B4': 'pink-400',
      '#FFA500': 'orange-400',
      '#32CD32': 'green-500',
      // Añade más mapeos según sea necesario
    };
    return colorMap[hexColor] || 'black';
  };

  return (
    <div className={`uppercase mb-6 text-lg text-center ${getTextColorClass()}`}>
      Confirmar Asiento - {locality || ''}
    </div>
  );
};

export default ConfirmationText;