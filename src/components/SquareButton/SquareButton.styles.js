import { css } from "@emotion/react";

export const squareButton = theme =>
    css({
        height: "300px",
        width: "300px",
        boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.0917013)",
        display: "flex",
        flexDirection: "column",
        fontSize: "28px",
        lineHeight: "34px",
        fontWeight: "400px",
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            fill: "#fff",
        },
    });
