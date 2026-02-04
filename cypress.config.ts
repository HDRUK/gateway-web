import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL,
        defaultCommandTimeout: 10000,
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
            on("before:browser:launch", (browser, launchOptions) => {
                if (browser.family === "chromium") {
                    // running headless chrome in a virtualized environment forces pointer type to default to `NONE`
                    // to mimic "desktop" environment more correctly we force blink to have `pointer: fine` support
                    // this allows correct pickers behavior.
                    // This impact the used DateTimePicker in Material UI (MUI) between DesktopDateTimePicker and MobileDateTimePicker
                    launchOptions.args.push(
                        "--disable-touch-events",
                        "--blink-settings=primaryPointerType=4"
                    );
                }

                return launchOptions;
            });

            return config;
        },
        video: true,
        videosFolder: "cypress/videos",
    },
});
