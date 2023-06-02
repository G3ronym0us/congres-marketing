"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/images/logo-congress.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

type Ticket = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  document: string;
  type: string;
  role: string;
  seatNumber: number;
  seatRow: string;
};

const Tickets = () => {
  const router = useRouter();

  const [token, setToken] = React.useState('');

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
        Authorization: `Bearer ${token}`,
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
    item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Paginación
  const itemsPerPage = 5; // Número de elementos por página
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleChangePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="card bg-gray-100 p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2">Email</th>
            <th className="py-2">Opciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item: Ticket) => (
            <tr key={item.id}>
              <td className="py-2">{item.name}</td>
              <td className="py-2">{item.email}</td>
              <td className="py-2">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-blue-500 mr-2 cursor-pointer"
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-red-500 cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
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
  );
};

export default Tickets;
