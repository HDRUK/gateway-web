import styled from "@emotion/styled";
import Container from "@/components/Container";
import Link from "@/components/Link";

export const FooterWrapper = styled("div")({
    fontSize: "14px",
    backgroundColor: "#29235c",
});

export const FooterContainer = styled(Container)({
    color: "white",
    padding: "50px 20px",
});

export const FooterList = styled("ul")({
    listStyle: "none",
    textDecoration: "none",
    gap: "20px",
    paddingLeft: 0,
    "@media (min-width: 420px)": {
        display: "flex",
    },
});

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
