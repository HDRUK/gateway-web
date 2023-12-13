import * as React from "react";
import MuiDialogContent from "@mui/material/DialogContent";

import Link from "@/components/Link";
import Dialog from "@/components/Dialog";
import BulletList from "@/components/BulletList";
import { CUSTOMER_PORTAL_SUPPORT_URL } from "@/config/hrefs";
import ProviderLinks from "../ProviderLinks";
import { useTranslations } from "next-intl";

const ProvidersDialog = () => {
    const t = useTranslations("modules");

    return (
        <Dialog
            titleSx={{ paddingLeft: 8 }}
            title={t("dialogs.ProvidersDialog.title")}>
            <MuiDialogContent sx={{ paddingX: 8 }}>
                <p>
                    Anyone can search and view datasets, collections and other
                    resources with or without an account. Creating an account
                    allows you to:
                </p>

                <BulletList
                    items={[
                        {
                            label: "Submit data access enquiries and applications",
                        },
                        {
                            label: "Add your collections and other resources",
                        },
                        {
                            label: "Use the Cohort Discovery advanced search tool",
                        },
                    ]}
                />
                <p>
                    You can sign in or create a Gateway account with any of the
                    organisations below, simply click your preferred
                    organisation and follow the on-screen instructions:
                </p>
                <ProviderLinks />
                <Link href={CUSTOMER_PORTAL_SUPPORT_URL}>
                    Suggest another identity provider
                </Link>
            </MuiDialogContent>
        </Dialog>
    );
};

export default ProvidersDialog;
