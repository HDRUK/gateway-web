import Link from "@/components/Link";
import useUser from "@/hooks/useUser";
import { useTranslation } from "next-i18next";
import useDialog from "@/hooks/useDialog";
import { Button } from "@mui/material";
import SignInDialog from "@/modules/dialogs/SignInDialog";
import Loading from "../Loading";

interface LinkItem {
    label: string;
    href: string;
}

function HeaderNav() {
    const { showDialog } = useDialog();

    const { t } = useTranslation("components");

    const { isLoggedIn, isLoading } = useUser();

    const loggedInLinks: LinkItem[] = [
        {
            label: t("HeaderNav.labels.myAccount"),
            href: "/account",
        },
    ];

    if (isLoading) return <Loading />;

    return (
        <>
            {isLoggedIn && (
                <ul
                    style={{
                        display: "inline-block",
                        listStyle: "none",
                    }}>
                    {loggedInLinks.map(link => (
                        <li
                            key={link.href}
                            style={{
                                display: "inline-block",
                                paddingLeft: "10px",
                            }}>
                            <Link href={link.href} label={link.label} />
                        </li>
                    ))}{" "}
                </ul>
            )}
            {!isLoggedIn && (
                <Button onClick={() => showDialog(SignInDialog)}>
                    {t("HeaderNav.labels.signIn")}
                </Button>
            )}
        </>
    );
}

export default HeaderNav;
