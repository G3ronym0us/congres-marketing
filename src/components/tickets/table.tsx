'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../../../../public/images/logo-congress.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faFileDownload,
  faMailBulk,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import validator from 'validator';
import InputText from '@/components/form/InputText';
import Cookies from 'js-cookie';
import {
  deleteTickets,
  downloadTicket,
  getTicketsApproved,
  resendEmailTicket,
  updateTickets,
} from '@/services/tickets';

type Ticket = {
  uuid: string;
  id: number;
  name: string;
  lastname: string;
  email: string;
  document: string;
  type: string;
  role: string;
  number: number;
  row: string;
};

type TicketError = {
  name?: string;
  lastname?: string;
  email?: string;
  document?: string;
};

const TicketsTable = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  // Datos de ejemplo

  const [name, setName] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [documentUser, setDocumentUser] = React.useState('');

  const [errors, setErrors]: any = React.useState({});
  const [ticketEdit, setTicketEdit]: any = React.useState({});

  React.useEffect(() => {
    getTickets();
  }, []);

  const getTickets = async () => {
    const tickets = await getTicketsApproved();
    setData(tickets);
  };

  const filteredData = data.filter((item: Ticket) => {
    if (!searchTerm || searchTerm === '') return true;
    return (
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.document?.toLowerCase().includes(searchTerm.toLowerCase())
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
  };

  const downloadPDF = async (ticket: Ticket) => {
    const response = await downloadTicket(ticket.uuid);

    if (response) {
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      const ticketName = ticket.name
        ? `${ticket.name.toUpperCase()} ${ticket.lastname.toUpperCase()}`
        : ticket.uuid;
      link.setAttribute('download', `CNMP_COLOMBIA_BOLETO(${ticketName}).pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      console.error('Error downloading PDF');
    }
  };

  const deleteTicket = async (uuid: string) => {
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
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newErrors: TicketError = {};

    if (name.trim() === '') newErrors.name = 'Los nombres son requeridos';
    if (lastname.trim() === '')
      newErrors.lastname = 'Los apellidos son requeridos';
    if (!validator.isEmail(email)) newErrors.email = 'El email no es valido';
    if (documentUser.trim() === '')
      newErrors.document = 'El documento no es valido';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data: Ticket = {
        ...ticketEdit,
        name: name ?? ticketEdit.name,
        lastname: lastname ?? ticketEdit.lastname,
        email: email ?? ticketEdit.email,
        document: documentUser ?? ticketEdit.document,
      };

      const response = await updateTickets(data);

      if (response.status === 'ok') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Ticket editado',
          showConfirmButton: false,
          timer: 1500,
        });
        getTickets();
        setIsOpen(!isOpen);
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Ticket no editado',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const editTicket = (ticket: Ticket) => {
    setIsOpen(!isOpen);
    setTicketEdit(ticket);
    setName(ticket.name);
    setLastname(ticket.lastname);
    setDocumentUser(ticket.document);
    setEmail(ticket.email);
  };

  return (
    <>
      <div className="bg-gray-100 w-full py-10 px-20 text-black">
        <div className=" bg-white p-4 mt-10 rounded-lg">
          <div className=" mt-4 w-full">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <table className="min-w-full bg-white m-2 text-center">
            <thead>
              <tr>
                <th className="py-2">Documento</th>
                <th className="py-2">Nombre</th>
                <th className="py-2">Localidad</th>
                <th className="py-2">Asiento</th>
                <th className="py-2">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item: Ticket) => (
                <tr key={item.id}>
                  <td className="py-2">{item.document}</td>
                  <td className="py-2">
                    {!item.name
                      ? 'Reservada'
                      : item.lastname?.toUpperCase() + ', ' + item.name}
                  </td>
                  <td className="py-2">{item.type}</td>
                  <td className="py-2">{item.row + `-` + item.number}</td>
                  <td className="py-2">
                    <FontAwesomeIcon
                      onClick={() => resendEmail(item.uuid)}
                      icon={faMailBulk}
                      className="text-blue-500 mr-2 cursor-pointer"
                    />
                    <FontAwesomeIcon
                      onClick={() => downloadPDF(item)}
                      icon={faFileDownload}
                      className="text-blue-500 mr-2 cursor-pointer"
                    />
                    <FontAwesomeIcon
                      onClick={() => editTicket(item)}
                      icon={faEdit}
                      className="text-blue-500 mr-2 cursor-pointer"
                    />
                    <FontAwesomeIcon
                      onClick={() => deleteTicket(item.uuid)}
                      icon={faTrash}
                      className="text-red-500 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 text-right pr-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handleChangePage(i + 1)}
                className={`px-3 py-1 border ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
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
              Editar Ticket
            </div>
            <div className="grid grid-cols-1">
              <form className="grid grid-cols-1" onSubmit={handleSubmit}>
                <div className="px-2 mb-4 text-justify text-md">
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
                      value={documentUser}
                      error={errors.document}
                      onChange={(e) => setDocumentUser(e.target.value)}
                    />
                    {errors.document && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.document}
                      </p>
                    )}
                  </div>
                </div>
                <div className="px-2">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 rounded w-full text-white text-lg font-bold py-2 mt-4"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketsTable;
