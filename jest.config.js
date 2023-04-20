const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "^@/mocks/(.*)$": "<rootDir>/mocks/$1",
        "^@/services": "<rootDir>/src/services",
        "^@/hooks": "<rootDir>/src/hooks",
        "^@/config": "<rootDir>/src/config",
        "^@/pages": "<rootDir>/src/pages",
        "^@/modules": "<rootDir>/src/modules",
        "^@/components": "<rootDir>/src/components",
        "^@/utils": "<rootDir>/src/utils",
    },
    testPathIgnorePatterns: [
        "<rootDir>/.next/",
        "<rootDir>/node_modules/",
        "<rootDir>/coverage",
        "<rootDir>/dist",
        "<rootDir>/__tests__/testUtils.tsx",
    ],
    coveragePathIgnorePatterns: [
        "<rootDir>/__tests__/testUtils.tsx",
        "<rootDir>/node_modules",
        "<rootDir>/mocks",
    ],
};

module.exports = createJestConfig(customJestConfig);
