import { css } from "@emotion/react";
import { tokens } from "@hdruk/ui/theme";

export const tabsStyle = {
    searchTabList: css({
        boxShadow: "none",
    }),

    normal: () =>
        css({
            "&.MuiTab-root": {
                borderBottom: "3px solid transparent",

                "&.Mui-selected": {
                    borderBottom: `3px solid ${tokens.brand.secondary}`,
                    boxShadow: "inherit",
                },

                "&:focus, &:hover": {
                    background: tokens.brand.accentSecondary,
                    borderBottom: `3px solid ${tokens.brand.secondary}`,
                },

                "&t:active:not(.Mui-selected)": {
                    borderBottom: `3px solid ${tokens.brand.secondary}`,
                },
            },
        }),

    search: () =>
        css({
            "&.MuiTab-root": {
                fontSize: 20,
                fontWeight: 400,
                py: "5px",

                "&:focus, &:hover": {
                    background: tokens.background.primary,
                    boxShadow: `inset 0 -1px 0 0px ${tokens.brand.secondary}`,
                },

                "&.Mui-selected": {
                    boxShadow: `inset 0 -3px 0 0px ${tokens.brand.secondary}`,
                    fontWeight: 600,
                },
            },
        }),
};
