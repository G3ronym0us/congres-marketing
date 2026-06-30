'use client';

import { useParams } from 'next/navigation';
import TicketsTable from '@/components/tickets/table';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionTicketsPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  return <TicketsTable editionId={Number(params?.id)} editions={editions} />;
}
