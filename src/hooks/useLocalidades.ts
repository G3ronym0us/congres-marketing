import { useState, useEffect } from 'react';
import { localidadesData } from '@/data/ticketsData';
import { LocalidadDetalle } from '@/types/tickets';
import { getLocalidadTypes } from '@/services/localidadTypes';

/**
 * Carga las localidades (nombre, precio, features) desde el backend.
 * Arranca vacío con `loading: true` para que las páginas muestren un
 * skeleton (sin flash de datos estáticos viejos); solo si la API falla
 * o no devuelve nada se usa localidadesData estático como fallback.
 * Los estilos visuales (color/border) no existen en la API, así que se
 * heredan del registro estático con el mismo slug.
 */
export const useLocalidades = (edition?: number) => {
  const [localidades, setLocalidades] =
    useState<Record<string, LocalidadDetalle>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sin edición no llamamos a la API (evita mezclar localidades de varias ediciones);
    // mostramos el fallback estático hasta que se resuelva la edición.
    if (!edition) {
      setLocalidades(localidadesData);
      setLoading(false);
      return;
    }
    setLoading(true);
    getLocalidadTypes(edition)
      .then(types => {
        if (!Array.isArray(types) || types.length === 0) {
          setLocalidades(localidadesData);
          return;
        }
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
              addOns: (t.addOns ?? [])
                .filter(a => a.addOn?.active)
                .map(a => ({
                  id: a.addOn.id,
                  slug: a.addOn.slug,
                  name: a.addOn.name,
                  price: a.addOn.price,
                  icon: a.addOn.icon,
                  description: a.addOn.description,
                  included: a.included,
                })),
            };
          });
        setLocalidades(merged);
      })
      .catch(err => {
        console.error('Error cargando localidades:', err);
        setLocalidades(localidadesData);
      })
      .finally(() => setLoading(false));
  }, [edition]);

  return { localidades, loading };
};
