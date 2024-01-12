import { css } from "@emotion/react";
import { colors } from "@/config/theme";

export const table = css({
    width: "100%",
    borderCollapse: "collapse",
});

export const th = css({
    padding: 10,
    borderBottom: `1px solid ${colors.grey300}`,
    borderRight: `1px solid ${colors.grey300}`,
    ":last-child": {
        borderRight: 0,
    },
});

export const td = css({
    padding: "5px 10px",
    borderBottom: `1px solid ${colors.grey300}`,
    borderRight: `1px solid ${colors.grey300}`,
    ":last-child": {
        borderRight: 0,
    },
});
