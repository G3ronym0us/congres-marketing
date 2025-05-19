'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicketAlt,
  faChair,
  faMapMarkerAlt,
  faCheckCircle,
  faExclamationCircle,
  faUserPlus,
  faSave,
  faTrash,
  faEdit,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { BeatLoader } from 'react-spinners';
import {
  AdminCreateTicketInput,
  SeatUsed,
  Ticket,
  TicketType,
} from '@/types/tickets';
import { adminSaveTickets } from '@/services/tickets';
import { generateRandomString } from '@/utils/utils';
import { localidadesData } from '@/data/ticketsData';
import TicketModal from './Modals/CreateTicket';

const ReserveTickets = () => {
  // Estados para el formulario
  const [loading, setLoading] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ticketEdit, setTicketEdit] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false); // Para modal de confirmación
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    available: 0,
    reserved: 0,
  });

  // Función para reservar todos los tickets
  const handleReserveTickets = async (ticket: AdminCreateTicketInput) => {
    setLoading(true);
    try {
      const response = await adminSaveTickets(ticket);

      if (response.status === 'ok') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Tickets Reservados',
          showConfirmButton: false,
          timer: 1500,
        });
        setIsOpen(false);
      } else {
        throw new Error('Error al reservar tickets');
      }
    } catch (error) {
      console.error('Error al reservar tickets:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron reservar los tickets',
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para editar un ticket existente
  const editTicket = (index: number) => {
    const ticket = tickets[index];
    setTicketEdit(index);
    setIsOpen(true);
  };

  // Función para eliminar un ticket
  const deleteTicket = (index: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const newTickets = [...tickets];
        newTickets.splice(index, 1);

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Ticket eliminado',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  // Función para abrir el modal de agregar ticket
  const openAddTicketModal = () => {
    setTicketEdit(null);
    setErrors({});
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Resumen de tickets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4 flex-shrink-0">
            <FontAwesomeIcon
              icon={faTicketAlt}
              className="text-blue-600 h-5 w-5"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Asientos</p>
            <p className="text-2xl font-bold text-gray-800">
              {ticketStats.total}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4 flex-shrink-0">
            <FontAwesomeIcon
              icon={faChair}
              className="text-green-600 h-5 w-5"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600">Disponibles</p>
            <p className="text-2xl font-bold text-gray-800">
              {ticketStats.available}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4 flex-shrink-0">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-purple-600 h-5 w-5"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600">Reservados</p>
            <p className="text-2xl font-bold text-gray-800">
              {ticketStats.reserved}
            </p>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de tickets */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon
                icon={faTicketAlt}
                className="mr-2 text-blue-600"
              />
              Reservar Tickets
            </h3>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Para reservar tickets, por favor agrega los datos del asistente
                y el tipo de ticket deseado.
              </p>

              <button
                onClick={openAddTicketModal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Agregar Nuevo Ticket
              </button>
            </div>

            {/* Información de precios */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-700 mb-3">
                Precios por Localidad
              </h4>
              <div className="space-y-3">
                {Object.values(TicketType).map(
                  (type: TicketType, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full bg-${localidadesData[type].color}-500 mr-2`}
                        ></span>
                        <span className="font-medium">
                          {localidadesData[type].name}
                        </span>
                      </div>
                      <span className="font-bold">
                        ${localidadesData[type].price}.00
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Tickets */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon
                icon={faTicketAlt}
                className="mr-2 text-blue-600"
              />
              Tickets Agregados
            </h3>

            {tickets.length > 0 ? (
              <div className="space-y-4 mb-6">
                {tickets.map((ticket, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="mb-3 sm:mb-0">
                        <div className="flex items-center mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              ticket.type === TicketType.VIP
                                ? 'bg-purple-100 text-purple-800'
                                : ticket.type === TicketType.GENERAL
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                            } inline-block mr-2`}
                          >
                            {ticket.type}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ${localidadesData[ticket.type]?.price}.00
                          </span>
                        </div>
                        <p className="font-medium">
                          {`${ticket.name} ${ticket.lastname}`.trim() ||
                            'Sin nombre'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {ticket.email || 'Sin correo'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Doc: {ticket.document || 'Sin documento'}
                        </p>
                      </div>
                      <div className="flex sm:flex-col justify-end space-x-2 sm:space-x-0 sm:space-y-2">
                        <button
                          onClick={() => editTicket(index)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => deleteTicket(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Eliminar"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-gray-50 rounded-lg mb-6">
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="text-gray-400 text-4xl mb-3"
                />
                <p className="text-lg text-gray-600 font-medium mb-2">
                  No hay tickets agregados
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Agrega tickets utilizando el botón en el panel izquierdo
                </p>
                <button
                  onClick={openAddTicketModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                  Agregar Ticket
                </button>
              </div>
            )}

            {tickets.length > 0 && (
              <div className="mt-6">
                <div className="border-t border-gray-200 pt-4 pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Tickets:</span>
                    <span className="font-medium">{tickets.length}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Precio por Ticket:</span>
                    <span className="font-medium">Varía por tipo</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-lg text-blue-600">
                      $
                      {tickets.reduce((sum, ticket) => {
                        const price = localidadesData[ticket.type]?.price || 0;
                        return sum + price;
                      }, 0)}
                      .00
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar ticket */}
      {isOpen && (
        <TicketModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={handleReserveTickets}
        />
      )}
    </div>
  );
};

export default ReserveTickets;
