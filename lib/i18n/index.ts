import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import enTranslation from "./locales/en.json"
import hiTranslation from "./locales/hi.json"
import bnTranslation from "./locales/bn.json"
import taTranslation from "./locales/ta.json"
import teTranslation from "./locales/te.json"

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      hi: {
        translation: hiTranslation,
      },
      bn: {
        translation: bnTranslation,
      },
      ta: {
        translation: taTranslation,
      },
      te: {
        translation: teTranslation,
      },
    },
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n
