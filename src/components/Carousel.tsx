import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importar estilos del carrusel
import { Carousel as OriginalCarousel } from "react-responsive-carousel"; // Importar componente del carrusel

// Sobrescribir la definición de tipo para Carousel
const Carousel: any = OriginalCarousel;

const images = [
  "carousel2.jpg",
  "carousel3.jpg",
  "carousel4.jpg",
  "carousel5.jpg",
  "carousel6.jpg",
  "carousel7.jpg",
  "carousel8.jpg",
];

const CarouselComponent = () => {
  return (
    <>
      <Carousel>
        {images.map((image, index) => {
          return (
            <div key={index}>
              <img
                src={process.env.NEXT_PUBLIC_URL + "images/2024/carrousel/" + image }
                alt={image}
              />
            </div>
          );
        })}
      </Carousel>
    </>
  );
};

export default CarouselComponent;