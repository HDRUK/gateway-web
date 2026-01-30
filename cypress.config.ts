import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:3000",
        env: {
            DEV_EMAIL: process.env.DEV_EMAIL,
            CUST_ADMIN_1_EMAIL: process.env.CUST_ADMIN_1_EMAIL,
            CUST_ADMIN_2_EMAIL: process.env.CUST_ADMIN_2_EMAIL,
            DEV_1_EMAIL: process.env.DEV_1_EMAIL,
            CUST_ADMIN_3_EMAIL: process.env.CUST_ADMIN_3_EMAIL,
            DEV_2_EMAIL: process.env.DEV_2_EMAIL,
            DATA_ACCESS_MANAGER_EMAIL: process.env.DATA_ACCESS_MANAGER_EMAIL,
            DATA_ACCESS_REVIEWER_EMAIL: process.env.DATA_ACCESS_REVIEWER_EMAIL,
            METADATA_MANAGER_EMAIL: process.env.METADATA_MANAGER_EMAIL,
            METADATA_EDITOR_EMAIL: process.env.METADATA_EDITOR_EMAIL,
            DAR_MANAGER_AND_METADATA_MANAGER_EMAIL:
                process.env.DAR_MANAGER_AND_METADATA_MANAGER_EMAIL,
            API_URL: process.env.NEXT_PUBLIC_API_V1_URL,
            TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
        },
        async setupNodeEvents(on, config) {
            return config;
        },
        // video: true,
        // videosFolder: "cypress/videos",
    },
});
