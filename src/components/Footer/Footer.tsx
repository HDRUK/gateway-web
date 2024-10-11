"use client";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import hdrukLogo from "../../../public/images/logos/hdruk-white.png";
import linkedInLogo from "../../../public/images/logos/linkedIn-white.png";
import twitterInLogo from "../../../public/images/logos/twitter-white.png";
import {
    FooterContainer,
    FooterCopyright,
    FooterLink,
    FooterLinks,
    FooterLinksContainer,
    FooterSocial,
    FooterSocialLinks,
    FooterWrapper,
} from "./Footer.styles";

const TRANSLATIONS_NAMESPACE_FOOTER = "components.Footer";

const Footer = () => {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_FOOTER);
    const copyright = String.fromCodePoint(0x00a9);
    const currentYear = new Date().getFullYear();

    const linksSocial = [
        {
            href: "https://x.com/HDR_UK",
            label: (
                <FooterSocial>
                    <Image src={twitterInLogo} alt="Twitter logo" width="17" />
                    <span>X</span>
                </FooterSocial>
            ),
        },
        {
            href: "https://www.linkedin.com/company/hdruk/mycompany/",
            label: (
                <FooterSocial>
                    <Image src={linkedInLogo} alt="LinkedIn logo" width="17" />
                    <span>LinkedIn</span>
                </FooterSocial>
            ),
        },
    ];

    const links1 = [
        {
            href: "https://www.hdruk.ac.uk/",
            label: t("visitHDRUKSite"),
        },
        {
            href: "https://www.healthdatagateway.org/about/terms-and-conditions",
            label: t("termsConditions"),
        },
        {
            href: "/about/privacy-policy",
            label: t("privacyPolicy"),
        },
    ];

    const links2 = [
        {
            href: "/about/cookie-notice",
            label: t("cookieNotice"),
        },
        {
            href: "https://api.www.healthdatagateway.org/api-docs/?_gl=1*1pz4jlx*_ga*MTcwOTYwOTYxMy4xNjc3MjgyNjU2*_ga_GJ2NS0NB4W*MTcxNzA2NTg0MC40NTYuMS4xNzE3MDY1ODUxLjQ5LjAuMA..",
            label: t("apiDocs"),
        },
    ];

    return (
        <FooterWrapper>
            <FooterContainer>
                <Box>
                    <Image src={hdrukLogo} alt="HDRUK logo" width="130" />
                    <FooterSocialLinks>
                        {linksSocial.map(link => (
                            <li key={`${link.label}-${link.href}`}>
                                <FooterLink href={link.href}>
                                    {link.label}
                                </FooterLink>
                            </li>
                        ))}
                    </FooterSocialLinks>
                    <FooterCopyright>
                        {copyright}
                        {t("copyright", { year: currentYear })}
                    </FooterCopyright>
                </Box>
                <FooterLinksContainer>
                    <li>
                        <FooterLinks>
                            {links1.map(link => (
                                <li key={`${link.label}-${link.href}`}>
                                    <FooterLink href={link.href}>
                                        {link.label}
                                    </FooterLink>
                                </li>
                            ))}
                        </FooterLinks>
                    </li>
                    <li>
                        <FooterLinks>
                            {links2.map(link => (
                                <li key={`${link.label}-${link.href}`}>
                                    <FooterLink href={link.href}>
                                        {link.label}
                                    </FooterLink>
                                </li>
                            ))}
                        </FooterLinks>
                    </li>
                </FooterLinksContainer>
            </FooterContainer>
        </FooterWrapper>
    );
};

export default Footer;
