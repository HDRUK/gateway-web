import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  viewportHeight: 720,
  viewportWidth: 1280,
  chromeWebSecurity: false, // Very VERY temporary while local host swaps between localhost and uat env
});
