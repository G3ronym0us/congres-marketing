"use client";

import InputText from "@/components/form/InputText";
import Navbar from "@/components/navbar";
import { randomBytes } from "crypto";
import Script from "next/script";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faCircleArrowLeft,
  faCirclePlus,
  faDeleteLeft,
  faEdit,
  faMoneyBill1Wave,
  faRemove,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import validator from "validator";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";

export default function BuyTickets() {
  const [locality, setLocality] = useState(null);
  const [pay, setPay] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [seatRow, setSeatRow] = useState(null);
  const [seatNumber, setSeatNumber] = useState(null);
  const [seatsUseds, setSeatsUseds] = useState([]);
  const [ticketEdit, setTicketEdit] = useState(null);
  const [useCode, setUseCode] = useState(false);
  const [code, setCode] = useState(null);
  const [seatAux, setSeatAux] = useState("");

  useEffect(() => {
    getSeatsUseds();
  }, []);

  const localities = [
    {
      name: "Diamante",
      amount: 500000,
      start: 101,
      interval: 1,
      spacing: 1,
      size: 3,
      inverse: true,
      seats: [
        { letter: "A", quantity: 140 },
        { letter: "B", quantity: 138 },
        { letter: "C", quantity: 134 },
      ],
    },
    {
      name: "Oro",
      amount: 380000,
      start: 101,
      interval: 1,
      spacing: 1,
      size: 3,
      inverse: true,
      seats: [
        { letter: "D", quantity: 134 },
        { letter: "E", quantity: 132 },
      ],
    },
    {
      name: "VIP",
      amount: 300000,
      start: 101,
      interval: 1,
      spacing: 1,
      size: 3,
      inverse: true,
      seats: [
        { letter: "F", quantity: 134 },
        { letter: "G", quantity: 132 },
        { letter: "H", quantity: 134 },
        { letter: "K", quantity: 137 },
        { letter: "J", quantity: 138 },
      ],
    },
    {
      name: "Platea Izquierda",
      amount: 250000,
      start: 1,
      interval: 2,
      style: "rotate-45",
      inverse: true,
      spacing: 2,
      size: 4,
      seats: [
        { letter: "A", quantity: 17 },
        { letter: "B", quantity: 25 },
        { letter: "C", quantity: 27 },
        { letter: "D", quantity: 35 },
        { letter: "E", quantity: 27 },
        { letter: "F", quantity: 17 },
        { letter: "G", quantity: 11 },
        { letter: "H", quantity: 11 },
        { letter: "J", quantity: 5 },
      ],
    },
    {
      name: "Platea Derecha",
      amount: 250000,
      start: 2,
      interval: 2,
      style: "-rotate-45",
      spacing: 2,
      size: 4,
      seats: [
        { letter: "A", quantity: 20 },
        { letter: "B", quantity: 28 },
        { letter: "C", quantity: 34 },
        { letter: "D", quantity: 40 },
        { letter: "E", quantity: 44 },
        { letter: "F", quantity: 46 },
        { letter: "G", quantity: 26 },
        { letter: "H", quantity: 20 },
        { letter: "J", quantity: 14 },
        { letter: "K", quantity: 6 },
      ],
    },
    {
      name: "General",
      amount: 200000,
      start: 101,
      interval: 1,
      spacing: 2,
      size: 3,
      inverse: true,
      seats: [
        { letter: "L", quantity: 132 },
        { letter: "M", quantity: 126 },
        { letter: "N", quantity: 126 },
        { letter: "P", quantity: 126 },
        { letter: "Q", quantity: 126 },
        { letter: "R", quantity: 124 },
        { letter: "S", quantity: 124 },
        { letter: "T", quantity: 124 },
      ],
    },
  ];

  const roles = [
    "Asesor político",
    "Candidato",
    "Estudiante Universitario",
    "Docente Universitario",
    "Otro",
  ];

  const ticketsType = [
    {
      name: "Zona Diamante",
      amount: 390000,
      value: "diamond",
    },
    {
      name: "Zona VIP",
      amount: 330000,
      value: "vip",
    },
  ];

  const buyWithCode = async () => {
    setLoading(true);

    const newErrors = {};
    const data = { tickets, code };
    const apiUrl = process.env.NEXT_PUBLIC_URL + "api/ticket/save_code";

    postData(apiUrl, data)
      .then((response) => {
        getSeatsUseds();
        clearForm();
        setTickets([]);
        setPay(false);
        setUseCode(false);
        setErrors(newErrors);
        setLoading(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Asientos Reservados",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        newErrors.code = "El codigo no es valido!";
        setErrors(newErrors);
        setLoading(false);
      });
  };

  const clearForm = () => {
    setSeatNumber(null);
    setSeatRow(null);
    setLocality(null);
    setTicketEdit(null);
  };

  async function generateRandomString(length) {
    const bytes = await randomBytes(Math.ceil(length / 2));
    return bytes.toString("hex").slice(0, length);
  }

  async function postData(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud POST");
    }

    const responseData = await response.json();
    return responseData;
  }

  const handleLocality = async (localityName) => {
    const localitySelected = localities.find(
      (loc) => loc.name === localityName
    );
    setLocality(localitySelected);
  };

  const handleSeat = async (row, number) => {
    const reference = await generateRandomString(20);

    setSeatRow(row);
    setSeatNumber(number);

    if (ticketEdit) {
      setTickets(() => {
        return tickets.map((ticket) => {
          if (ticket.document == ticketEdit) {
            return {
              type: locality ? locality.name : ticket.type,
              seatNumber: number ? number : ticket.seatNumber,
              seatRow: row ? row : ticket.seatRow,
              amount: locality ? locality.amount : ticket.amount,
              document: ticket.document,
            };
          }
          return ticket;
        });
      });
    } else {
      const ticket = {
        type: locality.name,
        seatNumber: number,
        seatRow: row,
        amount: locality.amount,
        document: reference,
      };
      setTickets([...tickets, ticket]);
    }
    clearForm();
    setPay(true);
  };

  const getSeatsUseds = async () => {
    const url = process.env.NEXT_PUBLIC_URL + "api/ticket/all";
    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setSeatsUseds(response.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editSeat = (ticket) => {
    setTicketEdit(ticket.document);
    setLocality(null);
    setSeatRow(null);
    setSeatNumber(null);
    setPay(false);
  };

  const deleteTicket = (ticket) => {
    const ticketsFiltered = tickets.filter(
      (t) => t.document != ticket.document
    );
    setTickets(ticketsFiltered);
  };

  return (
    <>
      <Navbar />
      <div
        className="grid lg:grid-cols-1 bg-gray-100 w-full"
        style={{ height: "100%" }}
      >
        {pay ? (
          <div div className="mx-20 py-6">
            <div className="bg-blue py-4 text-center rounded text-2xl">
              <span className="text-white">Boletos: {tickets.length} </span>
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
                        <span className="font-bold">Documento:</span>{" "}
                        {ticket.document}
                      </p>
                      <p>
                        <span className="font-bold">Zona:</span> {ticket.type}
                      </p>
                      <p>
                        <span className="font-bold">Asiento:</span>{" "}
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
            <div className="bg-blue text-white py-4 text-center rounded text-2xl"></div>

            <div className="w-full text-center">
              {!useCode ? (
                <>
                  <button
                    onClick={() => setPay(false)}
                    className="bg-blue mt-2 mr-6 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white hover:bg-white hover:text-blue-500 hover:border-blue"
                  >
                    <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
                    Reservar mas entradas
                  </button>
                  {tickets.length > 0 && (
                    <>
                      <button
                        className="bg-blue mt-2 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white hover:bg-white hover:text-blue-500 hover:border-blue"
                        onClick={() => setUseCode(true)}
                      >
                        <FontAwesomeIcon
                          icon={faMoneyBill1Wave}
                          className="mr-2"
                        />
                        Usar Codigo
                      </button>
                    </>
                  )}
                </>
              ) : (
                tickets.length > 0 &&
                (loading ? (
                  <BeatLoader color="#478acf" size={30} className="py-6" />
                ) : (
                  <>
                    <div>
                      <input
                        type="text"
                        className={`bg-white shadow-lg rounded-lg px-4 mr-6 py-2 text-black ${
                          errors.code ? "border-red-500" : "border-gray-300"
                        }`}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />

                      <button
                        className="bg-blue mt-2 mr-6 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white hover:bg-white hover:text-blue-500 hover:border-blue"
                        onClick={buyWithCode}
                      >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Validar
                      </button>
                      <button
                        className="bg-red-500 mt-2 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white hover:bg-white hover:text-blue-500 hover:border-blue"
                        onClick={() => setUseCode(false)}
                      >
                        <FontAwesomeIcon icon={faCancel} className="mr-2" />
                        Cancelar
                      </button>
                    </div>

                    {errors.code && (
                      <div>
                        <p className="text-red-500 text-sm mt-2">
                          {errors.code}
                        </p>
                      </div>
                    )}
                  </>
                ))
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
                onClick={() => handleLocality("Platea Izquierda")}
                className=" px-1 py-6 m-2 rounded-lg text-black-500 "
                style={{ backgroundColor: "#FFC300" }}
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
                  onClick={() => handleLocality("Diamante")}
                  className=" p-6 m-2 rounded-lg text-black-500"
                  style={{ backgroundColor: "#F600FF" }}
                >
                  <div className="text-center text-3xl font-bold">Diamante</div>
                  <div className="text-2xl">$ 500.000</div>
                </div>
                <div
                  onClick={() => handleLocality("Oro")}
                  className="p-6 m-2 rounded-lg text-black-500 "
                  style={{ backgroundColor: "#04FF00" }}
                >
                  <div className="text-center text-3xl font-bold">Oro</div>
                  <div className="text-2xl">$ 380.000</div>
                </div>
                <div
                  onClick={() => handleLocality("VIP")}
                  className=" p-6 m-2 rounded-lg text-black-500"
                  style={{ backgroundColor: "#FA7653" }}
                >
                  <div className="text-center text-3xl font-bold">VIP</div>
                  <div className="text-2xl">$ 300.000</div>
                </div>
              </div>
              <div
                onClick={() => handleLocality("Platea Derecha")}
                className=" py-6 m-2 rounded-lg text-black-500 "
                style={{ backgroundColor: "#FFC300" }}
              >
                <div className="text-center font-bold text-sm -rotate-90 whitespace-nowrap mt-20">
                  Platea Derecha
                </div>
                <div className="text-center text-xs whitespace-nowrap -rotate-90 ml-8 ">
                  $ 250.000
                </div>
              </div>
              <div
                onClick={() => handleLocality("General")}
                className=" p-12 my-2 col-start-2 rounded col-span-3 text-black-500 "
                style={{ backgroundColor: "#5F91EB" }}
              >
                <div className="text-center text-3xl font-bold">General</div>
                <div className="text-lg">$ 200.000</div>
              </div>
            </div>
          </div>
        ) : (
          !(seatRow && seatNumber) && (
            <div className="lg:mx-20 mx-6 py-6 w-full overflow-hidden">
              <span
                onClick={() => setLocality(null)}
                className="inline-block text-red-500 hover:text-white p-2 mb-4 uppercase hover:bg-red-500 cursor-pointer rounded-lg"
              >
                <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
                Volver
              </span>
              <div className="w-full text-center text-2xl text-blue-500 py-6 font-bold">
                Seleccione su Asiento
              </div>
              <div className="w-full flex justify-center">
                <div
                  className="bg-white p-2 rounded-lg drop-shadow-lg text-blue-500 font-bold text-center"
                  style={{ width: "100px" }}
                >
                  {seatAux}{" "}
                </div>
              </div>
              <div
                className={`text-xs text-center pt-32 pb-20 overflow-scroll overflow-hidden w-screen lg:w-full `}
                style={{ touchAction: "manipulation" }}
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
                          seat.number == i
                      );
                      if (used) {
                        seatElements.push(
                          <div className={classCustomUsed} key={i}></div>
                        );
                      } else {
                        seatElements.push(
                          <div
                            onMouseEnter={() =>
                              setSeatAux(`${row.letter}-${i}`)
                            }
                            onClick={() => handleSeat(row.letter, i)}
                            className={classCustom}
                            key={i}
                          ></div>
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
                          seat.number == i
                      );
                      if (used) {
                        seatElements.push(
                          <div
                            onMouseEnter={() =>
                              setSeatAux(`${row.letter}-${i}`)
                            }
                            className={classCustomUsed}
                            key={i}
                          ></div>
                        );
                      } else {
                        seatElements.push(
                          <div
                            onMouseEnter={() =>
                              setSeatAux(`${row.letter}-${i}`)
                            }
                            onClick={() => handleSeat(row.letter, i)}
                            className={classCustom}
                            key={i}
                          ></div>
                        );
                      }
                    }
                  }

                  return (
                    <div
                      key={index}
                      className={`my-2`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <div
                        key={index}
                        className={`justify-center  ${locality.style}`}
                      >
                        {seatElements}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
