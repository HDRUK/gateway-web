import { css } from "@emotion/react";

export const appbar = css({
    marginBottom: "10px",
    flexDirection: "row",
    padding: "12px 16px",
});

export const toolbar = css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "0",
});

export const homeLogo = css({
    marginRight: "40px",
    "@media (max-width: 420px)": {
        display: "none",
    },
});

export const menuIcon = css({
    marginRight: 2,
    fill: "#475DA7",
    "@media (min-width: 420px)": {
        display: "none",
    },
});
