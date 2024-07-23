import { numberWithDots } from '@/app/tickets/buy/page';
import { Ticket } from '@/types/tickets';
import {
  faCirclePlus,
  faEdit,
  faMoneyBill1Wave,
  faRemove,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface Props {
  tickets: Ticket[];
  editSeat: Function;
  editInformation: Function;
  deleteTicket: Function;
  setPay: Function;
  amountTotal: number;
  buy: Function;
}

const TicketList: React.FC<Props> = ({
  tickets,
  editSeat,
  editInformation,
  deleteTicket,
  setPay,
  amountTotal,
  buy,
}) => {
  return (
    <div className="pb-6">
      <div className="bg-blue text-white py-4 text-center rounded text-2xl">
        Boletos: {tickets.length}
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
                  <span className="font-bold">Nombre:</span>{' '}
                  {ticket.lastname + ', ' + ticket.name}
                </p>
                <p>
                  <span className="font-bold">Email:</span> {ticket.email}
                </p>
                <p>
                  <span className="font-bold">Documento:</span>{' '}
                  {ticket.document}
                </p>
                <p>
                  <span className="font-bold">Role:</span> {ticket.role}
                </p>
                <p>
                  <span className="font-bold">Zona:</span> {ticket.type}
                </p>
                <p>
                  <span className="font-bold">Asiento:</span>{' '}
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
                    onClick={() => editInformation(ticket)}
                    className="p-1 mr-4 my-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg"
                  >
                    <FontAwesomeIcon icon={faEdit} className="pr-2" />
                    Editar Información
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
      <div className="bg-blue text-white py-4 text-center rounded text-2xl">
        <div className="line-through">
          Total: $ {numberWithDots(amountTotal)}
        </div>
        <div>{'Total a Pagar: $ ' + numberWithDots(amountTotal)}</div>
      </div>

      <div className="w-full text-center">
        <button
          onClick={() => setPay(false)}
          className="bg-blue mt-2 mr-6 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white hover:bg-white hover:text-blue-500 hover:border-blue"
        >
          <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
          Comprar mas entradas
        </button>
        {tickets.length > 0 && (
          <button
            className="bg-blue mt-2 inline-flex items-center px-8 py-2 rounded text-lg font-semibold tracking-tighter text-white hover:bg-white hover:text-blue-500 hover:border-blue"
            onClick={() => buy()}
          >
            <FontAwesomeIcon icon={faMoneyBill1Wave} className="mr-2" />
            Pagar Entradas
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketList;
