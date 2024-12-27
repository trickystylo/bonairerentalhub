import { Language, TranslationKey } from './types';
import { nl } from './nl';
import { en } from './en';
import { pap } from './pap';
import { es } from './es';

export type { Language, TranslationKey };

export const translations = {
  NL: nl,
  EN: en,
  PAP: pap,
  ES: es,
};

export const useTranslation = (language: Language) => {
  return (key: TranslationKey): string => {
    return translations[language][key] || key;
  };
};