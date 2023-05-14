import * as Localization from "expo-localization";
import { SUPPORTED_LANGS } from "./constants";

export const supportedLang = () => {
  return SUPPORTED_LANGS.includes(Localization.locale)
    ? Localization.locale
    : "en-US";
};
