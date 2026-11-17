'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Locale = 'pt' | 'en';
type Messages = Record<string, string>;

interface LocaleContextType {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'pt',
  t: (key) => key,
  setLocale: () => {},
});

export function LocaleProvider({ children, initialLocale = 'pt' }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    import(`../../messages/${locale}.json`)
      .then((m) => setMessages(m.default))
      .catch(() => setMessages({}));
  }, [locale]);

  const setLocale = useCallback(async (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      await fetch('/api/user/locale', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: newLocale }) });
    } catch {}
  }, []);

  const t = useCallback((key: string) => messages[key] || key, [messages]);

  return <LocaleContext.Provider value={{ locale, t, setLocale }}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
