module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true,
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
    plugins: [
        "react",
        "react-hooks",
        "@typescript-eslint",
        "prettier",
        "import",
        "jsx-a11y",
    ],
    extends: [
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "airbnb",
        "prettier",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
        "plugin:security/recommended",
        "plugin:react-hooks/recommended",
        "plugin:storybook/recommended",
    ],
    rules: {
        "security/detect-object-injection": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "react/no-unknown-property": ["error", { ignore: ["css"] }],
        "@typescript-eslint/no-unused-vars": "error",
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
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
            },
            {
                usePrettierrc: true,
            },
        ],
        "no-undef": "off",
        "import/no-extraneous-dependencies": [
            "error",
            {
                devDependencies: [
                    "**/*{.,_}{test}.{ts,tsx}",
                    "**/jest.config.ts",
                    "**/jest.setup.ts",
                    "**/src/utils/testUtils.tsx",
                ],
                optionalDependencies: false,
            },
        ],
    },
};
