'use client';

import { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReserveTickets from '@/components/tickets/reserve';
import TicketsTable from '@/components/tickets/table';
import Navbar from '@/components/NavbarAdmin'; // Importamos nuestro nuevo componente de navbar
import Sidebar from '@/components/SIdebarAdmin'; // Importamos nuestro nuevo componente de sidebar
import logo from '../../../../public/images/2025/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableList,
  faTicketAlt,
  faChartBar,
  faUser,
  faCalendarAlt,
  faComments,
  faEnvelope,
  faPercentage,
  faRefresh,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '@/context/AuthContext';
import { useMetrics } from '@/hooks/useMetrics';
import Lecturers from '@/components/admin/Lecturers';
import TestimonialsAdmin from '@/app/admin/testimonials/page';
import BroadcastsAdmin from '@/components/admin/broadcasts/BroadcastsAdmin';
import DiscountCodesAdmin from '@/components/admin/discountCodes/DiscountCodesAdmin';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('table');

  // Handle navigation for special routes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const auth = useContext(AuthContext);
  const router = useRouter();
  const { metrics, loading: metricsLoading, error: metricsError, refetch } = useMetrics();

  // Calculate days remaining until event (August 1-2, 2025)
  const calculateDaysLeft = () => {
    const eventDate = new Date('2025-08-01');
    const today = new Date();
    const timeDiff = eventDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(0, daysLeft);
  };

  // Esperar a que el contexto de autenticación se inicialice
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthLoading(false);
    }, 1000); // Dar tiempo para que se cargue la autenticación

    return () => clearTimeout(timer);
  }, []);

  // Verificar autenticación después de que se cargue
  useEffect(() => {
    if (!isAuthLoading && !auth?.user) {
      router.push('/admin/auth');
    }
  }, [isAuthLoading, auth?.user, router]);

  // Elementos del menú principal
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: faChartBar },
    { id: 'table', label: 'Tabla de Tickets', icon: faTableList },
    { id: 'lecturers', label: 'Conferencistas', icon: faUser },
    { id: 'testimonials', label: 'Testimonios', icon: faComments },
    { id: 'broadcasts', label: 'Email Broadcasts', icon: faEnvelope },
    { id: 'discount-codes', label: 'Códigos de Descuento', icon: faPercentage },
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
      case 'lecturers': return 'Gestión de Conferencistas';
      case 'testimonials': return 'Gestión de Testimonios';
      case 'broadcasts': return 'Email Broadcasts';
      case 'discount-codes': return 'Códigos de Descuento';
      case 'reserve': return 'Reservar Tickets';
      default: return 'Panel de Administración';
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isAuthLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado después del loading, no renderizar nada (se redirigirá)
  if (!auth?.user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
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
              {/* Refresh Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Dashboard de Métricas</h2>
                <button
                  onClick={refetch}
                  disabled={metricsLoading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faRefresh} className={`h-4 w-4 mr-2 ${metricsLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
              </div>

              {/* Error State */}
              {metricsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">Error: {metricsError}</p>
                </div>
              )}

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tickets Pagados</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {metricsLoading ? '...' : (metrics?.seatsOverview.totalPaid || 0)}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3 mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faUser} className="text-yellow-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tickets Reservados</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {metricsLoading ? '...' : (metrics?.seatsOverview.totalReserved || 0)}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4 flex-shrink-0">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Días Restantes</p>
                    <p className="text-2xl font-bold text-gray-800">{calculateDaysLeft()}</p>
                  </div>
                </div>
              </div>

              {/* Distribución de Tickets por Tipo - Prioritaria */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Distribución de Tickets por Tipo</h3>
                  {metricsLoading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {metrics?.ticketsByType.map((ticket, index) => (
                        <div key={ticket.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${
                              index === 0 ? 'bg-blue-500' :
                              index === 1 ? 'bg-green-500' :
                              index === 2 ? 'bg-yellow-500' :
                              index === 3 ? 'bg-purple-500' :
                              index === 4 ? 'bg-red-500' :
                              index === 5 ? 'bg-indigo-500' :
                              'bg-gray-500'
                            }`}></div>
                            <span className="font-medium text-gray-700 capitalize">{ticket.type}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-800">{ticket.total}</div>
                            <div className="text-sm text-gray-500">
                              {ticket.paid} pagados, {ticket.reserved} reservados
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Resumen de Estado</h3>
                  {metricsLoading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tickets Pagados:</span>
                          <span className="font-bold text-green-600">
                            {metrics?.seatsOverview.totalPaid || 0}
                          </span>
                        </div>
                      </div>
                      <div className="border-b pb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tickets Reservados:</span>
                          <span className="font-bold text-yellow-600">
                            {metrics?.seatsOverview.totalReserved || 0}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mt-4">
                        <div className="text-sm text-gray-600 mb-1">Última actualización:</div>
                        <div className="text-sm font-medium">
                          {metrics?.lastUpdated ? new Date(metrics.lastUpdated).toLocaleString('es-ES') : 'N/A'}
                        </div>
                      </div>
                    </div>
                  )}
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
          
          {/* Conferencistas */}
          {activeTab === 'lecturers' && (
            <div>
              <Lecturers />
            </div>
          )}
          
          {/* Testimonios */}
          {activeTab === 'testimonials' && (
            <div>
              <TestimonialsAdmin />
            </div>
          )}
          
          {/* Email Broadcasts */}
          {activeTab === 'broadcasts' && (
            <div>
              <BroadcastsAdmin />
            </div>
          )}
          
          {/* Códigos de Descuento */}
          {activeTab === 'discount-codes' && (
            <div>
              <DiscountCodesAdmin />
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