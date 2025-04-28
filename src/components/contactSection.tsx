'use client';

import React, { useState } from 'react';

// Define types for social media links
interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

// Define component props if needed in the future
interface ContactSectionProps {
  // You can add props here if needed
}

const ContactSection: React.FC<ContactSectionProps> = () => {
  // Contact information 
  const organizationContact = {
    email: 'cnmpcolombia@gmail.com',
    phone: '+57 318 120 0000',
    instagram: 'https://www.instagram.com/asocopol',
    facebook: 'https://www.facebook.com/',
    organizationName: 'Asociación Nacional de Consultores Políticos'
  };

  // Director's information
  const directorInfo = {
    name: 'José Guinand',
    email: 'joseguinandc@gmail.com',
    phone: '+57 318 309 9427',
    instagram: 'https://www.instagram.com/guinandestrategia',
    photoUrl: '/images/2024/jose-guinand.jpg'
  };

  // Institutional allies
  const allies: string[] = [
    'Asociación Nacional de Consultores Políticos',
    'ACEIPOL',
    'Revista Jaque Mate',
    'Politólogos Digitales',
    'Voz Consultores'
  ];

  return (
    <section id="contactanos" className="py-16 bg-[#0f1424]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
            ¿Tienes preguntas o quieres ser parte del Congreso?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Organization Contact Information Card */}
            <div className="bg-gradient-to-br from-[#1C2C67]/20 to-[#4B0012]/20 backdrop-filter backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-6">
                Información de contacto
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3">📧</span>
                  <div>
                    <p className="text-gray-300">Correo oficial:</p>
                    <a
                      href={`mailto:${organizationContact.email}`}
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      {organizationContact.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3">📱</span>
                  <div>
                    <p className="text-gray-300">
                      WhatsApp / Teléfono comercial:
                    </p>
                    <a
                      href={`tel:${organizationContact.phone}`}
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      {organizationContact.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3">📍</span>
                  <div>
                    <p className="text-gray-300">Instagram:</p>
                    <a
                      href={organizationContact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      @asocopol
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3">📍</span>
                  <div>
                    <p className="text-gray-300">Facebook:</p>
                    <a
                      href={organizationContact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      {organizationContact.organizationName}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Director Information Card */}
            <div className="bg-gradient-to-br from-[#1C2C67]/20 to-[#4B0012]/20 backdrop-filter backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-6">
                Director general
              </h3>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img 
                    src={directorInfo.photoUrl} 
                    alt={directorInfo.name} 
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      if (target.parentNode) {
                        (target.parentNode as HTMLElement).className = "w-16 h-16 rounded-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012]";
                      }
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">{directorInfo.name}</h4>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3">📧</span>
                  <div>
                    <p className="text-gray-300">Correo:</p>
                    <a
                      href={`mailto:${directorInfo.email}`}
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      {directorInfo.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3">📞</span>
                  <div>
                    <p className="text-gray-300">Teléfono:</p>
                    <a
                      href={`tel:${directorInfo.phone}`}
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      {directorInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-3">📍</span>
                  <div>
                    <p className="text-gray-300">Instagram personal:</p>
                    <a
                      href={directorInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      @guinandestrategia
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Institutional Allies */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              🖋️ Aliados institucionales
            </h3>
            <p className="text-gray-300">
              {allies.join(' – ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;