import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import config from "@/config";

import Link from "@/components/Link";
import { useTranslation } from "react-i18next";
import useDialog from "@/hooks/useDialog";
import Box from "@/components/Box";

interface LinkItem {
    label: string;
    href: string;
}

const SignInDialog = () => {
    const { hideDialog } = useDialog();
    const { t } = useTranslation("components");

    const providerLinks: LinkItem[] = [
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

    return (
        <Dialog maxWidth="tablet" onClose={hideDialog} open>
            <Box>
                <DialogTitle>Sign in or create a new account</DialogTitle>

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
                            <Link href={link.href} label={link.label} />
                        </li>
                    ))}
                </ul>
            </Box>
        </Dialog>
    );
};

export default SignInDialog;
