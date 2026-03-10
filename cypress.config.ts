import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env" });

export default defineConfig({
    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL,
        defaultCommandTimeout: 10000,
        requestTimeout: 15000,
        responseTimeout: 20000,
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
            API_URL: process.env.APP_URL,
            TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
        },
        
        setupNodeEvents(on, config) {
        //    on("task", {
        //     networkLog(message) {
        //         fs.appendFileSync(path.join("cypress", "network.log"), message + "\n");
        //         return null;
        //     }
        //     });
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
        // video: true,
        // videosFolder: "cypress/videos",
    },
});
