import { css } from "@emotion/react";
import { colors } from "@/config/theme";

export const tabsStyle = {
    tabList: css({
        boxShadow: "none",

        ".MuiTabs-indicator": {
            display: "none",
        },

        ".MuiTabs-root": {
            minHeight: "40px",
        },
    }),

    tab: () =>
        css({
            "&.MuiTab-root.Mui-selected": {
                borderBottom: `3px solid ${colors.green400}`,
                background: colors.green400,
                color: colors.white,
                boxShadow: "inherit",
            },

            "&.MuiTab-root": {
                flex: 1,
                borderRadius: "20px 20px 0px 0px",
                borderBottom: `3px solid transparent`,
                fontSize: "20px",
                marginTop: "2px",
                boxShadow: "1px -1px 3px 0px #2626261A",
                backgroundColor: colors.white,
                maxWidth: "250px",
                minHeight: "40px",
                padding: "6px",

                "&:focus,&:hover, &:active": {
                    background: colors.green100,
                    borderBottom: `3px solid ${colors.green400}`,
                },

                "&t:active:not(.Mui-selected)": {
                    borderBottom: `3px solid ${colors.green400}`,
                },
                "&:focus:not(.Mui-selected), &:hover:not(.Mui-selected), &.Mui-focusVisible:not(.Mui-selected)":
                    {
                        color: "inherit",
                    },
            },
        }),

    normal: () =>
        css({
            "&.MuiTab-root": {
                borderBottom: `3px solid transparent`,
                "&.Mui-selected": {
                    borderBottom: `3px solid ${colors.green400}`,
                    boxShadow: "inherit",
                },

                "&:focus, &:hover, &:active": {
                    background: colors.green100,
                    borderBottom: `3px solid ${colors.green400}`,
                },

                "&t:active:not(.Mui-selected)": {
                    borderBottom: `3px solid ${colors.green400}`,
                },
            },
        }),
};
