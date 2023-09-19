import { css } from "@emotion/react";

export const appbar = css({
    flexDirection: "row",
    padding: "12px 16px",
    background: "white",
    marginBottom: "5px",
    boxShadow: "1px 1px 3px 0 rgba(0,0,0,.09)",
});

export const toolbar = css({
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    height: "70px",
    padding: "0",
});

export const menuWrapper = css({
    display: "flex",
    flexDirection: "row",
    position: "relative",
    "@media (max-width: 1023px)": {
        flexDirection: "column",
    },
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
