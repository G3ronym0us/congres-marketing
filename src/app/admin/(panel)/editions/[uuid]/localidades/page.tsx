'use client';

import { useParams } from 'next/navigation';
import LocalidadesAdmin from '@/components/admin/LocalidadesAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionLocalidadesPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  const uuid = String(params?.uuid ?? '');
  const edition = editions.find((e) => e.uuid === uuid);
  return <LocalidadesAdmin editionId={edition?.id} editions={editions} />;
}
