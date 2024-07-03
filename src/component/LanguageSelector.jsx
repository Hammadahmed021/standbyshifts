import React from "react";
import { LANGUAGES } from "../constant";
import SelectOption from "./SelectOption";
import { useTranslation } from "react-i18next";
import { LuGlobe } from "react-icons/lu";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const onChangeLang = (e) => {
    const lang_code = e.target.value;
    i18n.changeLanguage(lang_code);
    localStorage.setItem("i18nextLng", lang_code);
  };


  return (
    <div className="flex flex-row items-center">
      <LuGlobe size={12} />
      <select defaultValue={i18n.language} onChange={onChangeLang} className="outline-none">
        {LANGUAGES.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
