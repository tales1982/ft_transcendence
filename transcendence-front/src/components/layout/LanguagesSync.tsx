import { useEffect } from "react";
import { useSelector } from "react-redux";
import i18n from "i18next";
import type { RootState } from "../../store/store";

export default function LanguageSync() {
  const lang = useSelector((state: RootState) => state.language.current);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return null;
}
