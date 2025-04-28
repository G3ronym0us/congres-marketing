import { useEffect } from 'react';

// Custom hook para implementar la funcionalidad táctil del carrusel
export const useCarouselTouchEvents = (carouselSelector: string): void => {
  useEffect(() => {
    // Función para agregar funcionalidad táctil a los carruseles
    const setupCarouselTouchEvents = (): void => {
      const carousels = document.querySelectorAll<HTMLElement>(carouselSelector);
      
      carousels.forEach(carousel => {
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;
        
        // Detectar inicio del deslizamiento
        carousel.addEventListener('mousedown', (e: MouseEvent) => {
          isDragging = true;
          carousel.classList.add('active');
          startX = e.pageX - carousel.offsetLeft;
          scrollLeft = carousel.scrollLeft;
        });
        
        // Terminar el deslizamiento
        carousel.addEventListener('mouseup', () => {
          isDragging = false;
          carousel.classList.remove('active');
        });
        
        carousel.addEventListener('mouseleave', () => {
          isDragging = false;
          carousel.classList.remove('active');
        });
        
        // Deslizamiento en proceso
        carousel.addEventListener('mousemove', (e: MouseEvent) => {
          if (!isDragging) return;
          e.preventDefault();
          const x = e.pageX - carousel.offsetLeft;
          const walk = (x - startX) * 2; // La velocidad de deslizamiento (multiplicador)
          carousel.scrollLeft = scrollLeft - walk;
        });
        
        // Soporte para eventos táctiles en móviles
        carousel.addEventListener('touchstart', (e: TouchEvent) => {
          isDragging = true;
          startX = e.touches[0].pageX - carousel.offsetLeft;
          scrollLeft = carousel.scrollLeft;
        }, { passive: true });
        
        carousel.addEventListener('touchend', () => {
          isDragging = false;
        }, { passive: true });
        
        carousel.addEventListener('touchmove', (e: TouchEvent) => {
          if (!isDragging) return;
          const x = e.touches[0].pageX - carousel.offsetLeft;
          const walk = (x - startX) * 2;
          carousel.scrollLeft = scrollLeft - walk;
        }, { passive: true });
      });
    };
    
    // Configurar eventos después de que el DOM haya cargado completamente
    setupCarouselTouchEvents();
    
    // Limpieza (opcional si es necesario)
    return () => {
      // Aquí iría la lógica de limpieza si fuera necesario
    };
  }, [carouselSelector]);
};