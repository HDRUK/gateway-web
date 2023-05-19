import type { StorybookConfig } from "@storybook/nextjs";
const path = require("path");

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/nextjs",
        options: {},
    },
    features: {},
    docs: {
        autodocs: "tag",
    },
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
                "@/services": path.resolve(__dirname, "../src/services"),
                "@/config": path.resolve(__dirname, "../src/config"),
                "@/pages": path.resolve(__dirname, "../src/pages"),
                "@/utils": path.resolve(__dirname, "../src/utils"),
            };
        }

        return config;
    },
};
export default config;
