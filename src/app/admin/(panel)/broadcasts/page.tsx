'use client';

import BroadcastsAdmin from '@/components/admin/broadcasts/BroadcastsAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function BroadcastsPage() {
  const { editions } = useAdminEditions();
  return <BroadcastsAdmin editions={editions} />;
}
