'use client';

import { useParams } from 'next/navigation';
import Lecturers from '@/components/admin/Lecturers';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionLecturersPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  const uuid = String(params?.uuid ?? '');
  const edition = editions.find((e) => e.uuid === uuid);
  return <Lecturers editionId={edition?.id} editions={editions} />;
}
