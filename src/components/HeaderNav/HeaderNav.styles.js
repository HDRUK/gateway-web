import { css } from "@emotion/react";

export const signInBtn = css({
    color: "#3C3C3B",
    padding: "10px 16px",
    width: "75px",
    height: "40px",
    border: "2px solid #3db28c",
    borderRadius: "4px",
    fontWeight: "400",
    fontSize: "14px",
    textTransform: "none",
    lineHeight: "17px",
    whiteSpace: "nowrap",
    backgroundColor: "transparent",
    "&:hover": {
        backgroundColor: "#3DB28C",
        color: "#fff",
    },
});

export const navBox = css({
    flexGrow: 1,
    justifyContent: "flex-start",
    display: "flex",
    alignItems: "center",
    "@media (max-width: 420px)": {
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
