'use client';

import { useParams } from 'next/navigation';
import LocalidadesAdmin from '@/components/admin/LocalidadesAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionLocalidadesPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  return <LocalidadesAdmin editionId={Number(params?.id)} editions={editions} />;
}
