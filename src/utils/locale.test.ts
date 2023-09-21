/* eslint-disable no-underscore-dangle */
import { allTranslations, loadServerSideLocales } from "@/utils/locale";

describe("locale", () => {
    describe("loadServerSideLocales", () => {
        it("should return default config", async () => {
            const response = await loadServerSideLocales();
            expect(response._nextI18Next?.initialLocale).toEqual("en");
            expect(response._nextI18Next?.ns).toEqual(allTranslations);
        });
    });
});
