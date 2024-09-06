import { styled } from "@mui/material";
import Container from "@/components/Container";
import Link from "@/components/Link";

export const FooterWrapper = styled("footer")(({ theme }) => ({
    fontSize: "14px",
    ul: {
        listStyleType: "none",
        paddingLeft: 0,
    },
    background: `linear-gradient(97deg, #46AF93 4.05%, ${theme.palette.primary.main} 100%)`,
}));

export const FooterContainer = styled(Container)(({ theme }) => ({
    color: "white",
    padding: "50px 20px",
    display: "flex",
    gap: "200px",
    [theme.breakpoints.down("tablet")]: {
        flexDirection: "column",
        gap: "16px",
    },
}));

export const FooterSocialLinks = styled("ul")(({ theme }) => ({
    textDecoration: "none",
    gap: "20px",
    paddingLeft: 0,
    display: "flex",
    [theme.breakpoints.down("tablet")]: {
        flexDirection: "column",
        gap: "16px",
    },
}));

export const FooterLinks = styled("ul")({
    display: "flex",
    flexDirection: "column",
    gap: "12px",
});

export const FooterLinksContainer = styled("ul")(({ theme }) => ({
    display: "flex",
    gap: "40px",
    [theme.breakpoints.down("tablet")]: {
        flexDirection: "column",
        gap: "16px",
    },
}));

export const FooterSocial = styled("span")({
    display: "flex",
    alignItems: "center",
    gap: "6px",
});

export const FooterLink = styled(Link)({
    textDecoration: "none",
    color: "white",
    "&:hover": {
        textDecoration: "underline",
    },
});

export const FooterCopyright = styled("div")({
    color: "#bdbada",
});
