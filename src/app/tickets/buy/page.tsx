// @ts-nocheck
'use client';

import InputText from '@/components/form/InputText';
import Navbar from '@/components/navbar';
import { randomBytes } from 'crypto';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowLeft,
  faCirclePlus,
  faEdit,
  faMoneyBill1Wave,
  faRemove,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import validator from 'validator';
import {
  getIntegrityHash,
  getSeatsUsed,
  saveTickets,
} from '../../../services/tickets';
import MapTickets from '@/components/tickets/Map';
import { localities, Locality, SeatUsed, Ticket } from '@/types/tickets';
import TicketList from '@/components/tickets/TicketsList';
import { metadata } from '@/app/layout';
import { generateRandomString } from '@/utils/utils';

export default function BuyTickets() {
  const [locality, setLocality] = useState<Locality>();
  const [pay, setPay] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [document, setDocument] = useState<string>('');
  const [role, setRole] = useState<string>('Asesor político');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [amountTotal, setAmountTotal] = useState<number>(0);
  const [seatRow, setSeatRow] = useState<string | undefined>(undefined);
  const [seatNumber, setSeatNumber] = useState<number | null>(null);
  const [seatConfirm, setSeatConfirm] = useState<boolean>(false);
  const [seatsUseds, setSeatsUseds] = useState<SeatUsed[]>([]);
  const [ticketEdit, setTicketEdit] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadSeatUseds();
  }, []);

  const loadSeatUseds = async () => {
    const seatUseds = await getSeatsUsed();
    console.log(seatUseds);
    setSeatsUseds(seatUseds);
  };

  const roles = [
    'Asesor político',
    'Candidato',
    'Estudiante Universitario',
    'Docente Universitario',
    'Otro',
  ];

  useEffect(() => {
    setAmountTotal(tickets.reduce((total, ticket) => total + ticket.amount, 0));
  }, [tickets]);

  useEffect(() => {
    const initBoldCheckout = () => {
      if (typeof window !== 'undefined' && window.document) {
        if ('BoldCheckout' in window) {
          console.warn('Bold Checkout script is already loaded.');
          return;
        }

        const js = window.document.createElement('script');
        js.onload = () => {
          window.dispatchEvent(new Event('boldCheckoutLoaded'));
        };
        js.onerror = () => {
          console.error('Failed to load Bold Checkout script');
        };
        js.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
        window.document.head.appendChild(js);
      }
    };

    initBoldCheckout();
  }, []);

  const buy = async () => {
    const reference = await generateRandomString(20);
    const data: Ticket[] = tickets.map((ticket) => ({
      ...ticket,
      reference,
    }));

    try {
      const response = await saveTickets(data);
      console.log('Respuesta:', response);

      if (typeof window !== 'undefined') {
        if (!('BoldCheckout' in window)) {
          window.addEventListener(
            'boldCheckoutLoaded',
            () => {
              createBoldCheckout(reference);
            },
            { once: true },
          );
        } else {
          createBoldCheckout(reference);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createBoldCheckout = async (reference: string) => {
    if (typeof window !== 'undefined' && 'BoldCheckout' in window) {
      const data = {
        reference,
        amount: amountTotal,
        currency: 'COP',
      };

      const { hash } = await getIntegrityHash(data);

      if (typeof window !== 'undefined' && 'BoldCheckout' in window) {
        const BoldCheckout = (window as any).BoldCheckout;
        const checkout = new BoldCheckout({
          orderId: reference,
          currency: 'COP',
          amount: amountTotal,
          apiKey: process.env.NEXT_PUBLIC_BOLD_KEY,
          redirectionUrl: `${process.env.NEXT_PUBLIC_URL}/tickets/purchase/${reference}`,
          integritySignature: hash,
          description: 'Entradas para el evento',
          metadata: {
            reference,
          },
        });
        console.log('Checkout:', checkout);
        checkout.open();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (name.trim() === '') newErrors.name = 'Los nombres son requeridos';
    if (lastname.trim() === '')
      newErrors.lastname = 'Los apellidos son requeridos';
    if (!validator.isEmail(email)) newErrors.email = 'El email no es valido';
    if (document.trim() === '')
      newErrors.document = 'El documento no es valido';
    if (role.trim() === '') newErrors.role = 'El rol no es valido';

    setErrors(newErrors);

    const reference = await generateRandomString(20);

    if (Object.keys(newErrors).length === 0) {
      if (ticketEdit) {
        setTickets((prevTickets) => {
          return prevTickets.map((ticket) => {
            if (ticket.document === ticketEdit) {
              setPay(true);
              return {
                name: name || ticket.name,
                lastname: lastname || ticket.lastname,
                email: email || ticket.email,
                document: document || ticket.document,
                role: role || ticket.role,
                type: locality ?? Locality.GENERAL,
                seatNumber: seatNumber || ticket.seatNumber,
                seatRow: seatRow || ticket.seatRow,
                amount: locality ? localities[locality].amount : ticket.amount,
                reference
              };
            }
            return ticket;
          });
        });
      } else if (locality && seatNumber && seatRow) {
        const ticket: Ticket = {
          name,
          lastname,
          email,
          document,
          role,
          type: locality,
          seatNumber,
          seatRow,
          amount: localities[locality].amount,
          reference
        };
        setTickets([...tickets, ticket]);
      }
      setPay(true);
      clearForm();
    }
    return;
  };

  const clearForm = () => {
    setName('');
    setLastname('');
    setEmail('');
    setDocument('');
    setRole('Asesor político');
    setSeatNumber(null);
    setSeatConfirm(false);
    setSeatRow(undefined);
    setLocality(undefined);
    setTicketEdit(undefined);
  };

  const toggleModal = (row: string, number: number, locality: Locality) => {
    console.log(locality);
    setSeatRow(row);
    setSeatNumber(number);
    setLocality(locality);
    setIsOpen(!isOpen);
  };

  const handleSeat = () => {
    if (ticketEdit) {
      setTickets((prevTickets) => {
        return prevTickets.map((ticket) => {
          if (ticket.document === ticketEdit) {
            return {
              ...ticket,
              type: locality ?? Locality.GENERAL,
              seatNumber: seatNumber || ticket.seatNumber,
              seatRow: seatRow || ticket.seatRow,
              amount: locality ? localities[locality].amount : ticket.amount,
            };
          }
          return ticket;
        });
      });
      setPay(true);
      setTicketEdit(undefined);
    } else {
      setSeatConfirm(true);
    }

    setIsOpen(!isOpen);
  };

  const editSeat = (ticket: Ticket) => {
    setTicketEdit(ticket.document);
    setLocality(undefined);
    setSeatRow(undefined);
    setSeatNumber(null);
    setSeatConfirm(false);
    setName(ticket.name || '');
    setLastname(ticket.lastname || '');
    setEmail(ticket.email || '');
    setDocument(ticket.document || '');
    setRole(ticket.role || '');
    setPay(false);
  };

  const editInformation = (ticket: Ticket) => {
    setTicketEdit(ticket.document);
    setLocality(ticket.type);
    setSeatRow(ticket.seatRow);
    setSeatNumber(ticket.seatNumber);
    setSeatConfirm(true);
    setName(ticket.name || '');
    setLastname(ticket.lastname || '');
    setEmail(ticket.email || '');
    setDocument(ticket.document || '');
    setRole(ticket.role || '');
    setPay(false);
  };

  const deleteTicket = (ticket: Ticket) => {
    const ticketsFiltered = tickets.filter(
      (t) => t.document != ticket.document,
    );
    setTickets(ticketsFiltered);
  };

  const bgStyle = {
    height: '100%',
    backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}images/locality-bg.png')`,
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-cover bg-center" style={bgStyle}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <img
              src={`${process.env.NEXT_PUBLIC_URL}images/locality-title.png`}
              className="w-full max-w-md mx-auto"
              alt="Mapa de Localidades"
            />
          </div>

          <div className="mb-20 lg:mb-0">
            {' '}
            {!pay && !seatConfirm && (
              <div
                className={`map-container bg-gray-200 overflow-hidden ${isMobile ? 'h-[600px]' : ''}`}
              >
                <MapTickets
                  toggleModal={toggleModal}
                  seatUseds={seatsUseds}
                  isMobile={isMobile}
                />
              </div>
            )}
            <div className="">
              {pay ? (
                <TicketList
                  tickets={tickets}
                  deleteTicket={deleteTicket}
                  editSeat={editSeat}
                  editInformation={editInformation}
                  setPay={setPay}
                  amountTotal={amountTotal}
                  buy={buy}
                />
              ) : seatConfirm ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <span
                    onClick={() => setSeatConfirm(false)}
                    className="inline-block text-red-500 hover:text-white p-2 mb-4 uppercase hover:bg-red-500 cursor-pointer rounded-lg"
                  >
                    <FontAwesomeIcon
                      icon={faCircleArrowLeft}
                      className="mr-2"
                    />
                    Volver
                  </span>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 mb-4">
                      <label className="text-black">Nombres</label>
                      <InputText
                        value={name}
                        error={errors.name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 mb-4">
                      <label className="text-black">Apellidos</label>
                      <InputText
                        value={lastname}
                        error={errors.lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                      {errors.lastname && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastname}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 mb-4">
                      <label className="text-black">Correo</label>
                      <InputText
                        value={email}
                        error={errors.email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 mb-4">
                      <label className="text-black">Documento:</label>
                      <InputText
                        value={document}
                        error={errors.document}
                        onChange={(e) => setDocument(e.target.value)}
                      />
                      {errors.document && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.document}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 mb-4">
                      <label className="text-black">Rol:</label>
                      <select
                        className={`bg-gray-200 rounded-lg px-4 py-2 text-black ${
                          errors.role ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        {roles.map((role, index) => (
                          <option key={index}>{role}</option>
                        ))}
                      </select>
                      {errors.role && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.role}
                        </p>
                      )}
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-8 py-2 rounded text-lg font-semibold hover:bg-blue-600 transition duration-300"
                      >
                        Agregar Boleto
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Barra inferior fija para móviles */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4">
          <div className="flex justify-between items-center">
            <p>Boletos: {tickets.length}</p>
            {tickets.length > 0 && (
              <button
                onClick={buy}
                className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Pagar
              </button>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10 text-black mx-5 lg:mx-0">
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50"
            onClick={() => setIsOpen(!isOpen)}
          ></div>
          <div className="bg-white w:1/2 lg:w-1/4 p-4 rounded shadow-lg relative text-xs text-primary">
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsOpen(!isOpen)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="uppercase mb-6 text-lg text-center text-blue-500">
              Confirmar Asiento
            </div>
            <div className="grid grid-cols-1">
              <div className="px-2 mb-4 text-justify text-md">
                {`Estas seguro que deseas comprar el asiento `}
                <span className="font-bold text-blue-700">
                  {seatRow + '-' + seatNumber}
                </span>
                {`, puedes ver su ubicacion en el auditorio accediendo a la siguiente imagen `}
                <a
                  className="font-bold text-blue-700"
                  href={process.env.NEXT_PUBLIC_URL + 'images/mapa.png'}
                  target="_blank"
                >
                  AUDITORIO
                </a>
              </div>
              <div className="px-2">
                <button
                  onClick={handleSeat}
                  className="bg-blue-500 rounded w-full text-white text-lg font-bold py-2 mt-4"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


