const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "^@/mocks/(.*)$": "<rootDir>/mocks/$1",
        "^@/services/(.*)$": "<rootDir>/src/services/$1",
        "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
        "^@/config": "<rootDir>/src/config",
        "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
        "^@/modules/(.*)$": "<rootDir>/src/modules/$1",
        "^@/components/(.*)$": "<rootDir>/src/components/$1",
        "^@/providers/(.*)$": "<rootDir>/src/providers/$1",
        "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
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
        "<rootDir>/src/config",
    ],
};

module.exports = createJestConfig(customJestConfig);
