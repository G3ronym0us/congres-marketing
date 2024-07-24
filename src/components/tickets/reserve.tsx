'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import MapTickets from '@/components/tickets/Map';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowLeft,
  faCirclePlus,
  faEdit,
  faRemove,
  faSave,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { BeatLoader } from 'react-spinners';
import {
  AdminCreateTicketInput,
  localities,
  Locality,
  SeatUsed,
  Ticket,
} from '@/types/tickets';
import { adminSaveTickets, getTicketsApproved } from '@/services/tickets';
import { generateRandomString } from '@/utils/utils';

export default function ReserveTickets() {
  const [locality, setLocality] = useState<Locality>();
  const [pay, setPay] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [seatRow, setSeatRow] = useState<string | undefined>(undefined);
  const [seatNumber, setSeatNumber] = useState<number | undefined>(undefined);
  const [seatsUseds, setSeatsUseds] = useState<SeatUsed[]>([]);
  const [ticketEdit, setTicketEdit] = useState<AdminCreateTicketInput>();
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
    getSeatsUseds();
  }, []);

  const getSeatsUseds = async () => {
    const response = await getTicketsApproved();
    setSeatsUseds(response);
  };

  const reserveTicket = async () => {
    setLoading(true);

    const response = await adminSaveTickets(tickets);

    if (response.status === 'ok') {
      getSeatsUseds();
      clearForm();
      setTickets([]);
      setPay(false);
      setLoading(false);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Asientos Reservados',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setSeatNumber(undefined);
    setSeatRow(undefined);
    setLocality(undefined);
    setTicketEdit(undefined);
  };

  const toggleModal = (row: string, number: number, locality: Locality) => {
    setSeatRow(row);
    setSeatNumber(number);
    setLocality(locality);
    setIsOpen(!isOpen);
  };

  const handleSeat = async () => {
    if (ticketEdit) {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>{
          return ticket === ticketEdit
            ? {
                ...ticket,
                type: locality || ticket.type,
                seatNumber: seatNumber || ticket.seatNumber,
                seatRow: seatRow || ticket.seatRow,
                amount: locality ? localities[locality].amount : ticket.amount,
              }
            : ticket}
        )
      );
    } else {
      if (!locality || !seatNumber || !seatRow) return;
      const reference = await generateRandomString(20);
      const newTicket = {
        type: locality,
        seatNumber,
        seatRow,
        amount: localities[locality].amount,
        reference
      };
      setTickets([...tickets, newTicket]);
    }
    clearForm();
    setPay(true);
    setIsOpen(false);
  };

  const editSeat = (ticket: AdminCreateTicketInput) => {
    setTicketEdit(ticket);
    setLocality(undefined);
    setSeatRow(undefined);
    setSeatNumber(undefined);
    setPay(false);
  };

  const deleteTicket = (ticket: AdminCreateTicketInput) => {
    setTickets(tickets.filter((t) => t !== ticket));
  };

  const bgStyle = {
    height: '100%',
    backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}images/locality-bg.png')`,
  };

  return (
    <>
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
            {!pay && (
              <div
                className={`map-container bg-gray-200 overflow-hidden ${
                  isMobile ? 'h-[600px]' : ''
                }`}
              >
                <MapTickets
                  toggleModal={toggleModal}
                  seatUseds={seatsUseds}
                  isMobile={isMobile}
                />
              </div>
            )}
            <div className="">
              {pay && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4">Boletos Reservados</h2>
                  {tickets.map((ticket, index) => (
                    <div key={index} className="mb-4 p-4 border rounded text-black">
                      <p>
                        <span className="font-bold">Zona:</span> {ticket.type}
                      </p>
                      <p>
                        <span className="font-bold">Asiento:</span>{' '}
                        {ticket.seatRow + ticket.seatNumber}
                      </p>
                      <div className="mt-2">
                        <button
                          onClick={() => editSeat(ticket)}
                          className="mr-2 text-blue-500 hover:text-blue-700"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          Editar
                        </button>
                        <button
                          onClick={() => deleteTicket(ticket)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faRemove} className="mr-1" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    {loading ? (
                      <BeatLoader color="#478acf" size={30} />
                    ) : (
                      <>
                        <button
                          onClick={() => setPay(false)}
                          className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
                        >
                          <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
                          Reservar más
                        </button>
                        <button
                          onClick={reserveTicket}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          <FontAwesomeIcon icon={faSave} className="mr-2" />
                          Confirmar Reserva
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
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
              Confirmar Reserva de Asiento
            </div>
            <div className="grid grid-cols-1">
              <div className="px-2 mb-4 text-justify text-md text-black">
                {`¿Estás seguro que deseas reservar el asiento `}
                <span className="font-bold text-blue-700">
                  {seatRow + '-' + seatNumber}
                </span>
                {`?`}
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