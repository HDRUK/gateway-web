import { withMuiTheme } from "./withMuiTheme.decorator";

const preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        options: {
            storySort: {
                method: "alphabetical",
                order: ["*", "Playground", "*"],
            },
        },
    },
};

export default preview;

export const decorators = [withMuiTheme];
