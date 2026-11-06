import apiClient, { handleError } from '@/utils/apiClient';
import {
  Edition,
  CreateEditionInput,
  UpdateEditionInput,
  CloneEditionInput,
  CertificateTemplate,
  SetEditionFlagsInput,
} from '@/types/edition';

// Público: solo ediciones visibles
export async function getPublicEditions(): Promise<Edition[]> {
  try {
    const res = await apiClient.get('/editions');
    return res.data;
  } catch (error) {
    console.error('Error fetching public editions:', error);
    return [];
  }
}

export async function getEditionBySlug(slug: string): Promise<Edition | null> {
  try {
    const res = await apiClient.get(`/editions/${slug}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching edition by slug:', error);
    return null;
  }
}

// Admin
export const adminEditionService = {
  async getAll(): Promise<Edition[]> {
    try {
      const res = await apiClient.get('/admin/editions');
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getByUuid(uuid: string): Promise<Edition> {
    try {
      const res = await apiClient.get(`/admin/editions/${uuid}`);
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async create(input: CreateEditionInput): Promise<Edition> {
    try {
      const res = await apiClient.post('/admin/editions', input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async clone(input: CloneEditionInput): Promise<Edition> {
    try {
      const res = await apiClient.post('/admin/editions/clone', input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async update(uuid: string, input: UpdateEditionInput): Promise<Edition> {
    try {
      const res = await apiClient.patch(`/admin/editions/${uuid}`, input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Sube el PDF de hoteles de la edición y devuelve la edición actualizada.
  async uploadHotelBrochure(uuid: string, file: File): Promise<Edition> {
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiClient.post(
        `/admin/editions/${uuid}/hotel-brochure`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async removeHotelBrochure(uuid: string): Promise<Edition> {
    try {
      const res = await apiClient.delete(`/admin/editions/${uuid}/hotel-brochure`);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // URL firmada para ver/descargar el brochure actual.
  async getHotelBrochureUrl(uuid: string): Promise<string | null> {
    try {
      const res = await apiClient.get(`/admin/editions/${uuid}/hotel-brochure-url`);
      return res.data?.url ?? null;
    } catch (error) {
      return handleError(error);
    }
  },

  // HTML de la vista previa del correo de compra (en el idioma indicado).
  async getPurchaseEmailPreview(uuid: string, lang: 'es' | 'en'): Promise<string> {
    const res = await apiClient.get(
      `/admin/editions/${uuid}/purchase-email-preview`,
      { params: { lang }, responseType: 'text' },
    );
    return res.data as string;
  },

  async setFlags(uuid: string, input: SetEditionFlagsInput): Promise<Edition> {
    try {
      const res = await apiClient.patch(`/admin/editions/${uuid}/flags`, input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Sube la imagen 3:2 que reemplaza al código de la edición en la landing.
  // Devuelve la URL pública; se guarda en display.flagImage al guardar el form.
  async uploadFlagImage(file: File): Promise<{ key: string; url: string }> {
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiClient.post('/admin/editions/flag-image', form);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Sube el fondo del certificado (pdf/jpg/png). Sin Content-Type manual: el
  // navegador debe poner el boundary del multipart.
  async uploadCertificateBackground(
    editionUuid: string,
    file: File,
  ): Promise<{ key: string; url: string; backgroundType: 'pdf' | 'image' }> {
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiClient.post(
        `/admin/editions/${editionUuid}/certificate-template/background`,
        form,
      );
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Descarga un certificado de prueba con el formato indicado.
  async downloadCertificatePreview(
    editionUuid: string,
    template: CertificateTemplate,
  ): Promise<void> {
    const res = await apiClient.post(
      `/admin/editions/${editionUuid}/certificate-template/preview`,
      template,
      { responseType: 'blob' },
    );
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: 'application/pdf' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificado-prueba.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  async saveCertificateTemplate(
    editionUuid: string,
    template: CertificateTemplate,
  ): Promise<{ edition: Edition; outdated: number; recipients: number }> {
    try {
      const res = await apiClient.put(
        `/admin/editions/${editionUuid}/certificate-template`,
        template,
      );
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  /** Fondo del formato guardado, servido por el back (no depende del CORS del bucket). */
  async getCertificateBackground(editionUuid: string): Promise<Blob> {
    const res = await apiClient.get(
      `/admin/editions/${editionUuid}/certificate-template/background`,
      { responseType: 'blob' },
    );
    return res.data;
  },

  /** A quién llegaría el envío de certificados y cuántos tienen uno de otro formato. */
  async getCertificateRecipients(
    editionUuid: string,
  ): Promise<{ outdated: number; recipients: number }> {
    try {
      const res = await apiClient.get(`/admin/editions/${editionUuid}/certificate-recipients`);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async remove(uuid: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/editions/${uuid}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
