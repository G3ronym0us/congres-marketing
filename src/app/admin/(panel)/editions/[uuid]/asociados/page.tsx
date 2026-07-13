'use client';

import { useParams } from 'next/navigation';
import AsociadosAdmin from '@/components/admin/asociados/AsociadosAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionAsociadosPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  const uuid = String(params?.uuid ?? '');
  const edition = editions.find((e) => e.uuid === uuid);
  return <AsociadosAdmin editionId={edition?.id} editions={editions} />;
}
