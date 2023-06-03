"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/images/logo-congress.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faMailBulk, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

type Ticket = {
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

const Tickets = () => {
  const router = useRouter();

  const [token, setToken] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  // Datos de ejemplo

  React.useEffect(() => {
    getTickets();
  }, []);

  const getTickets = async () => {
    const url = process.env.NEXT_PUBLIC_URL + "api/admin/tickets";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      const responseData = await response.json();
      //   router.push("/admin/auth");
    } else if (response.status === 200) {
      const responseData = await response.json();
      setData(responseData);
    }
  };

  // Filtrar datos según el término de búsqueda
  const filteredData = data.filter((item: Ticket) => {
    if (!searchTerm || searchTerm === "") return true;
    return item.name?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const resendEmail = async (id: number) => {
    const url = process.env.NEXT_PUBLIC_URL + "api/admin/tickets/resend/" + id;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Correo enviado",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Correo no enviado",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const deleteTicket = async (id: number) => {
    const url = process.env.NEXT_PUBLIC_URL + "api/admin/tickets/delete/" + id;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Ticket Eliminado",
        showConfirmButton: false,
        timer: 1500,
      });
      getTickets()
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Ticket no eliminado",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <>
      <div className="bg-gray-100 w-full py-10 px-20">
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
                      ? "Reservada"
                      : item.lastname?.toUpperCase() + ", " + item.name}
                  </td>
                  <td className="py-2">{item.type}</td>
                  <td className="py-2">{item.row + `-` + item.number}</td>
                  <td className="py-2">
                    <FontAwesomeIcon
                      onClick={() => resendEmail(item.id)}
                      icon={faMailBulk}
                      className="text-blue-500 mr-2 cursor-pointer"
                    />
                    <FontAwesomeIcon
                      onClick={() => deleteTicket(item.id)}
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
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tickets;
