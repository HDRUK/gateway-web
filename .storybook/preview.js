import { withMuiTheme } from "./withMuiTheme.decorator";
import { withDialog } from "./withDialog.decorator";
import { withActionBar } from "./withActionBar.decorator";

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

export const decorators = [withMuiTheme, withDialog, withActionBar];
