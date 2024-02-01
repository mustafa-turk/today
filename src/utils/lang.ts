import * as Localization from "expo-localization";
import { SUPPORTED_LANGS } from "./constants";

export const supportedLang = () => {
  const fallbackLang = "en-US";
  const [lang] = Localization.getLocales();
  return SUPPORTED_LANGS.includes(lang.languageCode)
    ? Localization.locale
    : fallbackLang;
};
