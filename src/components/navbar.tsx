import Image from 'next/image'; 
import React, { useEffect, useState } from 'react'; 
import logo from '../../public/images/2025/logo.png'; 
import Link from 'next/link'; 
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

export default function Navbar(props: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar el estilo de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Enlaces de navegación con efecto de scroll suave
  const NavLinks = ({ mobile = false }) => {
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Si el enlace es un ancla, hacer scroll suave
      if (href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          if (mobile) onClose();
        }
      }
    };

    return (
      <>
        {[
          { label: 'Paneles', alt: '#dirigido-a' },
          { label: 'Conferencistas', alt: '#conferencistas' },
          { label: 'Boletería', alt: '#entradas' },
          { label: 'Testimonios', alt: '#testimonios' },
          { label: 'Organización', alt: '#aliados' }
        ].map((item, index) => (
          <Link
            href={item.alt}
            key={index}
            className={`
              ${mobile 
                ? 'block w-full py-4 text-xl text-center border-b border-gray-700 hover:bg-gray-800 transition-colors'
                : 'text-white hover:text-blue-300 transition-colors duration-300 text-sm md:text-base lg:text-lg px-2 lg:px-4'
              }
            `}
            onClick={(e) => handleLinkClick(e, item.alt)}
          >
            {item.label}
          </Link>
        ))}
      </>
    );
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || !props.transparent
          ? 'bg-[#0e1424] shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      {!isOpen && (
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="CNMP 2025"
              width={240}
              height={100}
              className={`w-auto transition-all duration-300 ${
                scrolled ? 'h-8 md:h-10' : 'h-10 md:h-12'
              }`}
              priority
            />
          </Link>

          {/* Versión de escritorio */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLinks />
            <Link
              href="mailto:cnmpcolombia@gmail.com"
              className="ml-2 lg:ml-4 px-4 lg:px-6 py-2 bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white rounded-full hover:from-[#293991] hover:to-[#6d0019] transition-all duration-300 text-sm lg:text-base whitespace-nowrap"
            >
              Contáctanos
            </Link>
          </div>

          {/* Botón de menú para móvil - Hacerlo más grande */}
          <div className="md:hidden">
            <button
              ref={btnRef}
              onClick={onOpen}
              className="text-white focus:outline-none p-3"
              aria-label="Abrir menú"
            >
              <HamburgerIcon w={24} h={24} />
            </button>
          </div>
        </div>
      </div>
      )}
      {/* Drawer para móvil */}
      <Drawer
        isOpen={isOpen}
        placement="top"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent bg="#0a0b14" color="white" className="min-h-screen">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
            <Image
              src={logo}
              alt="CNMP 2025"
              width={180}
              height={60}
              className="w-auto h-9"
            />
            {/* Botón de cierre más grande y con mejor posición */}
            <button 
              onClick={onClose} 
              className="text-white p-3 focus:outline-none"
              aria-label="Cerrar menú"
            >
              <CloseIcon w={16} h={16} />
            </button>
          </div>
          <DrawerBody p={0} className="flex flex-col h-full">
            <div className="flex flex-col items-center justify-between h-full py-6 gap-10">
              <div className="w-full">
                <NavLinks mobile />
              </div>
              <div className="px-10 w-full mt-auto">
                <Link
                  href="mailto:cnmpcolombia@gmail.com"
                  className="block w-full text-center px-6 py-4 bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white rounded-full text-xl hover:opacity-90 font-medium"
                >
                  Contáctanos
                </Link>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </nav>
  );
}