import { Theme, css } from "@emotion/react";

export const badge = (theme: Theme) =>
    css({
        background: theme.palette.primary.main,
        borderRadius: "18px",
        height: "36px",
        width: "36px",
        color: "white",
        fontWeight: "bold",
        position: "relative",
    });

export const initials = css({
    lineHeight: "36px",
    textAlign: "center",
});
