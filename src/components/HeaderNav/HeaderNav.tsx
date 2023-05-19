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
                    showModal({ onSuccess: () => console.log("success") })
                }>
                Another modal
            </Button>
        </>
    );
}

export default HeaderNav;
