import { css } from "@emotion/react";
import { colors } from "@/config/theme";

export const tabsStyle = {
    tabList: css({
        boxShadow: "none",

        ".MuiTabs-indicator": {
            display: "none",
        },
    }),
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
            },
        }),
};
