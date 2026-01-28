import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:3000",
        env: {
            API_URL: process.env.NEXT_PUBLIC_API_V1_URL,
        },
        setupNodeEvents(on, config) {
            // implement node event listeners here
            return config;
        },

        // video: true,
        // videosFolder: "cypress/videos",
    },
});
