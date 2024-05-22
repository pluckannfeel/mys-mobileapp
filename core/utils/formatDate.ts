// utils/formatDate.ts
import { format, parseISO } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import { Locale } from "date-fns";

interface Locales {
  en: Locale;
  ja: Locale;
}

const locales: Locales = { en: enUS, ja: ja };

export const formatDate = (dateString: string, locale: keyof Locales): string => {
  const date = parseISO(dateString);
  const formatString = "MMM dd, yyyy HH:mm";
  return format(date, formatString, { locale: locales[locale] });
};

// utils/getLocale.ts
export function getLocale(lang: string): keyof Locales {
    const supportedLocales: Record<string, keyof Locales> = {
        'en-US': 'en',
        'ja-JP': 'ja',
        // Add other mappings as needed
    };
    return supportedLocales[lang] || 'ja'; // Default to 'en' if not found
}
