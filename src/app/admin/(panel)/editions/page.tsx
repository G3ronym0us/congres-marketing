'use client';

import { useRouter } from 'next/navigation';
import EditionsAdmin from '@/components/admin/editions/EditionsAdmin';
import { useAdminEditions } from '@/context/AdminEditionsContext';

export default function EditionsPage() {
  const router = useRouter();
  const { loadEditions } = useAdminEditions();

  return (
    <EditionsAdmin
      onChanged={loadEditions}
      onOpen={(e) => router.push(`/admin/editions/${e.id}`)}
    />
  );
}
