import config from "@/config";
import Link from "@/components/Link";
import useUser from "@/hooks/useUser";
import { useTranslation } from "next-i18next";
import Loading from "../Loading";

interface LinkItem {
    label: string;
    href: string;
}

function HeaderNav() {
    const { t } = useTranslation("components");

    const { isLoggedIn, isLoading } = useUser();

    const loggedInLinks: LinkItem[] = [
        {
            label: t("HeaderNav.labels.myAccount"),
            href: "/account",
        },
    ];

    const loggedOutLinks: LinkItem[] = [
        {
            label: t("HeaderNav.labels.azure"),
            href: config.authAzureV1Url,
        },
        {
            label: t("HeaderNav.labels.linkedIn"),
            href: config.authLinkedinV1Url,
        },
        {
            label: t("HeaderNav.labels.google"),
            href: config.authGoogleV1Url,
        },
    ];

    if (isLoading) return <Loading />;

    const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

    return (
        <ul
            style={{
                display: "inline-block",
                listStyle: "none",
            }}>
            {links.map(link => (
                <li
                    key={link.href}
                    style={{
                        display: "inline-block",
                        paddingLeft: "10px",
                    }}>
                    <Link href={link.href} label={link.label} />
                </li>
            ))}
        </ul>
    );
}

export default HeaderNav;
