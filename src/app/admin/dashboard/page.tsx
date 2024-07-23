'use client';

import { useContext, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReserveTickets from '@/components/tickets/reserve';
import TicketsTable from '@/components/tickets/table';
import logo from '../../../../public/images/logo-congress.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '@/conext/AuthContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('table');
  const auth = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    auth?.logout();
    console.log('Logout clicked');
    router.push('/admin/auth');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra lateral */}
      <div className="w-64 bg-white shadow-md">
        <div className="w-full flex items-center justify-center p-4">
          <Image src={logo} alt="Logo" width={150} height={50} />
        </div>
        <nav className="mt-8">
          <button
            onClick={() => setActiveTab('table')}
            className={`w-full text-left block py-3 px-4 text-sm ${activeTab === 'table' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            <FontAwesomeIcon icon={faTableList} className="mr-2" />
            Tabla de Tickets
          </button>
          <button
            onClick={() => setActiveTab('reserve')}
            className={`w-full text-left block py-3 px-4 text-sm ${activeTab === 'reserve' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            <FontAwesomeIcon icon={faTicketAlt} className="mr-2" />
            Reservar Tickets
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition duration-300"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-10 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        {activeTab === 'table' && <TicketsTable />}
        {activeTab === 'reserve' && <ReserveTickets />}
      </div>
    </div>
  );
}
