// eslint.config.mjs
import next from "eslint-config-next";
import globals from "globals";

import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import storybook from "eslint-plugin-storybook";

const config = [
    // Next.js base config (includes core-web-vitals etc.)
    ...next,

    // Storybook flat recommended rules
    ...storybook.configs["flat/recommended"],

    // Global ignores (replacement for .eslintignore)
    {
        ignores: [
            "**/.next/**",
            "**/node_modules/**",
            "**/coverage/**",
            "mocks/**",
            "datasetsPageTester.ts",
            "datasetsSchemaTester.ts",
        ],
    },

    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },
        },

        settings: {
            react: {
                version: "detect",
            },
            "import/resolver": {
                node: {
                    extensions: [".ts", ".tsx"],
                },
            },
        },

        // IMPORTANT: only plugins that Next/storybook DON'T already define
        plugins: {
            "@typescript-eslint": tseslint,
            import: importPlugin,
        },

        rules: {
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": ["off"],
            "@typescript-eslint/no-non-null-assertion": "off",

            "react/no-unknown-property": ["error", { ignore: ["css"] }],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
            "@typescript-eslint/no-explicit-any": "error",
            "react/react-in-jsx-scope": "off",

            "react/jsx-filename-extension": [
                1,
                {
                    extensions: [".ts", ".tsx", ".js", ".jsx"],
                },
            ],

            "react/jsx-props-no-spreading": "off",

            "import/extensions": [
                "error",
                "ignorePackages",
                {
                    js: "never",
                    jsx: "never",
                    ts: "never",
                    tsx: "never",
                },
            ],

            "jsx-a11y/anchor-is-valid": [
                "error",
                {
                    components: ["Link"],
                    specialLink: ["hrefLeft", "hrefRight"],
                    aspects: ["invalidHref", "preferButton"],
                },
            ],

            camelcase: "off",
            "react/require-default-props": "off",
            "no-nested-ternary": "off",
            "import/prefer-default-export": "off",

            "react/function-component-definition": [
                2,
                {
                    namedComponents: ["arrow-function", "function-declaration"],
                    unnamedComponents: "arrow-function",
                },
            ],

            "no-console": "off",
            "no-return-await": "off",

            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            "no-undef": "off",

            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: [
                        "**/*.test.ts",
                        "**/*.test.tsx",
                        "jest.config.js",
                        "jest.setup.js",
                        "**/testUtils.tsx",
                    ],
                },
            ],

            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/preserve-manual-memoization": "warn",
            "react/display-name": "warn",
        },
    },
];

export default config;
