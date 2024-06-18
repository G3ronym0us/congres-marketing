export interface Conferencista {
  nombre: string;
  alt: string;
  titulo: string;
  descripcion?: string;
  roles?: string[];
  publicaciones?: string[];
  premios?: string[];
  formacion?: string[];
  experiencias?: string[];
  redesSociales: {
    Instagram?: string;
    X?: string;
    Facebook?: string;
  };
}
