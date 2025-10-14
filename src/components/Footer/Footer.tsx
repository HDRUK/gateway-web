"use client";

import { Box } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { RouteName } from "@/consts/routeName";
import linkedInLogo from "../../../public/images/logos/linkedIn-white.png";
import hdrukLogo from "../../../public/images/logos/logo.svg";
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
            href: "https://www.cancerresearchuk.org/",
            label: t("visitHDRUKSite"),
        },
        {
            href: RouteName.TERMS,
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
            href: `${process.env.NEXT_PUBLIC_API_BASE_URL}/documentation`,
            label: t("apiDocs"),
        },
    ];

    return (
        <FooterWrapper>
            <FooterContainer>
                <Box>
                    <Image src={hdrukLogo} alt="CRUK logo" width="130" />
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

            <div
                role="note"
                // eslint-disable-next-line
                tabIndex={0}
                style={visuallyHidden}>
                end of page
            </div>
        </FooterWrapper>
    );
};

export default Footer;
