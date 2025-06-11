import { css } from "@emotion/react";
import { colors } from "@/config/theme";

export const tabsStyle = {
    // tabList: css({
    //     boxShadow: "none",

    //     ".MuiTabs-indicator": {
    //         display: "none",
    //     },

    //     ".MuiTabs-root": {
    //         minHeight: "40px",
    //     },
    // }),

    tab: () =>
        css({
            "&.MuiTab-root.Mui-selected": {
                background: colors.green400,
                color: colors.white,
                boxShadow: "inherit",
            },

            "&.MuiTab-root": {
                flex: 1,
                borderRadius: "20px 20px 0px 0px",
                fontSize: "20px",
                marginTop: "2px",
                boxShadow: "1px -1px 3px 0px #2626261A",
                backgroundColor: colors.white,
                maxWidth: "250px",
                minHeight: "40px",
                padding: "6px",

                "&:focus:not(.Mui-selected), &:hover:not(.Mui-selected), &.Mui-focusVisible:not(.Mui-selected)":
                    {
                        background: colors.green100,
                        color: "inherit",
                    },
            },
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
