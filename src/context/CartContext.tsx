'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import {
  CartState,
  CartItem,
  AttendeeData,
  CartTicket as Ticket,
  TicketType,
} from '@/types/tickets';
import { AppliedDiscount } from '@/types/discountCode';
import { discountUtils } from '@/services/discountCode';
import { v4 as uuidv4 } from 'uuid'; // Necesitarás instalar esta dependencia: npm install uuid @types/uuid

// Definir tipos de acciones
type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: {
        localidad: TicketType;
        cantidad: number;
        withMemories: boolean;
        precio: number;
        precioMemorias: number;
      };
    }
  | { type: 'REMOVE_ITEM'; payload: { localidad: TicketType } }
  | { type: 'REMOVE_TICKET'; payload: { ticketId: string } }
  | {
      type: 'TOGGLE_MEMORIAS';
      payload: { ticketId: string; withMemories: boolean };
    }
  | {
      type: 'UPDATE_ATTENDEE';
      payload: { ticketId: string; attendee: AttendeeData };
    }
  | { type: 'APPLY_DISCOUNT'; payload: { discount: AppliedDiscount } }
  | { type: 'REMOVE_DISCOUNT' }
  | { type: 'SET_EDITION'; payload: { editionId: number; editionSlug: string } }
  | { type: 'RESTORE_CART'; payload: CartState }
  | { type: 'CLEAR_CART' };

// Estado inicial del carrito
const initialState: CartState = {
  items: [],
  total: 0,
  appliedDiscount: null,
  editionId: null,
  editionSlug: null,
};

// Clave para almacenar el carrito en localStorage
const CART_STORAGE_KEY = 'event-cart-data';

// Crear un ticket vacío
const createEmptyTicket = (
  type: TicketType,
  withMemories: boolean,
  price: number,
  priceMemories: number,
): Ticket => ({
  id: uuidv4(), // Generar un ID único
  type,
  withMemories,
  price,
  priceMemories,
  attendee: {
    name: '',
    lastname: '',
    document: '',
    email: '',
    phone: '',
  },
});

