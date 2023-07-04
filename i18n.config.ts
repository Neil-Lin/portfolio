import { datetimeFormats } from "./i18n/datetime-formats"
export default defineI18nConfig(() => ({
  legacy: false,
  datetimeFormats,
  fallbackLocale: 'zh-Hant-TW'
}))
