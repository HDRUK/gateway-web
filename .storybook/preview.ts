import type { Preview } from "@storybook/react";
import { theme } from "../src/config/Theme";
import { ThemeProvider } from "@emotion/react";

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        options: {
            storySort: (a, b) =>
                a.id === b.id
                    ? 0
                    : a.id.localeCompare(b.id, undefined, { numeric: true }),
        },
    },
};

export default preview;

export const decorators = [
    Story => (
        <ThemeProvider theme={theme}>
            <Story />
        </ThemeProvider>
    ),
];
