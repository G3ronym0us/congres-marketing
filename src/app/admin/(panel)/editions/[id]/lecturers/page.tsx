'use client';

import { useParams } from 'next/navigation';
import Lecturers from '@/components/admin/Lecturers';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionLecturersPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  return <Lecturers editionId={Number(params?.id)} editions={editions} />;
}
