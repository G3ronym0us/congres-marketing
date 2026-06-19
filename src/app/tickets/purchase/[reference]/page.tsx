'use client';

import Navbar from '@/components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PurchaseSuccess() {
  const params = useParams();
  const { t } = useLanguage();
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    if (params?.reference) {
      setReference(params.reference as string);
    }
  }, [params]);

  const bgStyle = {
    height: '100vh',
    backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}images/locality-bg.png')`,
  };

  return (
    <>
      <Navbar />
      <div className="grid lg:grid-cols-1 w-full" style={bgStyle}>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-500 text-6xl mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {t('purchaseSuccess.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {t('purchaseSuccess.thanks')}{' '}
              <span className="font-bold">{reference}</span>
            </p>
            <div
              className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6"
              role="alert"
            >
              <p className="font-bold">{t('purchaseSuccess.importantInfo')}</p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                {t('purchaseSuccess.emailNotice')}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              {t('purchaseSuccess.spamNotice')}
            </p>
            <Link href={process.env.NEXT_PUBLIC_URL + 'tickets/buy'}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {t('purchaseSuccess.backHome')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
