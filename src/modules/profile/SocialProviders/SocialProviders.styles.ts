import { css } from "@emotion/react";

export const dot = theme =>
    css({
        position: "absolute",
        width: "8px",
        height: "8px",
        right: "12px",
        top: "13px",
        borderRadius: "4px",
        backgroundColor: theme.palette.colors.orange,
    });
