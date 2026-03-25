// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from "@storybook/nextjs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const path = require("path");

const config: StorybookConfig = {
    staticDirs: ["../public"],
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-docs",
        "@storybook/addon-themes",
        "@storybook/nextjs",
    ],

    babel: async () => {
        return {
            presets: [
                ["next/babel", { "preset-react": { runtime: "automatic" } }],
            ],
        };
    },

    framework: {
        name: "@storybook/nextjs",
        options: {},
    },

    features: {},

    typescript: {
        check: false,
        checkOptions: {},
        reactDocgen: "react-docgen-typescript",
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true, // makes union prop types like variant and size appear as select controls
            shouldRemoveUndefinedFromOptional: true, // makes string and boolean types that can be undefined appear as inputs and switches
            propFilter: prop =>
                prop.parent
                    ? !/node_modules\/(?!@mui)/.test(prop.parent.fileName)
                    : true,
        },
    },

    core: {
        disableTelemetry: true,
    },

    webpackFinal: async config => {
        if (config.resolve) {
            config.resolve.modules = [
                path.resolve(__dirname, ".."),
                "node_modules",
            ];

            config.resolve.alias = {
                ...config.resolve.alias,
                "@/hooks": path.resolve(__dirname, "../src/hooks"),
                "@/components": path.resolve(__dirname, "../src/components"),
                "@/modules": path.resolve(__dirname, "../src/modules"),
                "@/providers": path.resolve(__dirname, "../src/providers"),
                "@/mocks": path.resolve(__dirname, "../mocks"),
                "@/services": path.resolve(__dirname, "../src/services"),
                "@/config": path.resolve(__dirname, "../src/config"),
                "@/pages": path.resolve(__dirname, "../src/pages"),
                "@/utils": path.resolve(__dirname, "../src/utils"),
                "@/consts": path.resolve(__dirname, "../src/consts"),
                fs: path.resolve(__dirname, "fsMock.js"),
                "next/font/google": path.resolve(__dirname, "nextFontMock.ts"),
            };
        }
        return config;
    },
};
export default config;
