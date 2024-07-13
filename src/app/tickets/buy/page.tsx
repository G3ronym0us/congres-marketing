"use client"

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
import { getIntegrityHash, getSeatsUsed, saveTickets } from '../../../services/tickets';
import { metadata } from '@/app/layout';


export default function BuyTickets() {
  const [locality, setLocality] = useState<Locality | undefined>();
  const [pay, setPay] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [seatAux, setSeatAux] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [document, setDocument] = useState<string>('');
  const [role, setRole] = useState<string>('Asesor político');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [amountTotal, setAmountTotal] = useState<number>(0);
  const [seatRow, setSeatRow] = useState<string|undefined>(undefined);
  const [seatNumber, setSeatNumber] = useState<number | null>(null);
  const [seatConfirm, setSeatConfirm] = useState<boolean>(false);
  const [seatsUseds, setSeatsUseds] = useState<SeatUsed[]>([]);
  const [ticketEdit, setTicketEdit] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    loadSeatUseds();
  }, []);

  const loadSeatUseds = async () => {
    const seatUseds = await getSeatsUsed();
    console.log(seatUseds);
    setSeatsUseds(seatUseds);
  };

  const localities = [
    {
      name: 'Diamante',
      amount: 500000,
      start: 101,
      interval: 1,
      spacing: 1,
      size: 3,
      inverse: true,
      seats: [
        { letter: 'A', quantity: 140 },
        { letter: 'B', quantity: 138 },
        { letter: 'C', quantity: 134 },
      ],
    },
    {
      name: 'Oro',
      amount: 380000,
      start: 101,
      interval: 1,
      spacing: 1,
      size: 3,
      inverse: true,
      seats: [
        { letter: 'D', quantity: 134 },
        { letter: 'E', quantity: 132 },
      ],
    },
    {
      name: 'VIP',
      amount: 300000,
      start: 101,
      interval: 1,
      spacing: 1,
      size: 3,
      inverse: true,
      seats: [
        { letter: 'F', quantity: 134 },
        { letter: 'G', quantity: 132 },
        { letter: 'H', quantity: 134 },
        { letter: 'K', quantity: 137 },
        { letter: 'J', quantity: 138 },
      ],
    },
    {
      name: 'Platea Izquierda',
      amount: 250000,
      start: 1,
      interval: 2,
      style: 'rotate-45',
      inverse: true,
      spacing: 2,
      size: 4,
      seats: [
        { letter: 'A', quantity: 17 },
        { letter: 'B', quantity: 25 },
        { letter: 'C', quantity: 27 },
        { letter: 'D', quantity: 35 },
        { letter: 'E', quantity: 27 },
        { letter: 'F', quantity: 17 },
        { letter: 'G', quantity: 11 },
        { letter: 'H', quantity: 11 },
        { letter: 'J', quantity: 5 },
      ],
    },
    {
      name: 'Platea Derecha',
      amount: 250000,
      start: 2,
      interval: 2,
      style: '-rotate-45',
      spacing: 2,
      size: 4,
      seats: [
        { letter: 'A', quantity: 20 },
        { letter: 'B', quantity: 28 },
        { letter: 'C', quantity: 34 },
        { letter: 'D', quantity: 40 },
        { letter: 'E', quantity: 44 },
        { letter: 'F', quantity: 46 },
        { letter: 'G', quantity: 26 },
        { letter: 'H', quantity: 20 },
        { letter: 'J', quantity: 14 },
        { letter: 'K', quantity: 6 },
      ],
    },
    {
      name: 'General',
      amount: 10000,
      start: 101,
      interval: 1,
      spacing: 2,
      size: 3,
      inverse: true,
      seats: [
        { letter: 'L', quantity: 132 },
        { letter: 'M', quantity: 126 },
        { letter: 'N', quantity: 126 },
        { letter: 'P', quantity: 126 },
        { letter: 'Q', quantity: 126 },
        { letter: 'R', quantity: 124 },
        { letter: 'S', quantity: 124 },
        { letter: 'T', quantity: 124 },
      ],
    },
  ];

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

      const {hash} = await getIntegrityHash(data);

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
          tax: 'vat-19',
          metadata: {
            reference,
          }
        });
        console.log('Checkout:', checkout);
        checkout.open();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
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

    if (Object.keys(newErrors).length === 0) {
      if (ticketEdit) {
        setTickets((prevTickets) => {
          return prevTickets.map((ticket) => {
            if (ticket.document === ticketEdit) {
              return {
                name: name || ticket.name,
                lastname: lastname || ticket.lastname,
                email: email || ticket.email,
                document: document || ticket.document,
                role: role || ticket.role,
                type: locality ? locality.name : ticket.type,
                seatNumber: seatNumber || ticket.seatNumber,
                seatRow: seatRow || ticket.seatRow,
                amount: locality ? locality.amount : ticket.amount,
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
          type: locality.name,
          seatNumber,
          seatRow,
          amount: locality.amount,
        };
        setTickets([...tickets, ticket]);
      }
      setPay(true);
      clearForm();
    }
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
    setTicketEdit(null);
  };

  const numberWithDots = (value: number) => {
    const formattedValue = value.toLocaleString('en-US', { useGrouping: true });
    return formattedValue.replace(/,/g, '.');
  };

  async function generateRandomString(length: number) {
    const bytes = await randomBytes(Math.ceil(length / 2));
    return bytes.toString('hex').slice(0, length);
  }

  const handleLocality = async (localityName: string) => {
    const localitySelected = localities.find(
      (loc) => loc.name === localityName,
    );
    setLocality(localitySelected);
  };

  const toggleModal = (row: string, number: number) => {
    setSeatRow(row);
    setSeatNumber(number);
    setIsOpen(!isOpen);
  };

  const handleSeat = () => {
    setSeatConfirm(true);
    setIsOpen(!isOpen);
  };

  const editSeat = (ticket: Ticket) => {
    setTicketEdit(ticket.document);
    setLocality(undefined);
    setSeatRow(undefined);
    setSeatNumber(null);
    setSeatConfirm(false);
    setName(ticket.name);
    setLastname(ticket.lastname);
    setEmail(ticket.email);
    setDocument(ticket.document);
    setRole(ticket.role);
    setPay(false);
  };

  const editInformation = (ticket: Ticket) => {
    const locality = localities.find(
      (locality) => locality.name === ticket.type,
    );
    setTicketEdit(ticket.document);
    setLocality(locality);
    setSeatRow(ticket.seatRow);
    setSeatNumber(ticket.seatNumber);
    setSeatConfirm(false);
    setName(ticket.name);
    setLastname(ticket.lastname);
    setEmail(ticket.email);
    setDocument(ticket.document);
    setRole(ticket.role);
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
      <div className="grid lg:grid-cols-1 w-full" style={bgStyle}>
        <div className="text-center px-60">
          <img
            src={`${process.env.NEXT_PUBLIC_URL}images/locality-title.png`}
            className="w-100"
            alt="Hola"
          />
        </div>
        {pay ? (
          <div className="mx-20 pb-6">
            <div className="bg-blue text-white py-4 text-center rounded text-2xl">
              Boletos: {tickets.length}
            </div>
            <div>
              {tickets.length < 1 ? (
                <div className="py-2 px-6 border border-black-600 my-2 rounded bg-gray-100">
                  Aun no se han creado boletos
                </div>
              ) : (
                tickets.map((ticket, index) => {
                  return (
                    <div
                      className="py-2 px-6 border border-black-600 my-2 rounded bg-gray-50 text-black"
                      key={index}
                    >
                      <p>
                        <span className="font-bold">Nombre:</span>{' '}
                        {ticket.lastname + ', ' + ticket.name}
                      </p>
                      <p>
                        <span className="font-bold">Email:</span> {ticket.email}
                      </p>
                      <p>
                        <span className="font-bold">Documento:</span>{' '}
                        {ticket.document}
                      </p>
                      <p>
                        <span className="font-bold">Role:</span> {ticket.role}
                      </p>
                      <p>
                        <span className="font-bold">Zona:</span> {ticket.type}
                      </p>
                      <p>
                        <span className="font-bold">Asiento:</span>{' '}
                        {ticket.seatRow + ticket.seatNumber}
                      </p>
                      <div>
                        <button
                          onClick={() => editSeat(ticket)}
                          className="p-1 mr-4 my-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg"
                        >
                          <FontAwesomeIcon icon={faEdit} className="pr-2" />
                          Editar Asiento
                        </button>
                        <button
                          onClick={() => editInformation(ticket)}
                          className="p-1 mr-4 my-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg"
                        >
                          <FontAwesomeIcon icon={faEdit} className="pr-2" />
                          Editar Información
                        </button>
                        <button
                          onClick={() => deleteTicket(ticket)}
                          className="p-1 mr-4 my-1 text-red-500 hover:bg-red-500 hover:text-white rounded-lg"
                        >
                          <FontAwesomeIcon icon={faRemove} className="pr-2" />
                          Eliminar Boleto
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="bg-blue text-white py-4 text-center rounded text-2xl">
              <div className="line-through">
                Total: $ {numberWithDots(amountTotal)}
              </div>
              <div>{'Total a Pagar: $ ' + numberWithDots(amountTotal)}</div>
            </div>

            <div className="w-full text-center">
              <button
                onClick={() => setPay(false)}
                className="bg-blue mt-2 mr-6 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white hover:bg-white hover:text-blue-500 hover:border-blue"
              >
                <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
                Comprar mas entradas
              </button>
              {tickets.length > 0 && (
                <button
                  className="bg-blue mt-2 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white hover:bg-white hover:text-blue-500 hover:border-blue"
                  onClick={buy}
                >
                  <FontAwesomeIcon icon={faMoneyBill1Wave} className="mr-2" />
                  Pagar Entradas
                </button>
              )}
            </div>
          </div>
        ) : !locality ? (
          <div className="lg:mx-60 mx-4 pb-6">
            <div className="w-full text-center text-3xl text-blue-500 py-6 font-bold">
              Seleccione la localidad
            </div>
            <div className="w-full grid grid-cols-5">
              <div className="col-span-3 col-start-2 bg-black p-6 rounded-xl text-white">
                Escenario
              </div>
              <div></div>
              <div
                onClick={() => handleLocality('Platea Izquierda')}
                className=" px-1 py-6 m-2 rounded-lg text-black-500 "
                style={{ backgroundColor: '#FFC300' }}
              >
                <div className="text-center font-bold text-sm -rotate-90 whitespace-nowrap mt-20">
                  Platea Izquierda
                </div>
                <div className="text-center text-xs whitespace-nowrap -rotate-90 ml-8 ">
                  $ 250.000
                </div>
              </div>
              <div className="col-span-3 grid grid-cols-1">
                <div
                  onClick={() => handleLocality('Diamante')}
                  className=" p-6 m-2 rounded-lg text-black-500"
                  style={{ backgroundColor: '#F600FF' }}
                >
                  <div className="text-center text-3xl font-bold">Diamante</div>
                  <div className="text-2xl">$ 500.000</div>
                </div>
                <div
                  onClick={() => handleLocality('Oro')}
                  className="p-6 m-2 rounded-lg text-black-500 "
                  style={{ backgroundColor: '#04FF00' }}
                >
                  <div className="text-center text-3xl font-bold">Oro</div>
                  <div className="text-2xl">$ 380.000</div>
                </div>
                <div
                  onClick={() => handleLocality('VIP')}
                  className=" p-6 m-2 rounded-lg text-black-500"
                  style={{ backgroundColor: '#FA7653' }}
                >
                  <div className="text-center text-3xl font-bold">VIP</div>
                  <div className="text-2xl">$ 300.000</div>
                </div>
              </div>
              <div
                onClick={() => handleLocality('Platea Derecha')}
                className=" py-6 m-2 rounded-lg text-black-500 "
                style={{ backgroundColor: '#FFC300' }}
              >
                <div className="text-center font-bold text-sm -rotate-90 whitespace-nowrap mt-20">
                  Platea Derecha
                </div>
                <div className="text-center text-xs whitespace-nowrap -rotate-90 ml-8 ">
                  $ 250.000
                </div>
              </div>
              <div
                onClick={() => handleLocality('General')}
                className=" p-12 my-2 col-start-2 rounded col-span-3 text-black-500 "
                style={{ backgroundColor: '#5F91EB' }}
              >
                <div className="text-center text-3xl font-bold">General</div>
                <div className="text-lg">$ 200.000</div>
              </div>
            </div>
          </div>
        ) : !(seatRow && seatNumber && seatConfirm) ? (
          <div className="lg:mx-20 pb-6 w-full overflow-hidden">
            <span
              onClick={() => setLocality(undefined)}
              className="inline-block mx-6 text-red-500 hover:text-white p-2 mb-4 uppercase hover:bg-red-500 cursor-pointer rounded-lg"
            >
              <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
              Volver
            </span>
            <div className="w-full text-center text-2xl text-blue-500 py-6 font-bold">
              Seleccione su Asiento{' '}
            </div>
            <div className="w-full flex justify-center">
              <div
                className="bg-white p-2 rounded-lg drop-shadow-lg text-blue-500 font-bold text-center"
                style={{ width: '100px' }}
              >
                {seatAux}{' '}
              </div>
            </div>
            <div
              className={`text-xs text-center pt-32 pb-20 mx-4 overflow-scroll overflow-hidden w-full lg:w-full `}
              style={{ touchAction: 'manipulation' }}
            >
              {locality.seats.map((row, index) => {
                const classCustom = `inline-block rounded-full uppercase bg-blue-500 min-w-2 max-w-2 cursor-pointer w-4 h-4 mr-2`;
                const classCustomUsed = `inline-block rounded-full uppercase bg-red-500 min-w-2 max-w-2 w-4 h-4 mr-2`;
                const seatElements = [];
                if (locality.inverse) {
                  for (
                    let i = row.quantity;
                    i >= locality.start;
                    i -= locality.interval
                  ) {
                    const used = seatsUseds.find(
                      (seat) =>
                        seat.type == locality.name &&
                        seat.row == row.letter &&
                        seat.number == i,
                    );
                    if (used) {
                      seatElements.push(
                        <div className={classCustomUsed} key={i}></div>,
                      );
                    } else {
                      seatElements.push(
                        <div
                          onMouseEnter={() => setSeatAux(`${row.letter}-${i}`)}
                          onClick={() => toggleModal(row.letter, i)}
                          className={classCustom}
                          key={i}
                        ></div>,
                      );
                    }
                  }
                } else {
                  for (
                    let i = locality.start;
                    i <= row.quantity;
                    i += locality.interval
                  ) {
                    const used = seatsUseds.find(
                      (seat) =>
                        seat.type == locality.name &&
                        seat.row == row.letter &&
                        seat.number == i,
                    );
                    if (used) {
                      seatElements.push(
                        <div
                          onMouseEnter={() => setSeatAux(`${row.letter}-${i}`)}
                          className={classCustomUsed}
                          key={i}
                        ></div>,
                      );
                    } else {
                      seatElements.push(
                        <div
                          onClick={() => toggleModal(row.letter, i)}
                          className={classCustom}
                          onMouseEnter={() => setSeatAux(`${row.letter}-${i}`)}
                          key={i}
                        ></div>,
                      );
                    }
                  }
                }

                return (
                  <div
                    key={index}
                    className={`my-2`}
                    style={{ whiteSpace: 'nowrap', transformStyle: 'flat' }}
                  >
                    <div
                      key={index}
                      className={`justify-center z-0 ${locality.style}`}
                    >
                      {seatElements}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="lg:mx-20 mx-6 pb-6 lg:mx-20">
            <Script
              type="text/javascript"
              src="https://checkout.wompi.co/widget.js"
            />
            <span
              onClick={() => setSeatNumber(null)}
              className="inline-block text-red-500 hover:text-white p-2 mb-4 uppercase hover:bg-red-500 cursor-pointer rounded-lg"
            >
              <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
              Volver
            </span>
            <form className="grid grid-cols-1" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 mb-4">
                <label className="text-black">Nombres</label>
                <InputText
                  value={name}
                  error={errors.name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
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
                  <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
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
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                  <p className="text-red-500 text-sm mt-1">{errors.document}</p>
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
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue mt-2 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white"
                >
                  Agregar Boleto
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="lg:hidden">
          <div className="sticky bottom-0 left-0 right-0 bg-gray-800 text-white p-4 text-center">
            <div className="inline-block">
              <p>Boletos: {tickets.length}</p>
            </div>
            {tickets.length > 0 && (
              <div className="ml-6 inline-block">
                <button
                  onClick={buy}
                  className="py-2 px-4 rounded m-1 bg-blue-500"
                >
                  Pagar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10 text-black">
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
