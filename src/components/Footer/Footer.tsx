"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import hdrukLogo from "../../../public/images/logos/hdruk-white.png";
import linkedInLogo from "../../../public/images/logos/linkedIn-white.png";
import twitterInLogo from "../../../public/images/logos/twitter-white.png";
import {
    FooterContainer,
    FooterWrapper,
    FooterCopyright,
    FooterList,
    FooterLink,
    FooterSocial,
} from "./Footer.styles";

const Footer = () => {
    const t = useTranslations("components");
    const copyright = String.fromCodePoint(0x00a9);
    const currentYear = new Date().getFullYear();

    const links = [
        {
            href: "https://www.hdruk.ac.uk/",
            label: "HDR UK",
        },
        {
            href: "",
            label: "About",
        },
        {
            href: "",
            label: "Contact us",
        },
        {
            href: "https://twitter.com/HDR_UK",
            label: (
                <FooterSocial>
                    <Image src={twitterInLogo} alt="Twitter logo" width="17" />
                    <span>Twitter</span>
                </FooterSocial>
            ),
        },
        {
            href: "https://www.linkedin.com/company/healthdataresearchuk/",
            label: (
                <FooterSocial>
                    <Image src={linkedInLogo} alt="LinkedIn logo" width="17" />
                    <span>LinkedIn</span>
                </FooterSocial>
            ),
        },
    ];

    return (
        <FooterWrapper>
            <FooterContainer>
                <Image src={hdrukLogo} alt="HDRUK logo" width="130" />
                <FooterList>
                    {links.map(link => (
                        <li key={`${link.label}-${link.href}`}>
                            <FooterLink href={link.href}>
                                {link.label}
                            </FooterLink>
                        </li>
                    ))}
                </FooterList>
                <FooterCopyright>
                    {copyright}
                    {t("Footer.text", { year: currentYear })}
                </FooterCopyright>
            </FooterContainer>
        </FooterWrapper>
    );
};

export default Footer;
