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
import { ReferralInfo } from '@/types/asociado';
import { SelectedAddOn } from '@/types/addOn';
import { discountUtils } from '@/services/discountCode';
import { v4 as uuidv4 } from 'uuid'; // Necesitarás instalar esta dependencia: npm install uuid @types/uuid

// Definir tipos de acciones
type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: {
        localidad: TicketType;
        cantidad: number;
        precio: number;
        addOns: SelectedAddOn[];
      };
    }
  | { type: 'REMOVE_ITEM'; payload: { localidad: TicketType } }
  | { type: 'REMOVE_TICKET'; payload: { ticketId: string } }
  | {
      type: 'TOGGLE_ADDON';
      payload: { ticketId: string; addOn: SelectedAddOn; on: boolean };
    }
  | {
      type: 'UPDATE_ATTENDEE';
      payload: { ticketId: string; attendee: AttendeeData };
    }
  | { type: 'APPLY_DISCOUNT'; payload: { discount: AppliedDiscount } }
  | { type: 'REMOVE_DISCOUNT' }
  | { type: 'SET_REFERRAL'; payload: { referral: ReferralInfo } }
  | { type: 'CLEAR_REFERRAL' }
  | { type: 'CLEAR_REFERRAL_PREFILL' }
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
  referral: null,
};

// Clave para almacenar el carrito en localStorage
const CART_STORAGE_KEY = 'event-cart-data';

// Acceso seguro a localStorage: en webviews in-app (WhatsApp/Instagram) y en
// Safari privado, setItem/getItem lanzan (QuotaExceededError/SecurityError).
// Como esto corre dentro del reducer durante el render de React, una excepción
// tumbaría toda la app ("Application error"). Ante un fallo seguimos sin
// persistir: se pierde el carrito entre recargas, pero el flujo no se rompe.
const safeGetCart = (): string | null => {
  try {
    return localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return null;
  }
};

const safeSetCart = (value: string): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, value);
  } catch {
    // storage no disponible: se continúa sin persistir
  }
};

const safeRemoveCart = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // storage no disponible: no hay nada que limpiar
  }
};

// Crear un ticket vacío
const createEmptyTicket = (
  type: TicketType,
  price: number,
  addOns: SelectedAddOn[],
): Ticket => ({
  id: uuidv4(), // Generar un ID único
  type,
  price,
  addOns: [...addOns],
  attendee: {
    name: '',
    lastname: '',
    document: '',
    email: '',
    phone: '',
  },
});

