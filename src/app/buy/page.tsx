'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTicketAlt, faCreditCard, faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { LocalidadDetalle, FormDataType, TicketType } from '@/types/tickets';

export default function DetallesCompra() {
  const router = useRouter();
  const [localidad, setLocalidad] = useState<TicketType>(TicketType.DIAMOND); // Valor por defecto
  const [detallesEntrada, setDetallesEntrada] = useState<LocalidadDetalle>();
  const [formData, setFormData] = useState<FormDataType>({
    name: '',   
    lastname: '',
    document: '',
    email: '',
    phone: '',
    quantity: 1,
    withMemories: false
  });

  // Configuración de todas las localidades con sus detalles
  const localidades: Record<string, LocalidadDetalle> = {
    diamante: {
      name: 'Localidad Diamante',
      price: 700000,
      color: 'bg-gradient-to-br from-[#1C2C67]/70 to-[#4B0012]/70',
      border: 'border-blue-300',
      icon: '💎',
      features: [
        'Ingreso a todas las conferencias del evento en localidad Diamante',
        'Derecho a 4 coffee break en el evento',
        'Ingreso al cóctel oficial del evento',
        'Acceso a las memorias del evento',
        'Certificación de participación digital'
      ],
      withMemories: true,
      pushable: true    
    },
    vip: {
      name: 'Localidad V.I.P.',
      price: 600000,
      color: 'bg-gradient-to-br from-[#1C2C67]/50 to-[#4B0012]/50',
      border: 'border-purple-500',
      icon: '🟣',
      features: [
        'Ingreso a todas las conferencias del evento en localidad V.I.P.',
        'Derecho a 4 coffee break en el evento',
        'Ingreso al cóctel oficial del evento',
        'Certificación de participación digital'
      ],
      withMemories: false,
      pushable: true
    },
    general: {
      name: 'Localidad General',
      price: 400000,
      color: 'bg-white/10',
      border: 'border-white/20',
      icon: '🔵',
      features: [
        'Ingreso a todas las conferencias del evento en localidad General',
        'Derecho a 4 coffee break en el evento',
        'Certificación de participación digital'
      ],
      withMemories: false,
      pushable: true
    },
    streaming: {
      name: 'Streaming del Evento',
      price: 300000,
      color: 'bg-white/10',
      border: 'border-white/20',
      icon: '🌐',
      features: [
        'Ingreso virtual a todas las jornadas del CNMP 2024',
        'Acceso por grupo cerrado de Facebook',
        'Certificación de participación digital'
      ],
      withMemories: false,
      noPermiteMemorias: true,
      pushable: true
    }
  };

  // Calcular el total a pagar
  const [total, setTotal] = useState(0);

  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Obtener la localidad de la URL usando searchParams
    const localidadParam = searchParams ? searchParams.get('localidad') : null;
    if (localidadParam) {
      setLocalidad(localidadParam as TicketType);
    }
  }, [searchParams]);

  useEffect(() => {
    // Actualizar detalles de la entrada seleccionada
    if (localidades[localidad]) {
      setDetallesEntrada(localidades[localidad]);
    }
  }, [localidad]);

  useEffect(() => {
    // Calcular el total a pagar
    let price = detallesEntrada?.price || 0;
    let priceMemories = formData.withMemories && !detallesEntrada?.withMemories ? 250000 : 0;
    
    setTotal((price + priceMemories) * formData.quantity);
  }, [detallesEntrada, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí iría la lógica para procesar el pago
    alert('¡Gracias por tu compra! Serás redirigido al sistema de pagos.');
  };

  const handleVolver = () => {
    router.push('/#entradas');
  };

  const formatoPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f1424] to-[#1a0a12] py-12 px-4">
      <div className="container mx-auto">
        <button
          onClick={handleVolver}
          className="flex items-center text-blue-300 hover:text-blue-400 transition mb-8"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Volver a entradas
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Detalles de la entrada */}
          {detallesEntrada && (
            <div className="bg-black/20 backdrop-filter backdrop-blur-sm p-8 rounded-xl">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <FontAwesomeIcon icon={faTicketAlt} className="mr-3 text-blue-300" />
              Detalles de tu entrada
            </h2>

            <div className={`${detallesEntrada.color} border-2 ${detallesEntrada.border} p-6 rounded-xl mb-8`}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <span className="text-xl">{detallesEntrada.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{detallesEntrada.name}</h3>
              </div>

              <p className="text-xl font-bold text-white mb-4">
                {detallesEntrada.price ? formatoPrecio(detallesEntrada.price) : ''}
              </p>

              <h4 className="text-white font-semibold mb-2">Incluye:</h4>
              <ul className="text-gray-300 list-disc pl-5 space-y-1 mb-4">
                {detallesEntrada.features?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {!detallesEntrada.withMemories && !detallesEntrada.noPermiteMemorias && (
              <div className="bg-white/10 p-6 rounded-xl mb-8">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="withMemories"
                    name="withMemories"
                    checked={formData.withMemories}
                    onChange={handleInputChange}
                    className="mr-3 h-5 w-5"
                  />
                  <div>
                    <label htmlFor="withMemories" className="text-white font-semibold cursor-pointer">
                      Añadir Memorias del Evento
                    </label>
                    <p className="text-gray-400 text-sm">
                      Grabación del evento con todas las intervenciones de los conferencistas
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-white font-semibold">$250.000</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">Resumen de compra</h4>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Entrada:</span>
                <span className="text-white">{detallesEntrada.price ? formatoPrecio(detallesEntrada.price) : ''}</span>
              </div>
              
              {formData.withMemories && !detallesEntrada.withMemories && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Memorias:</span>
                  <span className="text-white">{formatoPrecio(250000)}</span>
                </div>
              )}
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Cantidad:</span>
                <span className="text-white">{formData.quantity}</span>
              </div>
              
              <div className="border-t border-white/20 my-4"></div>
              
              <div className="flex justify-between text-xl font-bold">
                <span className="text-white">Total:</span>
                <span className="text-blue-300">{formatoPrecio(total)}</span>
              </div>
            </div>
          </div>
          )}

          {/* Formulario de pago */}
          <div className="bg-black/20 backdrop-filter backdrop-blur-sm p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <FontAwesomeIcon icon={faCreditCard} className="mr-3 text-blue-300" />
              Información de pago
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-white mb-2">Nombre completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-white mb-2">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-white mb-2">Teléfono</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-white mb-2">Cantidad de entradas</label>
                <select
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white/5 p-6 rounded-xl">
                <h4 className="text-white font-semibold mb-4">Métodos de pago</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 p-4 rounded-lg text-center cursor-pointer border-2 border-blue-500">
                    <span className="text-white">Tarjeta de Crédito</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center cursor-pointer">
                    <span className="text-white">PSE</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4">
                  Al hacer clic en "Proceder al pago", serás redirigido a nuestro sistema seguro de pagos.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity text-lg"
              >
                Proceder al Pago - {formatoPrecio(total)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}