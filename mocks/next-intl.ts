module.exports = {
  NextIntlClientProvider: ({ children }) => children,
  useTranslations: () => (key => key),
  useFormatter: () => ({
    format: v => v,
  }),
};