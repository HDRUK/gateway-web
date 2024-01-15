import { css } from "@emotion/react";
import { colors } from "@/config/theme";

export const navBox = css({
    flexGrow: 1,
    justifyContent: "flex-start",
    display: "flex",
    alignItems: "center",
    "@media (max-width: 1023px)": {
        display: "none",
    },
});

export const navBoxMobile = css({
    flexDirection: "column",
    marginTop: "75px",
    position: "absolute",
    background: "#fff",
});

export const navLinkWrapper = css({
    "@media (max-width: 1023px)": {
        display: "flex",
        flexDirection: "column",
    },
});

export const navItem = css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.grey700,
    marginRight: "25px",
    cursor: "pointer",
    fontSize: "14px",
    ":hover": {
        background: "transparent",
    },
    "@media (max-width: 1023px)": {
        justifyContent: "space-between",
        width: "100%",
    },
});

export const navLink = css({
    color: colors.grey700,
    marginRight: "25px",
    textDecoration: "none",
    fontSize: "14px",
    padding: "6px 8px",
});
