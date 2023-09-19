/** @jsxImportSource @emotion/react */

import { useTranslation } from "next-i18next";
import Image from "next/image";

import Link from "@/components/Link";
import Container from "@/components/Container";

import hdrukLogo from "../../../public/images/logos/hdruk-white.png";
import linkedInLogo from "../../../public/images/logos/linkedIn-white.png";
import twitterInLogo from "../../../public/images/logos/twitter-white.png";

import * as styles from "./Footer.styles";

const Footer = () => {
    const { t } = useTranslation("components");
    const copyright = String.fromCodePoint(0x00a9);
    const currentYear = new Date().getFullYear();

    const links = [
        {
            href: "https://www.hdruk.ac.uk/",
            label: "HDR UK",
        },
        {
            href: "/about-us",
            label: "About",
        },
        {
            href: "/contact-us",
            label: "Contact us",
        },
        {
            href: "https://twitter.com/HDR_UK",
            label: (
                <span css={styles.social}>
                    <Image src={twitterInLogo} alt="Twitter logo" width="17" />
                    <span>Twitter</span>
                </span>
            ),
        },
        {
            href: "https://www.linkedin.com/company/healthdataresearchuk/",
            label: (
                <span css={styles.social}>
                    <Image src={linkedInLogo} alt="LinkedIn logo" width="17" />
                    <span>LinkedIn</span>
                </span>
            ),
        },
    ];

    return (
        <div css={styles.footer}>
            <Container css={styles.footerContainer}>
                <Image src={hdrukLogo} alt="HDRUK logo" width="130" />
                <ul css={styles.list}>
                    {links.map(link => (
                        <li key={link.href}>
                            <Link css={styles.link} href={link.href}>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div css={styles.copyright}>
                    {copyright}
                    {t("Footer.text", { year: currentYear })}
                </div>
            </Container>
        </div>
    );
};

export default Footer;
