import { css } from "@emotion/react";

export const squareButton = (theme, color) =>
    css({
        height: "300px",
        width: "300px",
        boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.0917013)",
        display: "flex",
        flexDirection: "column",
        fontSize: "28px",
        lineHeight: "34px",
        fontWeight: "400px",
        borderRadius: "0",
        "&:hover": {
            // eslint-disable-next-line security/detect-object-injection
            backgroundColor: theme.palette[color].main,
            color: theme.palette.colors.white,
            fill: theme.palette.colors.white,
        },
    });
