import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const allTranslations = ["api", "common", "components", "modules"];

const loadServerSideLocales = async (
    locale = "en",
    translations = allTranslations
) => {
    return await serverSideTranslations(locale, translations);
};

export { loadServerSideLocales, allTranslations };
