'use client';

import React from 'react';
import { useLanguage, Lang } from '@/context/LanguageContext';

interface LanguageSwitcherProps {
  /** Clases extra para ajustar el contenedor según dónde se monte. */
  className?: string;
}

const OPTIONS: Lang[] = ['es', 'en'];

export default function LanguageSwitcher({
  className = '',
}: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/30 overflow-hidden text-xs md:text-sm ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {OPTIONS.map((option) => {
        const active = lang === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={active}
            className={`px-2.5 py-1 uppercase transition-colors duration-200 ${
              active
                ? 'bg-white text-[#0e1424] font-semibold'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
