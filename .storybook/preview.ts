import type { Preview } from "@storybook/react";

import { withMuiTheme } from "./withMuiTheme.decorator";
import { withDialog } from "./withDialog.decorator";
import { withActionBar } from "./withActionBar.decorator";
import { withIntl } from "./withIntl.decorator";

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
        parameters: {},
    },
};

export default preview;

export const decorators = [withIntl, withMuiTheme, withDialog, withActionBar];
