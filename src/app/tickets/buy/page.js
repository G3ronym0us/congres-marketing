"use client"

import InputText from '@/components/form/InputText';
import Script from 'next/script';
import { Input } from 'postcss';
import { useEffect, useState } from 'react';

export default function BuyTickets() {

    const [checkout, setCheckout] = useState(null);
    const [name, setName] = useState('');
    const [document, setDocument] = useState('');
    const [role, setRole] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [selectedOption, setSelectedOption] = useState('diamond');
    const [amountTotal, setAmountTotal] = useState(0);


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
        await setCheckout(new WidgetCheckout({
            currency: 'COP',
            amountInCents: amountTotal * 100,
            reference: 'AD002901221',
            publicKey: 'pub_test_rbHh9GcFhH28AUuNSWt9ztnKHZqUmu4r',
            redirectUrl: 'https://transaction-redirect.wompi.co/check', // Opcional
            taxInCents: { // Opcional
                vat: 1900,
                consumption: 800
            },
        }))

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
            type: type.name,
            amount: type.amount
        }
        setTickets([...tickets, ticket])
        clearForm();
    };

    const clearForm = () => {
        setName('');
        setDocument('');
        setRole(null);
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

    return (
        <>
            <div className='grid grid-cols-2'>
                <div className='mx-20 py-6'>
                    <Script type="text/javascript" src="https://checkout.wompi.co/widget.js" />

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

                        <div className='grid grid-cols-2 mb-4 gap-4'>
                            {
                                ticketsType.map((type, index) => {
                                    return (
                                        <div
                                            className={`flex grid grid-cols-1 p-2 text-center items-center justify-center rounded-lg ${radioStyles(type.value)}`}
                                            onClick={() => handleOptionChange(type.value)}
                                            key={index}
                                        >
                                            <div className="text-lg font-medium">{type.name}</div>
                                            <div className="text-2xl">$ {numberWithDots(type.amount)}</div>
                                        </div>
                                    );
                                })
                            }

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
                <div className='mx-20 py-6'>
                    <div>Boletos: {tickets.length}</div>
                    <div>
                        {tickets.map((ticket, index) => {
                            return (
                                <div key={index}>
                                    <p>Nombre: {ticket.name}</p>
                                    <p>Documento: {ticket.document}</p>
                                    <p>Role: {ticket.role}</p>
                                    <p>Tipo: {ticket.type}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div>Total: $ {numberWithDots(amountTotal)}</div>
                    <div>
                        <button
                            className="bg-blue mt-2 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white"
                            onClick={buy}
                        >
                            Comprar
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
}