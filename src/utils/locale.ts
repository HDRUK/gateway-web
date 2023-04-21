import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const allTranslations = ["common", "components"];

const loadServerSideLocales = async (
    locale = "en",
    translations = allTranslations
) => {
    return await serverSideTranslations(locale, translations);
};

export { loadServerSideLocales, allTranslations };