// Función para calcular el total del carrito.
// Precedencia de descuentos (espejo del backend): un discount code manual
// manda sobre el % del código de asociado; el referral solo descuenta cuando
// no hay discount code aplicado.
const calcularTotal = (
  items: CartItem[],
  appliedDiscount?: { code: string; percentage: number } | null,
  referral?: ReferralInfo | null,
): number => {
  const subtotal = items.reduce((total, item) => {
    return (
      total +
      item.tickets.reduce((subtotal, ticket) => {
        const addOnsTotal = ticket.addOns.reduce((s, a) => s + a.price, 0);
        return subtotal + ticket.price + addOnsTotal;
      }, 0)
    );
  }, 0);

  const percentage =
    appliedDiscount?.percentage ?? referral?.percentage ?? null;

  if (percentage) {
    const discountAmount = discountUtils.getDiscountAmount(subtotal, percentage);
    return subtotal - discountAmount;
  }

  return subtotal;
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { localidad, cantidad, precio, addOns } = action.payload;
      // Verificar si ya existe un item para esta localidad
      const existingItemIndex = state.items.findIndex(
        (item) => item.localidad === localidad,
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // El item existe, simplemente agregamos nuevos tickets
        const newTickets: Ticket[] = [];

        for (let i = 0; i < cantidad; i++) {
          newTickets.push(createEmptyTicket(localidad, precio, addOns));
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
          newTickets.push(createEmptyTicket(localidad, precio, addOns));
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
        total: calcularTotal(newItems, state.appliedDiscount, state.referral),
      };

      // Guardar en localStorage
      safeSetCart(JSON.stringify(newState));

      return newState;
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        (item) => item.localidad !== action.payload.localidad,
      );

      const newState = {
        ...state,
        items: newItems,
        total: calcularTotal(newItems, state.appliedDiscount, state.referral),
      };

      safeSetCart(JSON.stringify(newState));

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
        total: calcularTotal(newItems, state.appliedDiscount, state.referral),
      };

      safeSetCart(JSON.stringify(newState));

      return newState;
    }

    case 'TOGGLE_ADDON': {
      const { ticketId, addOn, on } = action.payload;

      const newItems = state.items.map((item) => ({
        ...item,
        tickets: item.tickets.map((ticket) => {
          if (ticket.id !== ticketId) return ticket;
          const without = ticket.addOns.filter((a) => a.id !== addOn.id);
          return { ...ticket, addOns: on ? [...without, addOn] : without };
        }),
      }));

      const newState = {
        ...state,
        items: newItems,
        total: calcularTotal(newItems, state.appliedDiscount, state.referral),
      };

      safeSetCart(JSON.stringify(newState));

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

      safeSetCart(JSON.stringify(newState));

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

      safeSetCart(JSON.stringify(newState));
      return newState;
    }

    case 'REMOVE_DISCOUNT': {
      const newState = {
        ...state,
        appliedDiscount: null,
        // Sin discount code, el % del referral (si existe) vuelve a aplicar
        total: calcularTotal(state.items, null, state.referral),
      };

      safeSetCart(JSON.stringify(newState));
      return newState;
    }

    case 'SET_REFERRAL': {
      const { referral } = action.payload;
      const newState = {
        ...state,
        referral,
        total: calcularTotal(state.items, state.appliedDiscount, referral),
      };

      safeSetCart(JSON.stringify(newState));
      return newState;
    }

    case 'CLEAR_REFERRAL': {
      const newState = {
        ...state,
        referral: null,
        total: calcularTotal(state.items, state.appliedDiscount, null),
      };

      safeSetCart(JSON.stringify(newState));
      return newState;
    }

    // Se consume el prellenado tras aplicarlo una vez, para no pisar lo que
    // el usuario edite después. leadUuid y code se conservan.
    case 'CLEAR_REFERRAL_PREFILL': {
      if (!state.referral) return state;
      const newState = {
        ...state,
        referral: { ...state.referral, prefill: null },
      };

      safeSetCart(JSON.stringify(newState));
      return newState;
    }

    case 'SET_EDITION': {
      const { editionId, editionSlug } = action.payload;
      // Si el carrito pertenece a otra edición, se vacía para no mezclar
      // localidades. El referral del asociado se preserva: el flujo /CODIGO
      // llega aquí justo después de guardar el referral.
      const sameEdition = state.editionId === editionId;
      const newState: CartState = sameEdition
        ? { ...state, editionId, editionSlug }
        : {
            ...initialState,
            editionId,
            editionSlug,
            referral: state.referral ?? null,
          };
      safeSetCart(JSON.stringify(newState));
      return newState;
    }

    case 'RESTORE_CART': {
      return action.payload;
    }

    case 'CLEAR_CART': {
      safeRemoveCart();
      return initialState;
    }

    default:
      return state;
  }
};

// Crear contexto
interface CartContextType {
  state: CartState;
  /** false hasta que se intenta restaurar el carrito desde localStorage (primer efecto tras el mount) */
  isHydrated: boolean;
  addItem: (
    localidad: TicketType,
    cantidad: number,
    price: number,
    addOns: SelectedAddOn[],
  ) => void;
  removeItem: (localidad: TicketType) => void;
  removeTicket: (ticketId: string) => void;
  toggleAddOn: (ticketId: string, addOn: SelectedAddOn, on: boolean) => void;
  updateAttendee: (ticketId: string, attendee: AttendeeData) => void;
  applyDiscount: (discount: AppliedDiscount) => void;
  removeDiscount: () => void;
  setReferral: (referral: ReferralInfo) => void;
  clearReferral: () => void;
  clearReferralPrefill: () => void;
  setEdition: (editionId: number, editionSlug: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Proveedor del contexto
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = safeGetCart();
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart) as CartState;
        dispatch({ type: 'RESTORE_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error parsing stored cart:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  const addItem = (
    localidad: TicketType,
    cantidad: number,
    precio: number,
    addOns: SelectedAddOn[],
  ) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { localidad, cantidad, precio, addOns },
    });
  };

  const removeItem = (localidad: TicketType) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { localidad } });
  };

  const removeTicket = (ticketId: string) => {
    dispatch({ type: 'REMOVE_TICKET', payload: { ticketId } });
  };

  const toggleAddOn = (ticketId: string, addOn: SelectedAddOn, on: boolean) => {
    dispatch({ type: 'TOGGLE_ADDON', payload: { ticketId, addOn, on } });
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

  const setReferral = (referral: ReferralInfo) => {
    dispatch({ type: 'SET_REFERRAL', payload: { referral } });
  };

  const clearReferral = () => {
    dispatch({ type: 'CLEAR_REFERRAL' });
  };

  const clearReferralPrefill = () => {
    dispatch({ type: 'CLEAR_REFERRAL_PREFILL' });
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
        isHydrated,
        addItem,
        removeItem,
        removeTicket,
        toggleAddOn,
        updateAttendee,
        applyDiscount,
        removeDiscount,
        setReferral,
        clearReferral,
        clearReferralPrefill,
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
