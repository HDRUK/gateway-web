import { css } from "@emotion/react";

export const navBox = css({
    flexGrow: 1,
    justifyContent: "flex-start",
    display: "flex",
    alignItems: "center",
    "@media (max-width: 1023px)": {
        display: "none",
    },
});

export const navItem = css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#53575A",
    marginRight: "25px",
    cursor: "pointer",
    fontSize: "14px",
});

export const navLink = css({
    color: "#53575A",
    marginRight: "25px",
    textDecoration: "none",
    fontSize: "14px",
});
