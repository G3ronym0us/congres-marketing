'use client';

import { useParams } from 'next/navigation';
import DiscountStagesAdmin from '@/components/admin/editions/DiscountStagesAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionDiscountStagesPage() {
  const params = useParams();
  const { editions, loadEditions } = useAdminEditions();
  return (
    <DiscountStagesAdmin
      editionId={Number(params?.id)}
      editions={editions}
      onChanged={loadEditions}
    />
  );
}
