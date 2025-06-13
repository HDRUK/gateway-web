import { css } from "@emotion/react";
import { colors } from "@/config/colors";

export const tabsStyle = {
    searchTabList: css({
        boxShadow: "none",
    }),

    normal: () =>
        css({
            "&.MuiTab-root": {
                "&.Mui-selected": {
                    borderBottom: `3px solid ${colors.green400}`,
                    boxShadow: "inherit",
                },

                "&:focus, &:hover": {
                    background: colors.green100,
                    borderBottom: `3px solid ${colors.green400}`,
                },

                "&t:active:not(.Mui-selected)": {
                    borderBottom: `3px solid ${colors.green400}`,
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
                    background: colors.grey100,
                    boxShadow: `inset 0 -1px 0 0px ${colors.green400}`,
                },

                "&.Mui-selected": {
                    boxShadow: `inset 0 -3px 0 0px ${colors.green400}`,
                    fontWeight: 600,
                },
            },
        }),
};
