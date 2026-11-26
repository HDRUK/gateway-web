import { styled } from "@mui/material";

export const List = styled("ul")(({ theme }) => ({
    listStyleType: "none",
    padding: 0,
    margin: theme.spacing(4, 0, 0),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(4),
}));

export const Item = styled("li")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),

    [theme.breakpoints.up("sm")]: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
}));

export const Logo = styled("img")(({ theme }) => ({
    width: theme.spacing(30),
    maxWidth: "100%",
    height: "auto",
    flexShrink: 0,
}));

export const Description = styled("div")(({ theme }) => ({
    ...theme.typography.body2,
    "& p:last-child": {
        marginBottom: 0,
    },
}));
