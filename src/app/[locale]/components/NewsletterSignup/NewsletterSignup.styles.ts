import { styled } from "@mui/material";

export const StyledNewsletterSignup = styled("div")(({ theme }) => ({
    p: 0,
    color: "#fff",
    backgroundColor: "#fff",
    zIndex: 1,
    display: "flex",
    position: "relative",
    [theme.breakpoints.up(810)]: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "530px",
    },
}));

export const StyledNewsletterSignupBackground = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    position: "absolute",
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    [theme.breakpoints.up(810)]: {
        top: "-190px",
        left: "-110px",
        right: "-110px",
        transform: "rotate(170deg) translateX(-100%)",
        transformOrigin: "bottom left",
        height: "400px",
    },
    [theme.breakpoints.up(1920)]: {
        height: "455px",
        top: "-200px",
    },
}));

export const StyledNewsletterSignupCta = styled("div")(({ theme }) => ({
    padding: theme.spacing(4),
    position: "relative",
    [theme.breakpoints.up(810)]: {
        padding: 0,
    },
    [theme.breakpoints.between(810, 1280)]: {
        marginTop: "6%",
    },
    [theme.breakpoints.between(1280, 1440)]: {
        marginTop: "4%",
    },
    [theme.breakpoints.between(1440, 1920)]: {
        marginTop: "0",
    },
    [theme.breakpoints.up(1920)]: {
        marginTop: "2%",
    },
    [theme.breakpoints.up(2560)]: {
        marginTop: "-2%",
    },
}));
