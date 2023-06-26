import { css } from "@emotion/react";

export const root = (hasComponent: boolean) =>
    css({
        display: "flex",
        background: "white",
        padding: 20,
        boxShadow: "1px -1px 3px rgba(0,0,0,.09)",
        marginTop: "5px",
        flexDirection: "column",
        alignItems: "end",
        gap: "10px",
        "@media (min-width: 640px)": {
            alignItems: "center",
            justifyContent: hasComponent ? "space-between" : "end",
            flexDirection: "row",
        },
    });
