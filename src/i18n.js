import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    // i18next-http-backend
    // loads translations from your server
    // https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: true,
        fallbackLng: 'en-GB',
        interpolation: {
        escapeValue: false,
        },
        resources: {
        "en-GB": {
            translation: {
                collection: {
                    private: {
                        live: 'This private collection is now live. Only those who you share the collection link with will be able to view this page.',
                        updated: 'Done! Your private collection has been updated. Only those who you share the collection link with will be able to view this page.'
                    },
                    public: {
                        live: 'This public collection is now live. This collection is searchable on the Gateway and can be viewed by all users.',
                        updated: 'Done! Your public collection has been updated. This collection is searchable on the Gateway and can be viewed by all users.'
                    }
                }
            }
        }
    }
});

export default i18n;