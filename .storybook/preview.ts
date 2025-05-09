import type { Preview } from "@storybook/react";
import { withActionBar } from "./withActionBar.decorator";
import { withDialog } from "./withDialog.decorator";
import { withIntl } from "./withIntl.decorator";
import { withMuiTheme } from "./withMuiTheme.decorator";

const preview: Preview = {
    globals: {
        locale: "en",
        locales: {
            en: "English",
        },
    },
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

export const decorators = [withIntl, withMuiTheme, withDialog, withActionBar];
