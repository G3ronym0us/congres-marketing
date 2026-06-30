'use client';

import { useParams } from 'next/navigation';
import DiscountCodesAdmin from '@/components/admin/discountCodes/DiscountCodesAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionDiscountCodesPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  const uuid = String(params?.uuid ?? '');
  const edition = editions.find((e) => e.uuid === uuid);
  return <DiscountCodesAdmin editionId={edition?.id} editions={editions} />;
}
