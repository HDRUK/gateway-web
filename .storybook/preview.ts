import type { Preview } from "@storybook/react";

import i18n from "./i18next";
import { withMuiTheme } from "./withMuiTheme.decorator";
import { withDialog } from "./withDialog.decorator";
import { withActionBar } from "./withActionBar.decorator";

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
        parameters: {
            i18n,
        },
    },
};

export default preview;

export const decorators = [withMuiTheme, withDialog, withActionBar];
