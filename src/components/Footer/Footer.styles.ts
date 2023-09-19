import { css } from "@emotion/react";

export const footer = css({
    fontSize: "14px",
    backgroundColor: "#29235c",
});

export const footerContainer = css({
    color: "white",
    padding: "50px 20px",
});

export const list = css({
    listStyle: "none",
    textDecoration: "none",
    gap: "20px",
    paddingLeft: 0,
    "@media (min-width: 420px)": {
        display: "flex",
    },
});

export const social = css({
    display: "flex",
    alignItems: "center",
    gap: "6px",
});

export const link = css({
    textDecoration: "none",
    color: "white",
    "&:hover": {
        textDecoration: "underline",
    },
});

export const copyright = css({
    color: "#bdbada",
});