// Función para calcular el total del carrito
const calcularTotal = (items: CartItem[], appliedDiscount?: { code: string; percentage: number } | null): number => {
  const subtotal = items.reduce((total, item) => {
    return (
      total +
      item.tickets.reduce((subtotal, ticket) => {
        const price = ticket.price;
        const priceMemories =
          ticket.withMemories && ticket.type !== TicketType.DIAMOND
            ? ticket.priceMemories
            : 0;
        return subtotal + price + priceMemories;
      }, 0)
    );
  }, 0);

  if (appliedDiscount) {
    const discountAmount = discountUtils.getDiscountAmount(subtotal, appliedDiscount.percentage);
    return subtotal - discountAmount;
  }

  return subtotal;
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { localidad, cantidad, withMemories, precio, precioMemorias } =
        action.payload;
      // Verificar si ya existe un item para esta localidad
      const existingItemIndex = state.items.findIndex(
        (item) => item.localidad === localidad,
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // El item existe, simplemente agregamos nuevos tickets
        const newTickets: Ticket[] = [];

        for (let i = 0; i < cantidad; i++) {
          newTickets.push(
            createEmptyTicket(localidad, withMemories, precio, precioMemorias),
          );
        }

        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          tickets: [...newItems[existingItemIndex].tickets, ...newTickets],
        };
      } else {
        // Crear un nuevo item con los tickets
        const newTickets: Ticket[] = [];

        for (let i = 0; i < cantidad; i++) {
          newTickets.push(
            createEmptyTicket(localidad, withMemories, precio, precioMemorias),
          );
        }

        const newItem: CartItem = {
          localidad,
          tickets: newTickets,
        };

        newItems = [...state.items, newItem];
      }

      const newState = {
        ...state,
        items: newItems,
        total: calcularTotal(newItems, state.appliedDiscount),
      };

      // Guardar en localStorage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));

      return newState;
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        (item) => item.localidad !== action.payload.localidad,
      );

      const newState = {
        ...state,
        items: newItems,
        total: calcularTotal(newItems, state.appliedDiscount),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));

      return newState;
    }

    case 'REMOVE_TICKET': {
      const { ticketId } = action.payload;

      // Para cada item, filtramos sus tickets para eliminar el que corresponda
      const newItems = state.items
        .map((item) => ({
          ...item,
          tickets: item.tickets.filter((ticket) => ticket.id !== ticketId),
        }))
        // Filtramos los items que quedaron sin tickets
        .filter((item) => item.tickets.length > 0);

      const newState = {
        ...state,
        items: newItems,
        total: calcularTotal(newItems, state.appliedDiscount),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));

      return newState;
    }

    case 'TOGGLE_MEMORIAS': {
      const { ticketId, withMemories } = action.payload;

      const newItems = state.items.map((item) => ({
        ...item,
        tickets: item.tickets.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, withMemories: withMemories }
            : ticket,
        ),
      }));

      const newState = {
        ...state,
        items: newItems,
        total: calcularTotal(newItems, state.appliedDiscount),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));

      return newState;
    }

    case 'UPDATE_ATTENDEE': {
      const { ticketId, attendee } = action.payload;

      const newItems = state.items.map((item) => ({
        ...item,
        tickets: item.tickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, attendee } : ticket,
        ),
      }));

      const newState = {
        ...state,
        items: newItems,
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));

      return newState;
    }

    case 'APPLY_DISCOUNT': {
      const newState = {
        ...state,
        appliedDiscount: {
          code: action.payload.discount.code,
          percentage: action.payload.discount.discountPercentage,
        },
        total: calcularTotal(state.items, {
          code: action.payload.discount.code,
          percentage: action.payload.discount.discountPercentage,
        }),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'REMOVE_DISCOUNT': {
      const newState = {
        ...state,
        appliedDiscount: null,
        total: calcularTotal(state.items, null),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'SET_EDITION': {
      const { editionId, editionSlug } = action.payload;
      // Si el carrito pertenece a otra edición, se vacía para no mezclar localidades.
      const sameEdition = state.editionId === editionId;
      const newState: CartState = sameEdition
        ? { ...state, editionId, editionSlug }
        : { ...initialState, editionId, editionSlug };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }

    case 'RESTORE_CART': {
      return action.payload;
    }

    case 'CLEAR_CART': {
      localStorage.removeItem(CART_STORAGE_KEY);
      return initialState;
    }

    default:
      return state;
  }
};

// Crear contexto
interface CartContextType {
  state: CartState;
  addItem: (
    localidad: TicketType,
    cantidad: number,
    withMemories: boolean,
    price: number,
    priceMemories: number,
  ) => void;
  removeItem: (localidad: TicketType) => void;
  removeTicket: (ticketId: string) => void;
  toggleMemorias: (ticketId: string, withMemories: boolean) => void;
  updateAttendee: (ticketId: string, attendee: AttendeeData) => void;
  applyDiscount: (discount: AppliedDiscount) => void;
  removeDiscount: () => void;
  setEdition: (editionId: number, editionSlug: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Proveedor del contexto
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart) as CartState;
        dispatch({ type: 'RESTORE_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error parsing stored cart:', error);
      }
    }
  }, []);

  const addItem = (
    localidad: TicketType,
    cantidad: number,
    withMemories: boolean,
    precio: number,
    precioMemorias: number,
  ) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { localidad, cantidad, withMemories, precio, precioMemorias },
    });
  };

  const removeItem = (localidad: TicketType) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { localidad } });
  };

  const removeTicket = (ticketId: string) => {
    dispatch({ type: 'REMOVE_TICKET', payload: { ticketId } });
  };

  const toggleMemorias = (ticketId: string, withMemories: boolean) => {
    dispatch({ type: 'TOGGLE_MEMORIAS', payload: { ticketId, withMemories } });
  };

  const updateAttendee = (ticketId: string, attendee: AttendeeData) => {
    dispatch({
      type: 'UPDATE_ATTENDEE',
      payload: { ticketId, attendee },
    });
  };

  const applyDiscount = (discount: AppliedDiscount) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: { discount } });
  };

  const removeDiscount = () => {
    dispatch({ type: 'REMOVE_DISCOUNT' });
  };

  const setEdition = (editionId: number, editionSlug: string) => {
    dispatch({ type: 'SET_EDITION', payload: { editionId, editionSlug } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        removeTicket,
        toggleMemorias,
        updateAttendee,
        applyDiscount,
        removeDiscount,
        setEdition,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }

  return context;
};
