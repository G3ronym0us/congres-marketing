'use client';

import { useParams } from 'next/navigation';
import AddOnsAdmin from '@/components/admin/addOns/AddOnsAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionAddOnsPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  return <AddOnsAdmin editionId={Number(params?.id)} editions={editions} />;
}
