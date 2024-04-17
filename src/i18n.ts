import enJSON from "@/locales/en.json"
import zhJSON from "@/locales/zh.json"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next).init({
  resources: {
    zh: {
      translation: { ...zhJSON },
    },
    en: {
      translation: { ...enJSON },
    },
  },
  lng: localStorage.getItem("setting.locale") ?? "en",
  fallbackLng: "en",
})
