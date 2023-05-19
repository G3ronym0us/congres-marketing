"use client"

import Header from '@/components/Header';
import InputText from '@/components/form/InputText';
import { randomBytes } from 'crypto';
import Script from 'next/script';
import { Input } from 'postcss';
import { useEffect, useState } from 'react';

export default function BuyTickets() {


    const [locality, setLocality] = useState(null);
    const [seat, setSeat] = useState(null);
    const [name, setName] = useState('');
    const [document, setDocument] = useState('');
    const [role, setRole] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [selectedOption, setSelectedOption] = useState('diamond');
    const [amountTotal, setAmountTotal] = useState(0);
    const [seatRow, setSeatRow] = useState(null);
    const [seatNumber, setSeatNumber] = useState(null);

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
                { letter: 'A', quantity: 141 }
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
                { letter: 'G', quantity: 133 },
                { letter: 'F', quantity: 134 },
                { letter: 'E', quantity: 133 }
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
            size: 4,
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
        const apiUrl = 'http://localhost:3000/api/ticket/save';

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
            amountInCents: amountTotal * 100,
            reference: reference,
            publicKey: 'pub_test_rbHh9GcFhH28AUuNSWt9ztnKHZqUmu4r',
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
        })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const type = ticketsType.find((type) => type.value === selectedOption)
        const ticket = {
            name,
            document,
            role,
            type: locality.name,
            seatNumber,
            seatRow,
            amount: locality.amount,
        }
        setTickets([...tickets, ticket])
        clearForm();
    };

    const clearForm = () => {
        setName('');
        setDocument('');
        setRole(null);
        setSeatNumber(null),
            setSeatRow(null);
        setLocality(null);
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

    const handleLocality = (localityName) => {
        const localitySelected = localities.find((loc) => loc.name === localityName)
        setLocality(localitySelected)
    }

    const handleSeat = (row, number) => {
        setSeatRow(row);
        setSeatNumber(number);
    }

    return (
        <>
            <Header></Header>
            <div className='grid grid-cols-2'>
                {
                    !locality ?
                        (
                            <div className='mx-20 py-6'>
                                <div>Seleccione la localidad</div>
                                <div className='w-full grid grid-cols-5' >
                                    <div
                                        onClick={() => handleLocality('General')}
                                        className='bg-blue-500 p-12 my-2 col-start-2 rounded col-span-3 text-blue-500 hover:bg-blue-200 hover:text-black'
                                    >
                                        <div className="text-center text-3xl font-bold">General</div>
                                        <div className="text-2xl">$ 150.000</div>
                                    </div>
                                    <div></div>
                                    <div
                                        onClick={() => handleLocality('Platea Izquierda')}
                                        className='bg-blue-500 px-1 py-6 m-2 rounded-lg text-blue-500 hover:bg-blue-200 hover:text-black'
                                    >
                                        <div className="text-center font-bold">Platea Izquierda</div>
                                        <div className="text-center">$ 250.000</div>
                                    </div>
                                    <div className='col-span-3 grid grid-cols-1'>
                                        <div
                                            onClick={() => handleLocality('Oro')}
                                            className='bg-blue-500 p-6 m-2 rounded-lg text-blue-500 hover:bg-blue-200 hover:text-black'
                                        >
                                            <div className="text-center text-3xl font-bold">Oro</div>
                                            <div className="text-2xl">$ 320.000</div>
                                        </div>
                                        <div
                                            onClick={() => handleLocality('Diamante')}
                                            className='bg-blue-500 p-6 m-2 rounded-lg text-blue-500 hover:bg-blue-200 hover:text-black'
                                        >
                                            <div className="text-center text-3xl font-bold">Diamante</div>
                                            <div className="text-2xl">$ 390.000</div>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => handleLocality('Platea Derecha')}
                                        className='bg-blue-500 py-6 m-2 rounded-lg text-blue-500 hover:bg-blue-200 hover:text-black'
                                    >
                                        <div className="text-center font-bold">Platea Derecha</div>
                                        <div className="text-center">$ 250.000</div>
                                    </div>
                                    <div className='col-span-3 col-start-2 bg-black p-6 rounded-xl text-white'>Escenario</div>
                                </div>
                            </div>
                        )
                        :
                        !(seatRow && seatNumber) ?
                            (
                                <div className='mx-3'>
                                    <span
                                        onClick={() => setLocality(null)}
                                        className='inline-block text-white p-2 mb-4 uppercase bg-red-500 cursor-pointer'
                                    >
                                        volver
                                    </span>
                                    <div className='my-4'>Seleccione su asiento</div>
                                    <div className={`text-xs text-center`}>
                                        {
                                            locality.seats.map((row, index) => {
                                                const seatElements = []
                                                if (locality.inverse) {
                                                    for (let i = row.quantity; i >= locality.start; i -= locality.interval) {
                                                        seatElements.push(
                                                            <span
                                                                onClick={() => handleSeat(row.letter, i)}
                                                                className={`inline-block rounded-full mr-${locality.spacing} uppercase bg-blue-500 w-${locality.size} h-${locality.size} cursor-pointer`}
                                                                key={i}>
                                                            </span>
                                                        )
                                                    }
                                                } else {
                                                    for (let i = locality.start; i <= row.quantity; i += locality.interval) {
                                                        seatElements.push(
                                                            <span
                                                                onClick={() => handleSeat(row.letter, i)}
                                                                className={`inline-block rounded-full mr-${locality.spacing} uppercase bg-blue-500 w-${locality.size} h-${locality.size} cursor-pointer`}
                                                                key={i}>
                                                            </span>
                                                        )
                                                    }
                                                }

                                                return (
                                                    <div key={index} className={`my-2  ${locality.style}`}>
                                                        {seatElements}
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            )
                            : (
                                <div className='mx-20 py-6'>
                                    <Script type="text/javascript" src="https://checkout.wompi.co/widget.js" />
                                    <span
                                        onClick={() => setSeatNumber(null)}
                                        className='inline-block text-white p-2 mb-4 uppercase bg-red-500 cursor-pointer'
                                    >
                                        volver
                                    </span>
                                    <form className='grid grid-cols-1' onSubmit={handleSubmit}>
                                        <div className='grid grid-cols-1 mb-4'>
                                            <label className=''>Nombre</label>
                                            <InputText value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>

                                        <div className='grid grid-cols-1 mb-4'>
                                            <label>Documento:</label>
                                            <InputText value={document} onChange={(e) => setDocument(e.target.value)} />
                                        </div>

                                        <div className='grid grid-cols-1 mb-4'>
                                            <label>Role:</label>
                                            <select
                                                className="bg-gray-200 rounded-lg px-4 py-2 text-black"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                            >
                                                {
                                                    roles.map((role, index) => <option key={index}>{role}</option>)
                                                }
                                            </select>
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

                <div className='mx-20 py-6'>
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
                                            className='py-2 px-6 border border-black-600 my-2 rounded bg-gray-100'
                                            key={index}
                                        >
                                            <p><span className='text-bold'>Nombre:</span> {ticket.name}</p>
                                            <p><span className='text-bold'>Documento:</span> {ticket.document}</p>
                                            <p><span className='text-bold'>Role:</span> {ticket.role}</p>
                                            <p><span className='text-bold'>Zona:</span> {ticket.type}</p>
                                            <p><span className='text-bold'>Asiento:</span> {ticket.seatRow + ticket.seatNumber}</p>
                                        </div>
                                    )
                                }))
                        }
                    </div>
                    <div className='bg-blue text-white py-4 text-center rounded text-2xl'>
                        Total: $ {numberWithDots(amountTotal)}
                    </div>

                    {tickets.length > 0 && (
                        <div className='w-full text-center'>
                            <button
                                className="bg-blue mt-2 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white"
                                onClick={buy}
                            >
                                Comprar
                            </button>
                        </div>
                    )}

                </div>
            </div >

        </>
    );
}