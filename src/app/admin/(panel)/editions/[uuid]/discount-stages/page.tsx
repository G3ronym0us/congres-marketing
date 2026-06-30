'use client';

import { useParams } from 'next/navigation';
import DiscountStagesAdmin from '@/components/admin/editions/DiscountStagesAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionDiscountStagesPage() {
  const params = useParams();
  const { editions, loadEditions } = useAdminEditions();
  const uuid = String(params?.uuid ?? '');
  const edition = editions.find((e) => e.uuid === uuid);
  return (
    <DiscountStagesAdmin
      editionId={edition?.id}
      editionUuid={edition?.uuid}
      editions={editions}
      onChanged={loadEditions}
    />
  );
}
