import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:3000",
        env: {
            DEV_EMAIL: process.env.DEV_EMAIL,
            DEV_PASSWORD: process.env.DEV_PASSWORD,

            CUST_ADMIN_1_EMAIL: process.env.CUST_ADMIN_1_EMAIL,
            CUST_ADMIN_1_PASSWORD: process.env.CUST_ADMIN_1_PASSWORD,

            CUST_ADMIN_2_EMAIL: process.env.CUST_ADMIN_2_EMAIL,
            CUST_ADMIN_2_PASSWORD: process.env.CUST_ADMIN_2_PASSWORD,

            DEV_1_EMAIL: process.env.DEV_1_EMAIL,
            DEV_1_PASSWORD: process.env.DEV_1_PASSWORD,

            CUST_ADMIN_3_EMAIL: process.env.CUST_ADMIN_3_EMAIL,
            CUST_ADMIN_3_PASSWORD: process.env.CUST_ADMIN_3_PASSWORD,

            DEV_2_EMAIL: process.env.DEV_2_EMAIL,
            DEV_2_PASSWORD: process.env.DEV_2_PASSWORD,

            DATA_ACCESS_MANAGER_EMAIL: process.env.DATA_ACCESS_MANAGER_EMAIL,
            DATA_ACCESS_MANAGER_PASSWORD:
                process.env.DATA_ACCESS_MANAGER_PASSWORD,

            DATA_ACCESS_REVIEWER_EMAIL: process.env.DATA_ACCESS_REVIEWER_EMAIL,
            DATA_ACCESS_REVIEWER_PASSWORD:
                process.env.DATA_ACCESS_REVIEWER_PASSWORD,

            METADATA_MANAGER_EMAIL: process.env.METADATA_MANAGER_EMAIL,
            METADATA_MANAGER_PASSWORD: process.env.METADATA_MANAGER_PASSWORD,

            METADATA_EDITOR_EMAIL: process.env.METADATA_EDITOR_EMAIL,
            METADATA_EDITOR_PASSWORD: process.env.METADATA_EDITOR_PASSWORD,

            DAR_MANAGER_AND_METADATA_MANAGER_EMAIL:
                process.env.DAR_MANAGER_AND_METADATA_MANAGER_EMAIL,
            DAR_MANAGER_AND_METADATA_MANAGER_PASSWORD:
                process.env.DAR_MANAGER_AND_METADATA_MANAGER_PASSWORD,

            API_URL: process.env.NEXT_PUBLIC_API_V1_URL,
        },
        async setupNodeEvents(on, config) {
            return config;
        },
        // video: true,
        // videosFolder: "cypress/videos",
    },
});
