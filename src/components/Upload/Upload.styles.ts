import { css } from "@emotion/react";

export const uploadLabel = ({ theme }) =>
    css({
        height: "40px",
        width: "110px",
        padding: "10px 16px 10px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        backgroundColor: theme.palette.grey[200],
        borderRadius: "4px",
        cursor: "pointer",
    });
