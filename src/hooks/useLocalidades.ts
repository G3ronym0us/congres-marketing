import { useState, useEffect } from 'react';
import { localidadesData } from '@/data/ticketsData';
import { LocalidadDetalle } from '@/types/tickets';
import { getLocalidadTypes } from '@/services/localidadTypes';

/**
 * Carga las localidades (nombre, precio, features) desde el backend.
 * Mientras carga —o si la API falla— usa localidadesData estático como fallback.
 * Los estilos visuales (color/border) no existen en la API, así que se
 * heredan del registro estático con el mismo slug.
 */
export const useLocalidades = () => {
  const [localidades, setLocalidades] =
    useState<Record<string, LocalidadDetalle>>(localidadesData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocalidadTypes()
      .then(types => {
        if (!Array.isArray(types) || types.length === 0) return;
        const merged: Record<string, LocalidadDetalle> = {};
        [...types]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .filter(t => t.active)
          .forEach(t => {
            const base = localidadesData[t.slug];
            merged[t.slug] = {
              name: t.name,
              price: t.price,
              icon: t.icon || base?.icon || '🎫',
              features: t.features?.length ? t.features : base?.features ?? [],
              withMemories: t.withMemories,
              pushable: t.pushable,
              color: base?.color ?? 'bg-white/10',
              border: base?.border ?? 'border-white/20',
              noPermiteMemorias: base?.noPermiteMemorias,
            };
          });
        setLocalidades(merged);
      })
      .catch(err => console.error('Error cargando localidades:', err))
      .finally(() => setLoading(false));
  }, []);

  return { localidades, loading };
};
