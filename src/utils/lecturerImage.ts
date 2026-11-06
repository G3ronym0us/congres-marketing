/* Subida de foto de conferencista: mismos límites que el ParseFilePipe del
   backend (POST /lecturers/:uuid/upload-image). Se valida en el cliente porque
   el 400 de Nest no le dice al usuario qué está mal. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(',');

/** Devuelve el problema de la imagen o null si se puede subir. */
export function lecturerImageError(file: File): { title: string; text: string } | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      title: 'Formato no admitido',
      text: 'La imagen debe ser JPG, PNG o WEBP. Las fotos de iPhone (HEIC) hay que convertirlas antes de subirlas.',
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      title: 'Imagen demasiado pesada',
      text: `Pesa ${(file.size / 1024 / 1024).toFixed(1)} MB y el máximo son 5 MB.`,
    };
  }
  return null;
}

/** Slug para la URL pública: "María José Pérez" → "maria-jose-perez". */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
