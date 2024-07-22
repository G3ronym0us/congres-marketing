import Image from 'next/image';
import React from 'react';
import logo from '../../public/images/logo-congress.png';
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
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const NavLinks = ({ mobile = false }) => (
    <>
      {[
        { label: 'Agenda', alt: '#agenda' },
        { label: 'Paneles', alt: '#panels' },
        { label: 'Conferencistas', alt: '#conferences' },
        { label: 'Boleteria', alt: 'boleteria' },
        { label: 'Organización', alt: 'organizacion' }
      ].map((item) => (
        <Link
          key={item.alt} // Use the 'alt' property as the key
          href={`/${item.alt}`} // Use the 'alt' property for the href
          className={`py-4 px-6 hover:bg-gray-700 hover:text-white transition-colors duration-300 ${
            mobile ? 'w-full block' : ''
          }`}
          onClick={mobile ? onClose : undefined}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav
      className={
        (props.transparent
          ? 'top-0 absolute z-50 w-full'
          : 'relative shadow-lg bg-white shadow-lg w-full') +
        ' flex flex-wrap items-center justify-between px-2 py-3'
      }
    >
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Link
            className={
              (props.transparent ? 'text-white' : 'text-gray-800') +
              ' text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase'
            }
            href={process.env.NEXT_PUBLIC_URL ?? '/'}
          >
            <Image src={logo} width={200} className="inline" alt="" />
          </Link>
          {isOpen ? (
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={onClose}
              ref={btnRef}
            >
              <CloseIcon />
            </button>
          ) : (
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={onOpen}
              ref={btnRef}
            >
              <HamburgerIcon />
            </button>
          )}
        </div>
        <Box className="hidden lg:flex items-center gap-4 font-medium text-md text-[#CCCCCC]">
          <NavLinks />
        </Box>
      </div>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent className="bg-gray-900 text-white pt-24">
          <DrawerBody className="p-0">
            <Box className="flex flex-col items-start font-medium text-md">
              <NavLinks mobile />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </nav>
  );
}
