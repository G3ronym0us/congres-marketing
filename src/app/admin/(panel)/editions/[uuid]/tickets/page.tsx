'use client';

import { useParams } from 'next/navigation';
import TicketsTable from '@/components/tickets/table';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionTicketsPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  const uuid = String(params?.uuid ?? '');
  const edition = editions.find((e) => e.uuid === uuid);
  return <TicketsTable editionId={edition?.id} editions={editions} />;
}
