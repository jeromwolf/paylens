import { useLanguageStore } from '@/stores/language';
import { translations, TranslationKey } from '@/translations';

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations.ko[key];

    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), String(params[param]));
      });
    }

    return text;
  };

  return { t, language };
};