import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importar estilos del carrusel
import { Carousel } from "react-responsive-carousel"; // Importar componente del carrusel

const CarouselComponent = () => {
  return (
    <Carousel>
      <div>
        <img src={
                      process.env.NEXT_PUBLIC_URL +
                      "images/carousel1.jpg"
                    } alt="Imagen 1" />
        <p className="legend">Imagen 1</p>
      </div>
      <div>
        <img src={
                      process.env.NEXT_PUBLIC_URL +
                      "images/carousel2.jpg"
                    } alt="Imagen 2" />
        <p className="legend">Imagen 2</p>
      </div>
      <div>
        <img src={
                      process.env.NEXT_PUBLIC_URL +
                      "images/carousel3.jpg"
                    } alt="Imagen 3" />
        <p className="legend">Imagen 3</p>
      </div>
      <div>
        <img src={
                      process.env.NEXT_PUBLIC_URL +
                      "images/carousel1.jpg"
                    } alt="Imagen 4" />
        <p className="legend">Imagen 3</p>
      </div>
    </Carousel>
  );
};

export default CarouselComponent;
