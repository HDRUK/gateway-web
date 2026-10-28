"use client";

import { Footer as HdrukFooter } from "@hdruk/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import NextLink from "next/link";
import { RouteName } from "@/consts/routeName";
import hdrukLogo from "../../../public/images/logos/hdruk-white.png";

const TRANSLATIONS_NAMESPACE_FOOTER = "components.Footer";

const Footer = () => {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_FOOTER);
    const copyright = String.fromCodePoint(0x00a9);
    const currentYear = new Date().getFullYear();

    const linkGroups = [
        {
            items: [
                {
                    href: "https://www.hdruk.ac.uk/",
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
            ],
        },
        {
            items: [
                {
                    href: "/about/cookie-notice",
                    label: t("cookieNotice"),
                },
                {
                    href: `${process.env.NEXT_PUBLIC_API_BASE_URL}/documentation`,
                    label: t("apiDocs"),
                },
                {
                    href: "/about/accessibility-statement",
                    label: t("accessibilityStatement"),
                },
            ],
        },
    ];

    return (
        <HdrukFooter
            logoImage={<Image src={hdrukLogo} alt="HDRUK logo" width="130" />}
            linkGroups={linkGroups}
            linkComponent={NextLink}
            copyrightText={`${copyright}${t("copyright", {
                year: currentYear,
            })}`}
        />
    );
};

export default Footer;
