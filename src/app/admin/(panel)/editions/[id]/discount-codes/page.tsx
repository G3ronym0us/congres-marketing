'use client';

import { useParams } from 'next/navigation';
import DiscountCodesAdmin from '@/components/admin/discountCodes/DiscountCodesAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionDiscountCodesPage() {
  const params = useParams();
  const { editions } = useAdminEditions();
  return <DiscountCodesAdmin editionId={Number(params?.id)} editions={editions} />;
}
