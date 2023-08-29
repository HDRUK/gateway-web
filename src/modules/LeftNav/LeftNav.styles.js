import { colors } from "@/config/theme";
import { css } from "@emotion/react";

export const navBox = css({
    flexGrow: 1,
    minWidth: "300px",
    display: "grid",
    gridTemplateRows: "repeat(5, 1fr)",
    alignItems: "flex-start",
});

export const navItem = css({
    color: colors.grey700,
    padding: "14px 0",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    "&:hover > svg:last-child": {
        transform: "rotate(90deg)",
    },
});

export const navLink = css({
    color: colors.grey700,
    marginLeft: "20px",
    textDecoration: "none",
    fontSize: "14px",
    alignItems: "middle",
    textAlign: "left",
    flex: 1,
});

export const expandIcon = css({
    display: "flex",
    justifyContent: "flex-end",
});
