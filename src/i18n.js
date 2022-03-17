import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const config = {
    debug: false,
    fallbackLng: 'en-GB',
    lng: 'en-GB',
    interpolation: {
        escapeValue: false,
    },
};

if (process.env.NODE_ENV === 'test') {
    import('public/locales/en-GB/translation.json').then(enGBTranslation => {
        i18n.use(initReactI18next).init({
            ...config,
            resources: {
                'en-GB': {
                    translation: enGBTranslation,
                },
            },
        });
    });
} else {
    i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init(config);
}

export default i18n;
