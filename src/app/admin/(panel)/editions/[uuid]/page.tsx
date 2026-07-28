'use client';

import { useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminEditionService } from '@/services/editions';
import { Edition } from '@/types/edition';
import EditionForm, {
  EditionFormState,
  stripFormMeta,
  toLocalInput,
  toDateInput,
} from '@/components/admin/editions/EditionForm';
import { useAdminEditions } from '@/context/AdminEditionsContext';

const PANEL2 = '#332A30';

// Edition -> estado del formulario de "Resumen" (misma forma que en EditionsAdmin).
const toFormState = (e: Edition): EditionFormState => ({
  id: e.id, uuid: e.uuid, slug: e.slug, name: e.name, year: e.year, country: e.country,
  city: e.city ?? '', venue: e.venue ?? '',
  iso: toLocalInput(e.display?.iso ?? e.eventStartDate),
  endDate: toDateInput(e.eventEndDate),
  display: e.display ?? undefined,
  status: e.status, salesOpen: e.salesOpen, visible: e.visible,
  certificatesEnabled: e.certificatesEnabled, sortOrder: e.sortOrder,
});

export default function EditionOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const { editions, loadEditions } = useAdminEditions();
  const uuid = String(params?.uuid ?? '');
  const edition = editions.find((e) => e.uuid === uuid);

  const [toast, setToast] = useState('');
  const toastRef = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 3000);
  };

  if (!edition) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'rgba(255,255,255,.4)' }}>
          Cargando…
        </div>
      </div>
    );
  }

  const handleSave = async (data: EditionFormState) => {
    await adminEditionService.update(edition.uuid, stripFormMeta(data));
    showToast('Edición actualizada');
    loadEditions();
  };

  return (
    <>
      <EditionForm
        mode="edit"
        embedded
        initial={toFormState(edition)}
        onSave={handleSave}
        onBack={() => router.push('/admin/editions')}
      />

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: PANEL2, border: `1px solid rgba(4,238,98,.3)`, borderRadius: 12, padding: '12px 20px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,.5)' }}>
          ✅ {toast}
        </div>
      )}
    </>
  );
}
