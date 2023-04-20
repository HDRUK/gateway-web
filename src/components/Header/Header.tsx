import config from "@/config";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import Loading from "../Loading";

interface LinkItem {
    label: string;
    href: string;
}

const loggedInLinks: LinkItem[] = [
    {
        label: "My Account",
        href: "/account",
    },
];

const loggedOutLinks: LinkItem[] = [
    {
        label: "Azure",
        href: config.authAzureV1Url,
    },
    {
        label: "LinkedIn",
        href: config.authLinkedinV1Url,
    },
    {
        label: "Google",
        href: config.authGoogleV1Url,
    },
];

function Header() {
    const { isLoggedIn, isLoading } = useUser();

    if (isLoading) return <Loading />;

    const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ul
                style={{
                    padding: "20px",
                    display: "inline-block",
                    listStyle: "none",
                }}>
                <li
                    style={{
                        display: "inline-block",
                        paddingLeft: "10px",
                    }}>
                    <Link href="/">Home</Link>
                </li>
            </ul>
            <ul
                style={{
                    padding: "20px",
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
                        <Link href={link.href}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Header;
