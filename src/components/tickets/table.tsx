'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faFileDownload,
  faMailBulk,
  faTimes,
  faTrash,
  faSearch,
  faCheck,
  faExclamationCircle,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import validator from 'validator';
import InputText from '@/components/form/InputText';
import {
  deleteTickets,
  downloadTicket,
  getTicketsApproved,
  resendEmailTicket,
  updateTickets,
  adminSaveTickets,
  adminEditTicket,
} from '@/services/tickets';
import {
  TicketStatus,
  TicketType,
  FilterGetTicketsInput,
  AdminCreateTicketInput,
  AdminEditTicketInput,
} from '@/types/tickets';
import TicketModal from './Modals/CreateTicket';
import EditTicketModal from './Modals/EditTicket';
import { Ticket } from '@/types/tickets';

const TicketsTable = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [data, setData] = React.useState<Ticket[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpenEdit, setIsOpenEdit] = React.useState(false);
  const [name, setName] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [documentUser, setDocumentUser] = React.useState('');

  const [ticketEdit, setTicketEdit] = React.useState<Ticket | null>(null);

  const [filters, setFilters] = React.useState<FilterGetTicketsInput>({
    status: [TicketStatus.PAID, TicketStatus.RESERVED],
  });

  React.useEffect(() => {
    getTickets();
  }, []);

  const getTickets = async () => {
    setIsLoading(true);
    try {
      const tickets = await getTicketsApproved(filters);
      setData(tickets);
    } catch (error) {
      console.error('Error obteniendo tickets:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al cargar tickets',
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = data.filter((item: Ticket) => {
    if (!searchTerm || searchTerm === '') return true;
    return (
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.document?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Paginación
  const itemsPerPage = 10; // Número de elementos por página
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleChangePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const resendEmail = async (uuid: string) => {
    try {
      const response = await resendEmailTicket(uuid);

      if (response.status === 'ok') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Correo enviado',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Correo no enviado',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error enviando email:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al enviar correo',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const downloadPDF = async (ticket: Ticket) => {
    try {
      const response = await downloadTicket(ticket.uuid);

      if (response) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        const ticketName = ticket.name
          ? `${ticket.name.toUpperCase()} ${ticket.lastname.toUpperCase()}`
          : ticket.uuid;
        link.setAttribute(
          'download',
          `CNMP_COLOMBIA_BOLETO(${ticketName}).pdf`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error('Error downloading PDF');
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al descargar PDF',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error descargando PDF:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al descargar PDF',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const deleteTicket = async (uuid: string) => {
    // Confirmar antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteTickets(uuid);

        if (response.status === 'ok') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Ticket Eliminado',
            showConfirmButton: false,
            timer: 1500,
          });
          getTickets();
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Ticket no eliminado',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.error('Error eliminando ticket:', error);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al eliminar ticket',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const editTicket = (ticket: Ticket) => {
    setIsOpenEdit(true);
    setTicketEdit(ticket);
  };

  const handleReserveTickets = async (ticket: AdminCreateTicketInput) => {
    setIsLoading(true);
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
        getTickets();
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
      setIsLoading(false);
    }
  };

  const handleEditTicket = async (ticket: AdminEditTicketInput) => {
    setIsLoading(true);
    try {
      const response = await adminEditTicket(ticket);

      if (response.status === 'ok') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Tickets Reservados',
          showConfirmButton: false,
          timer: 1500,
        });
        setIsOpenEdit(false);
        getTickets();
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
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Cabecera con búsqueda */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Lista de Tickets
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-grow">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors w-full sm:w-auto"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <span>Nuevo Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de tickets - Versión escritorio */}
      <div className="hidden md:block overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-gray-400 text-4xl mb-2"
            />
            <p>No hay tickets disponibles</p>
          </div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm leading-normal">
                <th className="py-3 px-6 text-center">Documento</th>
                <th className="py-3 px-6 text-center">Nombre</th>
                <th className="py-3 px-6 text-center">Email</th>
                <th className="py-3 px-6 text-center">Localidad</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {currentItems.map((item: Ticket) => (
                <tr
                  key={item.uuid}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                    {item.document}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="font-medium">
                      {!item.name
                        ? 'Reservada'
                        : item.lastname?.toUpperCase() + ', ' + item.name}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left text-gray-500">
                    {item.email}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs text-center ${
                        item.type === TicketType.VIP
                          ? 'bg-purple-100 text-purple-800'
                          : item.type === TicketType.GENERAL
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-4">
                      <button
                        onClick={() => resendEmail(item.uuid)}
                        className="transform hover:scale-110 hover:text-blue-500 transition-all text-gray-500"
                        title="Reenviar correo"
                      >
                        <FontAwesomeIcon icon={faMailBulk} />
                      </button>
                      <button
                        onClick={() => downloadPDF(item)}
                        className="transform hover:scale-110 hover:text-blue-500 transition-all text-gray-500"
                        title="Descargar PDF"
                      >
                        <FontAwesomeIcon icon={faFileDownload} />
                      </button>
                      <button
                        onClick={() => editTicket(item)}
                        className="transform hover:scale-110 hover:text-blue-500 transition-all text-gray-500"
                        title="Editar ticket"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => deleteTicket(item.uuid)}
                        className="transform hover:scale-110 hover:text-red-500 transition-all text-gray-500"
                        title="Eliminar ticket"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Vista móvil de tickets - Tarjetas */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-gray-400 text-4xl mb-2"
            />
            <p>No hay tickets disponibles</p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {currentItems.map((item: Ticket) => (
              <div
                key={item.uuid}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {!item.name
                        ? 'Reservada'
                        : item.lastname?.toUpperCase() + ', ' + item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{item.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.type === TicketType.VIP
                        ? 'bg-purple-100 text-purple-800'
                        : item.type === TicketType.GENERAL
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-500">Doc:</span>
                    <span className="font-medium ml-1">{item.document}</span>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => resendEmail(item.uuid)}
                      className="transform hover:scale-110 hover:text-blue-500 transition-all text-gray-500"
                      aria-label="Reenviar correo"
                    >
                      <FontAwesomeIcon icon={faMailBulk} />
                    </button>
                    <button
                      onClick={() => downloadPDF(item)}
                      className="transform hover:scale-110 hover:text-blue-500 transition-all text-gray-500"
                      aria-label="Descargar PDF"
                    >
                      <FontAwesomeIcon icon={faFileDownload} />
                    </button>
                    <button
                      onClick={() => editTicket(item)}
                      className="transform hover:scale-110 hover:text-blue-500 transition-all text-gray-500"
                      aria-label="Editar ticket"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => deleteTicket(item.uuid)}
                      className="transform hover:scale-110 hover:text-red-500 transition-all text-gray-500"
                      aria-label="Eliminar ticket"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {!isLoading && data.length > 0 && (
        <div className="p-4 flex items-center justify-center sm:justify-end">
          <div className="flex flex-wrap justify-center gap-1">
            {totalPages > 5 && currentPage > 3 && (
              <button
                onClick={() => handleChangePage(1)}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                1
              </button>
            )}

            {totalPages > 5 && currentPage > 3 && (
              <span className="px-2 py-1 text-gray-500">...</span>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 5) return true;
                return page >= currentPage - 1 && page <= currentPage + 1;
              })
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handleChangePage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 py-1 text-gray-500">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => handleChangePage(totalPages)}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {totalPages}
              </button>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <TicketModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={handleReserveTickets}
        />
      )}
      {isOpenEdit && ticketEdit && (
        <EditTicketModal
          isOpen={isOpenEdit}
          onClose={() => setIsOpenEdit(false)}
          onSave={handleEditTicket}
          ticket={ticketEdit}
        />
      )}
    </div>
  );
};

export default TicketsTable;
