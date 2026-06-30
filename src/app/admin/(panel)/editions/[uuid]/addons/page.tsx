'use client';

import { useParams } from 'next/navigation';
import AddOnsAdmin from '@/components/admin/addOns/AddOnsAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionAddOnsPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  const uuid = String(params?.uuid ?? '');
  const edition = editions.find((e) => e.uuid === uuid);
  return <AddOnsAdmin editionId={edition?.id} editions={editions} />;
}
