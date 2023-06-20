import { css } from "@emotion/react";

export const appbar = css({
    marginBottom: "10px",
    flexDirection: "row",
    padding: "12px 16px",
    boxShadow: "none",
    background: "white",
});

export const toolbar = css({
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    height: "70px",
    padding: "0",
});

export const homeLogo = css({
    marginRight: "40px",
    height: "50px",
});

export const menuIcon = css({
    marginRight: 2,
    "@media (min-width: 1023px)": {
        display: "none",
    },
});

export const logoIconBox = css({
    display: "flex",
    alignItems: "center",
});
