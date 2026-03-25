import type { Preview } from "@storybook/nextjs";
import { withActionBar } from "./withActionBar.decorator";
import { withDialog } from "./withDialog.decorator";
import { withIntl } from "./withIntl.decorator";
import { withMuiTheme } from "./withMuiTheme.decorator";

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
            storySort: {
                method: "alphabetical",
                order: ["*", "Playground", "*"],
            },
        },
    },
    initialGlobals: {
        locale: "en",
        locales: {
            en: "English",
        },
    },
};

export default preview;

export const decorators = [withIntl, withMuiTheme, withDialog, withActionBar];
