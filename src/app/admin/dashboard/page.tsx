'use client';

import { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReserveTickets from '@/components/tickets/reserve';
import TicketsTable from '@/components/tickets/table';
import Navbar from '@/components/NavbarAdmin'; // Importamos nuestro nuevo componente de navbar
import Sidebar from '@/components/SIdebarAdmin'; // Importamos nuestro nuevo componente de sidebar
import logo from '../../../../public/images/logo-congress.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableList,
  faTicketAlt,
  faChartBar,
  faUser,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '@/context/AuthContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('table');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalTickets: 568,
    attendees: 324,
    daysLeft: 12,
  });
  const auth = useContext(AuthContext);
  const router = useRouter();

  // Elementos del menú principal
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: faChartBar },
    { id: 'table', label: 'Tabla de Tickets', icon: faTableList },
  ];

  // Cierra el sidebar automáticamente cuando la pantalla se hace grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    auth?.logout();
    router.push('/admin/auth');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Título dinámico para la navbar
  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard de Administración';
      case 'table': return 'Gestión de Tickets';
      case 'reserve': return 'Reservar Tickets';
      default: return 'Panel de Administración';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
        user={auth?.user || { username: 'Administrador' }}
        onLogout={handleLogout}
        logo={logo.src}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar Component */}
        <Navbar 
          title={getPageTitle()} 
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faTicketAlt} className="text-blue-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Tickets</p>
                    <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalTickets}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faUser} className="text-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Asistentes</p>
                    <p className="text-2xl font-bold text-gray-800">{dashboardStats.attendees}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Días Restantes</p>
                    <p className="text-2xl font-bold text-gray-800">{dashboardStats.daysLeft}</p>
                  </div>
                </div>
              </div>

              {/* Gráficos o información adicional */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 h-64 flex flex-col">
                  <h3 className="font-semibold text-gray-800 mb-4">Ventas por Día</h3>
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-500">Aquí iría un gráfico de ventas por día</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 h-64 flex flex-col">
                  <h3 className="font-semibold text-gray-800 mb-4">Distribución de Tickets</h3>
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-500">Distribución por tipo de ticket</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Tabla de Tickets */}
          {activeTab === 'table' && (
            <div>
              <TicketsTable />
            </div>
          )}
          
          {/* Reservar Tickets */}
          {activeTab === 'reserve' && (
            <div>
              <ReserveTickets />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-center text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Panel de Administración - Todos los derechos reservados
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}