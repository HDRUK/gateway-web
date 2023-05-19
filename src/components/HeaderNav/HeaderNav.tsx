import Link from "@/components/Link";
import useUser from "@/hooks/useUser";
import { useTranslation } from "next-i18next";
import useDialog from "@/hooks/useDialog";
import { Button } from "@mui/material";
import SignInDialog from "@/modules/dialogs/SignInDialog";
import useModal from "@/hooks/useModal";
import Loading from "../Loading";

interface LinkItem {
    label: string;
    href: string;
}

function HeaderNav() {
    const { showDialog } = useDialog();
    const { showModal } = useModal();

    const { t } = useTranslation("components");

    const { isLoggedIn, isLoading } = useUser();

    const loggedInLinks: LinkItem[] = [
        {
            label: t("HeaderNav.labels.myAccount"),
            href: "/account",
        },
    ];

    const loggedOutLinks: LinkItem[] = [];

    if (isLoading) return <Loading />;

    const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

    return (
        <>
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
            <Button onClick={() => showDialog(SignInDialog)}>Sign in</Button>
            <Button
                onClick={() =>
                    showModal({
                        title: "This is a modal",
                        onCancel: () => console.log("cancel"),
                        onSuccess: () => console.log("success"),
                        content: (
                            <>
                                You can sign in or create a Gateway account with
                                any of the organisations below, simply click
                                your preferred
                            </>
                        ),
                    })
                }>
                Another modal
            </Button>
        </>
    );
}

export default HeaderNav;
