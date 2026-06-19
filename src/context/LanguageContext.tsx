'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Cookies from 'js-cookie';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

export type Lang = 'es' | 'en';

const DICTIONARIES: Record<Lang, Record<string, any>> = { es, en };
const DEFAULT_LANG: Lang = 'es';
const COOKIE_KEY = 'lang';

type TVars = Record<string, string | number>;

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /**
   * Traduce una clave con notación de puntos (p. ej. "nav.tickets"). Admite
   * interpolación de variables: t('landing.hero.sub', { city: 'Bogotá' })
   * reemplaza los marcadores {city} en el texto.
   */
  t: (key: string, vars?: TVars) => string;
}

function interpolate(template: string, vars?: TVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

/** Resuelve una clave "a.b.c" dentro de un diccionario anidado. */
function resolve(dict: Record<string, any>, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<any>((acc, part) => (acc == null ? acc : acc[part]), dict);
  return typeof value === 'string' ? value : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Se inicializa con el idioma por defecto para evitar desajustes de hidratación;
  // el valor real de la cookie se aplica tras montar en el cliente.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = Cookies.get(COOKIE_KEY) as Lang | undefined;
    if (stored === 'es' || stored === 'en') {
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    Cookies.set(COOKIE_KEY, next, { expires: 365, sameSite: 'lax' });
    setLangState(next);
  }, []);

  const t = useCallback(
    (key: string, vars?: TVars): string => {
      const template =
        resolve(DICTIONARIES[lang], key) ??
        resolve(DICTIONARIES[DEFAULT_LANG], key) ??
        key;
      return interpolate(template, vars);
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  }
  return ctx;
}
