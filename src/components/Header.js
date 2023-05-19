/* eslint-disable @next/next/no-html-link-for-pages */

import Image from 'next/image';
import logo from '../../public/images/logo-congress.png';
import Link from 'next/link';

export default function Header() {

  return (
    <>
      <div
        className="
        bg-blue
        grotesk
        absolute
        top-0
        h-7
        w-full 
        text-center
        text-sm
        leading-6
        text-white
      "
      >
        No te quedes sin tus entradas.
        <a href="/" width="pl-3 underline">
          Compralas aqui
        </a>
      </div>
      <div className="grotesk mt-6 mb-16 flex items-center justify-between py-4 px-4 sm:mx-0 sm:mb-20 sm:px-0 md:px-6">
        <div className="mt-4 inline-block pb-4 pl-8">
          <div className='inline'>
            <a href="/" className="align-middle text-3xl font-bold text-black">
              <Image src={logo} width={250} className='inline' alt=''/>
            </a>
          </div>
          <div className="hidden pl-14 align-middle xl:inline-block">
            <a href="/" className="pr-8 text-xl text-black uppercase">
              ¿A quién va dirigido?
            </a>
            <a href="/" className="pr-8 text-xl text-black">
              CONFERENCISTAS
            </a>
            <a href="/" className="pr-8 text-xl text-black">
              PANELES
            </a>
            <a href="/" className="text-xl text-black">
              CRONOGRAMA
            </a>
          </div>
        </div>
        <div className="flex items-center">
          <div className="hidden py-1 text-right xl:inline-block">
            <Link
              className="bg-blue mt-2 inline-flex items-center px-8 py-3 text-lg font-semibold tracking-tighter text-white"
              href="tickets/buy"
            >
              Comprar Entradas
            </Link>
          </div>
          <button className="pr-12 pl-4">
            <svg
              className="mr-auto inline-block text-black xl:hidden"
              width="33"
              height="50"
              viewBox="0 0 23 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.892578 10.8691H22.1058"
                stroke="black"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M0.892578 18.8691H22.1058"
                stroke="black"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M22.1066 14.8688H0.893399"
                stroke="black"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
