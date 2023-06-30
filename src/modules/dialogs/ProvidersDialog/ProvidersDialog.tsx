import * as React from "react";
import MuiDialogContent from "@mui/material/DialogContent";
import apis from "@/config/apis";

import Link from "@/components/Link";
import { useTranslation } from "react-i18next";
import Dialog from "@/components/Dialog";
import Button from "@/components/Button";
import useDialog from "@/hooks/useDialog";
import SignInDialog from "@/modules/dialogs/SignInDialog";

interface LinkItem {
    label: string;
    href: string;
}

const ProvidersDialog = () => {
    const { showDialog } = useDialog();
    const { t } = useTranslation("modules");

    const providerLinks: LinkItem[] = [
        {
            label: t("dialogs.ProvidersDialog.socialProviders.azure"),
            href: apis.authAzureV1Url,
        },
        {
            label: t("dialogs.ProvidersDialog.socialProviders.linkedIn"),
            href: apis.authLinkedinV1Url,
        },
        {
            label: t("dialogs.ProvidersDialog.socialProviders.google"),
            href: apis.authGoogleV1Url,
        },
    ];

    return (
        <Dialog title={t("dialogs.ProvidersDialog.title")}>
            <MuiDialogContent>
                <p>
                    Anyone can search and view datasets, collections and other
                    resources with or without an account. Creating an account
                    allows you to:
                </p>

                <ul>
                    <li>Submit data access enquiries and applications</li>
                    <li>
                        Add your own collections, papers and other resources
                    </li>
                    <li>Use the Cohort Discovery advanced search tool</li>
                </ul>
                <p>
                    You can sign in or create a Gateway account with any of the
                    organisations below, simply click your preferred
                    organisation and follow the on-screen instructions:
                </p>
                <ul
                    style={{
                        listStyle: "none",
                        marginLeft: 0,
                    }}>
                    {providerLinks.map(link => (
                        <li key={link.href}>
                            <Link href={link.href}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
                <Button onClick={() => showDialog(SignInDialog)}>
                    {t("dialogs.ProvidersDialog.signIn")}
                </Button>
            </MuiDialogContent>
        </Dialog>
    );
};

export default ProvidersDialog;
