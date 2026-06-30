'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Edition } from '@/types/edition';
import { adminEditionService } from '@/services/editions';
import { getCurrentEdition, setCurrentEdition as apiSetCurrentEdition } from '@/services/tickets';

// Fecha de referencia de una edición (para ordenar por más reciente)
const editionDate = (e: Edition): number => {
  if (e.display?.iso) return new Date(e.display.iso).getTime();
  if (e.eventStartDate) return new Date(e.eventStartDate).getTime();
  return new Date(e.year, 0, 1).getTime();
};

// Edición seleccionada por defecto: la activa (en venta) con la fecha más reciente;
// si ninguna está en venta, la más reciente de todas.
const pickDefaultEditionId = (list: Edition[]): number | undefined => {
  const active = list.filter(e => e.salesOpen);
  const pool = active.length ? active : list;
  return [...pool].sort((a, b) => editionDate(b) - editionDate(a))[0]?.id;
};

type AdminEditionsCtx = {
  editions: Edition[];
  /** Edición marcada como "por defecto" en el backend (respaldo cuando no se especifica). */
  defaultEdition: number | null;
  /** Edición que se está visualizando en el panel (selector del dashboard). */
  viewEdition: number | undefined;
  setViewEdition: (id: number | undefined) => void;
  loadEditions: () => Promise<void>;
  /** Marca una edición como la por defecto del backend. */
  makeDefault: (id: number) => Promise<void>;
};

const AdminEditionsContext = createContext<AdminEditionsCtx | null>(null);

export function AdminEditionsProvider({ children }: { children: ReactNode }) {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [defaultEdition, setDefaultEdition] = useState<number | null>(null);
  const [viewEdition, setViewEdition] = useState<number | undefined>(undefined);

  const loadEditions = useCallback(async () => {
    try {
      const [list, current] = await Promise.all([
        adminEditionService.getAll(),
        getCurrentEdition().catch(() => ({ currentEdition: null as number | null })),
      ]);
      setEditions(list);
      setDefaultEdition(current.currentEdition);
      setViewEdition(prev =>
        prev ?? pickDefaultEditionId(list) ?? current.currentEdition ?? list[0]?.id ?? undefined,
      );
    } catch {
      setEditions([]);
    }
  }, []);

  useEffect(() => { loadEditions(); }, [loadEditions]);

  const makeDefault = useCallback(async (id: number) => {
    const res = await apiSetCurrentEdition(id);
    setDefaultEdition(res.currentEdition);
  }, []);

  return (
    <AdminEditionsContext.Provider
      value={{ editions, defaultEdition, viewEdition, setViewEdition, loadEditions, makeDefault }}
    >
      {children}
    </AdminEditionsContext.Provider>
  );
}

export function useAdminEditions(): AdminEditionsCtx {
  const ctx = useContext(AdminEditionsContext);
  if (!ctx) throw new Error('useAdminEditions debe usarse dentro de <AdminEditionsProvider>');
  return ctx;
}
