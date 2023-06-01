"use client"

import InputText from '@/components/form/InputText';
import Navbar from '@/components/navbar';
import { randomBytes } from 'crypto';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCircleArrowLeft, faCirclePlus, faDeleteLeft, faEdit, faMoneyBill1Wave, faRemove, faSave } from '@fortawesome/free-solid-svg-icons';
import validator from 'validator';

export default function BuyTickets() {


    const [locality, setLocality] = useState(null);
    const [pay, setPay] = useState(false);
    const [errors, setErrors] = useState({});
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [document, setDocument] = useState('');
    const [role, setRole] = useState('Asesor político');
    const [tickets, setTickets] = useState([]);
    const [selectedOption, setSelectedOption] = useState('diamond');
    const [amountTotal, setAmountTotal] = useState(0);
    const [seatRow, setSeatRow] = useState(null);
    const [seatNumber, setSeatNumber] = useState(null);
    const [seatsUseds, setSeatsUseds] = useState([]);
    const [ticketEdit, setTicketEdit] = useState(null);

    useEffect(() => {
        getSeatsUseds();
    }, [])

    const localities = [
        {
            name: 'Diamante',
            amount: 380000,
            start: 101,
            interval: 1,
            spacing: 1,
            size: 3,
            seats: [
                { letter: 'D', quantity: 134 },
                { letter: 'C', quantity: 134 },
                { letter: 'B', quantity: 138 },
                { letter: 'A', quantity: 140 }
            ]
        },
        {
            name: 'Oro',
            amount: 320000,
            start: 101,
            interval: 1,
            spacing: 1,
            size: 3,
            seats: [
                { letter: 'J', quantity: 138 },
                { letter: 'K', quantity: 137 },
                { letter: 'H', quantity: 134 },
                { letter: 'G', quantity: 132 },
                { letter: 'F', quantity: 134 },
                { letter: 'E', quantity: 132 }
            ]
        },
        {
            name: 'Platea Izquierda',
            amount: 250000,
            start: 2,
            interval: 2,
            style: '-rotate-45',
            inverse: true,
            spacing: 2,
            size: 4,
            seats: [
                { letter: 'K', quantity: 6 },
                { letter: 'J', quantity: 14 },
                { letter: 'H', quantity: 20 },
                { letter: 'G', quantity: 26 },
                { letter: 'F', quantity: 48 },
                { letter: 'E', quantity: 44 },
                { letter: 'D', quantity: 40 },
                { letter: 'C', quantity: 34 },
                { letter: 'B', quantity: 28 },
                { letter: 'A', quantity: 20 }
            ]
        },
        {
            name: 'Platea Derecha',
            amount: 250000,
            start: 1,
            interval: 2,
            style: 'rotate-45',
            spacing: 2,
            size: 4,
            seats: [
                { letter: 'J', quantity: 5 },
                { letter: 'H', quantity: 11 },
                { letter: 'G', quantity: 11 },
                { letter: 'F', quantity: 17 },
                { letter: 'E', quantity: 27 },
                { letter: 'D', quantity: 35 },
                { letter: 'C', quantity: 27 },
                { letter: 'B', quantity: 25 },
                { letter: 'A', quantity: 17 }
            ]
        },
        {
            name: 'General',
            amount: 150000,
            start: 101,
            interval: 1,
            spacing: 2,
            size: 3,
            seats: [
                { letter: 'T', quantity: 124 },
                { letter: 'S', quantity: 124 },
                { letter: 'R', quantity: 124 },
                { letter: 'Q', quantity: 126 },
                { letter: 'P', quantity: 126 },
                { letter: 'N', quantity: 126 },
                { letter: 'M', quantity: 126 },
                { letter: 'L', quantity: 132 },
            ]
        }
    ]

    const roles = [
        'Asesor político',
        'Candidato',
        'Estudiante Universitario',
        'Docente Universitario',
        'Otro',
    ]

    const ticketsType = [
        {
            name: "Zona Diamante",
            amount: 390000,
            value: 'diamond'
        },
        {
            name: "Zona VIP",
            amount: 330000,
            value: 'vip'
        },
    ]

    useEffect(() => {
        setAmountTotal(tickets.reduce((total, ticket) => total + ticket.amount, 0))
    }, [tickets])

    const buy = async () => {

        const reference = await generateRandomString(20);
        const data = { tickets, reference };
        const apiUrl = process.env.NEXT_PUBLIC_URL + 'api/ticket/save';

        postData(apiUrl, data)
            .then((response) => {
                console.log('Respuesta:', response);
            })
            .catch((error) => {
                console.error('Error:', error);
                return;
            });

        const checkout = await new WidgetCheckout({
            currency: 'COP',
            amountInCents: amountTotal * 90,
            reference: reference,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            // redirectUrl: 'https://transaction-redirect.wompi.co/check', // Opcional
            taxInCents: { // Opcional
                vat: 1900,
                consumption: 800
            },
        });

        checkout.open(function (result) {
            var transaction = result.transaction
            console.log('Transaction ID: ', transaction.id)
            console.log('Transaction object: ', transaction)
            clearForm();
            setTickets([]);
            setPay(false);
        })
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (name.trim() === '') newErrors.name = 'Los nombres son requeridos';
        if (lastname.trim() === '') newErrors.lastname = 'Los apellidos son requeridos';
        if (!validator.isEmail(email)) newErrors.email = 'El email no es valido';
        if (document.trim() === '') newErrors.document = 'El documento no es valido';
        if (role.trim() === '') newErrors.role = 'El rol no es valido';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            if (ticketEdit) {
                setTickets(() => {
                    return tickets.map(ticket => {
                        if (ticket.document == ticketEdit) {
                            return {
                                name: name ? name : ticket.name,
                                lastname: lastname ? lastname : ticket.lastname,
                                email: email ? email : ticket.email,
                                document: document ? document : ticket.document,
                                role: role ? role : ticket.role,
                                type: locality ? locality.name : ticket.type,
                                seatNumber: seatNumber ? seatNumber : ticket.seatNumber,
                                seatRow: seatRow ? seatRow : ticket.seatRow,
                                amount: locality ? locality.amount : ticket.amount,
                            }
                        }
                        return ticket;
                    })
                })
            } else {
                const ticket = {
                    name,
                    lastname,
                    email,
                    document,
                    role,
                    type: locality.name,
                    seatNumber,
                    seatRow,
                    amount: locality.amount,
                }
                setTickets([...tickets, ticket])
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
        setSeatRow(null);
        setLocality(null);
        setTicketEdit(null)
    }

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const radioStyles = (value) =>
        selectedOption === value
            ? 'border-2 border-indigo-500 bg-indigo-500 text-white'
            : 'border border-gray-300';

    const numberWithDots = (value) => {
        const formattedValue = value.toLocaleString('en-US', { useGrouping: true });
        return formattedValue.replace(/,/g, '.');
    };

    async function generateRandomString(length) {
        const bytes = await randomBytes(Math.ceil(length / 2));
        return bytes.toString('hex').slice(0, length);
    }

    async function postData(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud POST');
        }

        const responseData = await response.json();
        return responseData;
    }

    const handleLocality = async (localityName) => {
        const localitySelected = localities.find((loc) => loc.name === localityName)
        setLocality(localitySelected)
    }

    const handleSeat = (row, number) => {
        setSeatRow(row);
        setSeatNumber(number);
    }

    const getSeatsUseds = async () => {
        const url = process.env.NEXT_PUBLIC_URL + 'api/ticket/all'
        await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .then((response) => {
                setSeatsUseds(response.result)
            }).
            catch((error) => {
                console.log(error);
            });

    }

    const editSeat = (ticket) => {
        setTicketEdit(ticket.document);
        setLocality(null);
        setSeatRow(null);
        setSeatNumber(null);
        setName(ticket.name);
        setLastname(ticket.lastname);
        setEmail(ticket.email);
        setDocument(ticket.document);
        setRole(ticket.role);
        setPay(false);
    }

    const editInformation = (ticket) => {
        const locality = localities.find((locality) => locality.name === ticket.type)
        setTicketEdit(ticket.document);
        setLocality(locality);
        setSeatRow(ticket.seatRow);
        setSeatNumber(ticket.seatNumber);
        setName(ticket.name);
        setLastname(ticket.lastname);
        setEmail(ticket.email);
        setDocument(ticket.document);
        setRole(ticket.role);
        setPay(false);
    }

    const deleteTicket = (ticket) => {
        const ticketsFiltered = tickets.filter(t => t.document != ticket.document);
        setTickets(ticketsFiltered);
    }

    return (
        <>
            <Navbar />
            <div className='grid lg:grid-cols-1 bg-gray-100 w-full' style={{ height: '100%' }}>
                {
                    pay ? (
                        <div div className='mx-20 py-6'>
                            <div className='bg-blue text-white py-4 text-center rounded text-2xl'>
                                Boletos: {tickets.length}
                            </div>
                            <div>

                                {
                                    tickets.length < 1 ?
                                        (
                                            <div className='py-2 px-6 border border-black-600 my-2 rounded bg-gray-100'>
                                                Aun no se han creado boletos
                                            </div>
                                        ) :
                                        (tickets.map((ticket, index) => {
                                            return (
                                                <div
                                                    className='py-2 px-6 border border-black-600 my-2 rounded bg-gray-50'
                                                    key={index}
                                                >
                                                    <p><span className='font-bold'>Nombre:</span> {ticket.lastname + ', ' + ticket.name}</p>
                                                    <p><span className='font-bold'>Email:</span> {ticket.email}</p>
                                                    <p><span className='font-bold'>Documento:</span> {ticket.document}</p>
                                                    <p><span className='font-bold'>Role:</span> {ticket.role}</p>
                                                    <p><span className='font-bold'>Zona:</span> {ticket.type}</p>
                                                    <p><span className='font-bold'>Asiento:</span> {ticket.seatRow + ticket.seatNumber}</p>
                                                    <div>
                                                        <button
                                                            onClick={() => editSeat(ticket)}
                                                            className='p-1 mr-4 my-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg'
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} className='pr-2' />
                                                            Editar Asiento
                                                        </button>
                                                        <button
                                                            onClick={() => editInformation(ticket)}
                                                            className='p-1 mr-4 my-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg'
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} className='pr-2' />
                                                            Editar Información
                                                        </button>
                                                        <button
                                                            onClick={() => deleteTicket(ticket)}
                                                            className='p-1 mr-4 my-1 text-red-500 hover:bg-red-500 hover:text-white rounded-lg'
                                                        >
                                                            <FontAwesomeIcon icon={faRemove} className='pr-2' />
                                                            Eliminar Boleto
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }))
                                }
                            </div>
                            <div className='bg-blue text-white py-4 text-center rounded text-2xl'>
                                <div className='line-through'>
                                    Total: $ {numberWithDots(amountTotal)}
                                </div>
                                <div>
                                    {"Descuento (-10%): $ " + numberWithDots(amountTotal * -0.10)}
                                </div>
                                <div>
                                    {"Total a Pagar: $ " + numberWithDots(amountTotal * 0.90)}
                                </div>
                            </div>


                            <div className='w-full text-center'>
                                <button
                                    onClick={() => setPay(false)}
                                    className="bg-blue mt-2 mr-6 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white hover:bg-white hover:text-blue-500 hover:border-blue"
                                >
                                    <FontAwesomeIcon icon={faCirclePlus} className='mr-2' />
                                    Comprar mas entradas
                                </button>
                                {tickets.length > 0 && (
                                    <button
                                        className="bg-blue mt-2 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white hover:bg-white hover:text-blue-500 hover:border-blue"
                                        onClick={buy}
                                    >
                                        <FontAwesomeIcon icon={faMoneyBill1Wave} className='mr-2' />
                                        Pagar Entradas
                                    </button>
                                )}


                            </div>

                        </div >

                    ) :

                        !locality ?
                            (
                                <div className='lg:mx-60 mx-4 py-6'>
                                    <div className='w-full text-center text-3xl text-blue-500 py-6 font-bold'>Seleccione la localidad</div>
                                    <div className='w-full grid grid-cols-5' >
                                        <div
                                            onClick={() => handleLocality('General')}
                                            className=' p-12 my-2 col-start-2 rounded col-span-3 text-black-500 '
                                            style={{ backgroundColor: '#5F91EB' }}
                                        >
                                            <div className="text-center text-3xl font-bold">General</div>
                                            <div className="text-lg">$ 150.000</div>
                                        </div>
                                        <div></div>
                                        <div
                                            onClick={() => handleLocality('Platea Izquierda')}
                                            className=' px-1 py-6 m-2 rounded-lg text-black-500 '
                                            style={{ backgroundColor: '#FFC300' }}
                                        >
                                            <div className="text-center font-bold text-sm -rotate-90 whitespace-nowrap mt-20">Platea Izquierda</div>
                                            <div className="text-center text-xs whitespace-nowrap -rotate-90 ml-8 ">$ 250.000</div>
                                        </div>
                                        <div className='col-span-3 grid grid-cols-1'>
                                            <div
                                                onClick={() => handleLocality('Oro')}
                                                className='p-6 m-2 rounded-lg text-black-500 '
                                                style={{ backgroundColor: '#04FF00' }}
                                            >
                                                <div className="text-center text-3xl font-bold">Oro</div>
                                                <div className="text-2xl">$ 320.000</div>
                                            </div>
                                            <div
                                                onClick={() => handleLocality('Diamante')}
                                                className=' p-6 m-2 rounded-lg text-black-500'
                                                style={{ backgroundColor: '#F600FF' }}
                                            >
                                                <div className="text-center text-3xl font-bold">Diamante</div>
                                                <div className="text-2xl">$ 380.000</div>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => handleLocality('Platea Derecha')}
                                            className=' py-6 m-2 rounded-lg text-black-500 '
                                            style={{ backgroundColor: '#FFC300' }}
                                        >
                                            <div className="text-center font-bold text-sm -rotate-90 whitespace-nowrap mt-20">Platea Derecha</div>
                                            <div className="text-center text-xs whitespace-nowrap -rotate-90 ml-8 ">$ 250.000</div>
                                        </div>
                                        <div className='col-span-3 col-start-2 bg-black p-6 rounded-xl text-white'>Escenario</div>
                                    </div>
                                </div>
                            )
                            :
                            !(seatRow && seatNumber) ?
                                (
                                    <div className='lg:mx-20 py-6 w-full overflow-hidden'>
                                        <span
                                            onClick={() => setLocality(null)}
                                            className='inline-block mx-6 text-red-500 hover:text-white p-2 mb-4 uppercase hover:bg-red-500 cursor-pointer rounded-lg'
                                        >
                                            <FontAwesomeIcon icon={faCircleArrowLeft} className='mr-2' />
                                            Volver
                                        </span>
                                        <div className='w-full text-center text-2xl text-blue-500 py-6 font-bold'>Seleccione su Asiento</div>
                                        <div className={`text-xs text-center pt-32 pb-20 mx-4 overflow-scroll overflow-hidden w-full lg:w-full `} style={{ touchAction: 'manipulation' }}>
                                            {
                                                locality.seats.map((row, index) => {
                                                    const classCustom = `inline-block rounded-full uppercase bg-blue-500 min-w-2 max-w-2 cursor-pointer w-4 h-4 mr-2`;
                                                    const classCustomUsed = `inline-block rounded-full uppercase bg-red-500 min-w-2 max-w-2 w-4 h-4 mr-2`;
                                                    const seatElements = []
                                                    if (locality.inverse) {
                                                        for (let i = row.quantity; i >= locality.start; i -= locality.interval) {
                                                            const used = seatsUseds.find(seat => seat.type == locality.name && seat.row == row.letter && seat.number == i)
                                                            if (used) {

                                                                seatElements.push(
                                                                    <div
                                                                        className={classCustomUsed}
                                                                        key={i}>
                                                                    </div>
                                                                )
                                                            } else {
                                                                seatElements.push(
                                                                    <div
                                                                        onClick={() => handleSeat(row.letter, i)}
                                                                        className={classCustom}
                                                                        key={i}>
                                                                    </div>
                                                                )

                                                            }
                                                        }
                                                    } else {
                                                        for (let i = locality.start; i <= row.quantity; i += locality.interval) {
                                                            const used = seatsUseds.find(seat => seat.type == locality.name && seat.row == row.letter && seat.number == i)
                                                            if (used) {
                                                                seatElements.push(
                                                                    <div
                                                                        className={classCustomUsed}
                                                                        key={i}>
                                                                    </div>
                                                                )
                                                            } else {
                                                                seatElements.push(
                                                                    <div
                                                                        onClick={() => handleSeat(row.letter, i)}
                                                                        className={classCustom}
                                                                        key={i}>
                                                                    </div>
                                                                )
                                                            }

                                                        }
                                                    }

                                                    return (
                                                        <div key={index} className={`my-2`} style={{ whiteSpace: 'nowrap' }} >
                                                            <div key={index} className={`justify-center  ${locality.style}`}>
                                                                {seatElements}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                                : (
                                    <div className='lg:mx-20 mx-6 py-6 lg:mx-20'>
                                        <Script type="text/javascript" src="https://checkout.wompi.co/widget.js" />
                                        <span
                                            onClick={() => setSeatNumber(null)}
                                            className='inline-block text-red-500 hover:text-white p-2 mb-4 uppercase hover:bg-red-500 cursor-pointer rounded-lg'
                                        >
                                            <FontAwesomeIcon icon={faCircleArrowLeft} className='mr-2' />
                                            Volver
                                        </span>
                                        <form className='grid grid-cols-1' onSubmit={handleSubmit}>
                                            <div className='grid grid-cols-1 mb-4'>
                                                <label className='text-black'>Nombres</label>
                                                <InputText value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
                                                {errors.name && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                                )}
                                            </div>

                                            <div className='grid grid-cols-1 mb-4'>
                                                <label className='text-black'>Apellidos</label>
                                                <InputText value={lastname} error={errors.lastname} onChange={(e) => setLastname(e.target.value)} />
                                                {errors.lastname && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                                                )}
                                            </div>

                                            <div className='grid grid-cols-1 mb-4'>
                                                <label className='text-black'>Correo</label>
                                                <InputText value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} />
                                                {errors.email && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                                )}
                                            </div>

                                            <div className='grid grid-cols-1 mb-4'>
                                                <label className='text-black'>Documento:</label>
                                                <InputText value={document} error={errors.document} onChange={(e) => setDocument(e.target.value)} />
                                                {errors.document && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.document}</p>
                                                )}
                                            </div>

                                            <div className='grid grid-cols-1 mb-4'>
                                                <label className='text-black'>Rol:</label>
                                                <select
                                                    className={`bg-gray-200 rounded-lg px-4 py-2 text-black ${errors.role ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                >
                                                    {
                                                        roles.map((role, index) => <option key={index}>{role}</option>)
                                                    }
                                                </select>
                                                {errors.role && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                                                )}
                                            </div>

                                            <div className='text-center'>
                                                <button
                                                    type='submit'
                                                    className="bg-blue mt-2 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white"
                                                >
                                                    Agregar Boleto
                                                </button>
                                            </div>

                                        </form>

                                    </div>
                                )


                }

                <div className="lg:hidden">
                    <div className="sticky bottom-0 left-0 right-0 bg-gray-800 text-white p-4 text-center">
                        <div className='inline-block'>
                            <p>Boletos: {tickets.length}</p>
                        </div>
                        {
                            tickets.length > 0 && (
                                <div className='ml-6 inline-block'>
                                    <button onClick={buy} className='py-2 px-4 rounded m-1 bg-blue-500'>Pagar</button>
                                </div>
                            )
                        }
                    </div>
                </div>


            </div >
        </>
    );
}