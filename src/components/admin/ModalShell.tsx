'use client';

import React, { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

/** Confirmación estándar antes de cerrar un formulario con cambios sin guardar. */
export async function confirmDiscard(): Promise<boolean> {
  const { isConfirmed } = await Swal.fire({
    title: '¿Descartar cambios?',
    text: 'Hay cambios sin guardar que se perderán.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, descartar',
    cancelButtonText: 'Seguir editando',
    background: '#2A2228',
    color: '#fff',
  });
  return isConfirmed;
}

/**
 * Carcasa compartida de los modales del admin: tarjeta centrada en desktop,
 * bottom-sheet en móvil (≤700px, ver admin.css) con gesto de arrastre hacia
 * abajo para cerrar. El drag solo se activa cuando el contenido está
 * scrolleado arriba del todo, para no interferir con el scroll interno.
 */
export default function ModalShell({
  onClose,
  maxWidth,
  zIndex,
  backdropStyle,
  children,
}: {
  onClose: () => void;
  maxWidth: number;
  zIndex?: number;
  backdropStyle?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const drag = { startY: 0, dy: 0, active: false };
    const isSheet = () => window.matchMedia('(max-width: 700px)').matches;

    const onStart = (e: TouchEvent) => {
      if (!isSheet() || card.scrollTop > 0) return;
      drag.startY = e.touches[0].clientY;
      drag.dy = 0;
      drag.active = true;
    };

    const onMove = (e: TouchEvent) => {
      if (!drag.active) return;
      const dy = e.touches[0].clientY - drag.startY;
      // gesto hacia arriba = el usuario quiere scrollear contenido, no cerrar
      if (dy <= 0 || card.scrollTop > 0) {
        drag.active = false;
        card.style.transform = '';
        return;
      }
      e.preventDefault();
      drag.dy = dy;
      card.style.transition = 'none';
      card.style.transform = `translateY(${dy}px)`;
    };

    const onEnd = () => {
      if (!drag.active) return;
      drag.active = false;
      card.style.transition = 'transform .25s cubic-bezier(.32,.72,.24,1)';
      if (drag.dy > 110) {
        card.style.transform = 'translateY(105%)';
        setTimeout(() => {
          onCloseRef.current();
          // si el cierre fue vetado (p. ej. confirmación de descartar cambios),
          // el modal sigue montado: regresa la tarjeta a su posición
          requestAnimationFrame(() => {
            card.style.transform = '';
            setTimeout(() => { card.style.transition = ''; }, 260);
          });
        }, 220);
      } else {
        card.style.transform = '';
        setTimeout(() => { card.style.transition = ''; }, 260);
      }
    };

    // touchmove no-pasivo: React registra estos eventos como pasivos y
    // preventDefault() no surtiría efecto desde el handler sintético
    card.addEventListener('touchstart', onStart, { passive: true });
    card.addEventListener('touchmove', onMove, { passive: false });
    card.addEventListener('touchend', onEnd);
    card.addEventListener('touchcancel', onEnd);
    return () => {
      card.removeEventListener('touchstart', onStart);
      card.removeEventListener('touchmove', onMove);
      card.removeEventListener('touchend', onEnd);
      card.removeEventListener('touchcancel', onEnd);
    };
  }, []);

  return (
    <div className="adm-modal-overlay" style={zIndex ? { zIndex } : undefined}>
      <div className="adm-modal-backdrop" style={backdropStyle} onClick={onClose} />
      <div ref={cardRef} className="adm-modal-card" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
