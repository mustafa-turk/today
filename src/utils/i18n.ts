import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

import en from "@/translations/en.json";
import fr from "@/translations/fr.json";

const translations = {
  en,
  fr,
};

const i18n = new I18n(translations);

i18n.locale = Localization.locale;
i18n.enableFallback = true;

export default i18n;
