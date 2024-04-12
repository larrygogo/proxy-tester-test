import Config from "@/lib/config"
import enJSON from "@/locales/en.json"
import zhJSON from "@/locales/zh.json"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
console.log("Config.get('language')", Config.get("language"))

i18n.use(initReactI18next).init({
  resources: {
    zh: {
      translation: { ...zhJSON },
    },
    en: {
      translation: { ...enJSON },
    },
  },
  lng: Config.get("language") ?? "en",
  fallbackLng: "en",
})
