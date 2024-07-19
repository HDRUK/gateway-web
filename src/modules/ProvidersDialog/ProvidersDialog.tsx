import { useRef, useState } from "react";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Script from "next/script";
import BulletList from "@/components/BulletList";
import Dialog from "@/components/Dialog";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import useDialog from "@/hooks/useDialog";
import { CUSTOMER_PORTAL_SUPPORT_URL } from "@/config/hrefs";
import ProviderLinks from "../ProviderLinks";

const oaId = process.env.NEXT_PUBLIC_OA_APP_ID;
const ProvidersDialog = () => {
    const t = useTranslations("modules");
    const [institutionSelectVisible, setInstitutionSelectVisible] =
        useState<boolean>(false);

    const scriptIdRef = useRef(null);
    const scriptIdRefTets = useRef(null);

    const { hideProvidersDialog, test } = useDialog();

    return (
        <Dialog
            titleSx={{ paddingLeft: 8 }}
            title={t("dialogs.ProvidersDialog.title")}
            classes={{ root: test ? "hideme" : "" }}
            onClose={hideProvidersDialog}>
            <MuiDialogContent
                sx={{ paddingX: 8 }}
                ref={scriptIdRefTets.current}>
                {!institutionSelectVisible && (
                    <>
                        <p>
                            Anyone can search and view datasets, collections and
                            other resources with or without an account. Creating
                            an account allows you to:
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
                            You can sign in or create a Gateway account with any
                            of the organisations below, simply click your
                            preferred organisation and follow the on-screen
                            instructions:
                        </p>
                        <ProviderLinks
                            showInstituion={() =>
                                setInstitutionSelectVisible(true)
                            }
                        />

                        <Link href={CUSTOMER_PORTAL_SUPPORT_URL}>
                            Suggest another identity provider
                        </Link>
                    </>
                )}

                <div id="wayfinder" ref={scriptIdRef.current}>
                    <Loading />
                </div>

                {oaId && (
                    <Script
                        id="open-athens-wayfinder"
                        strategy="lazyOnload"
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,a,y,f){
           w._wayfinder=w._wayfinder||function(){(w._wayfinder.q=w._wayfinder.q||[]).push(arguments)};
           p={oaDomain:'hdruk.ac.uk',oaAppId: '${oaId}'};
           w._wayfinder.settings=p;h=a.getElementsByTagName('head')[0];
           s=a.createElement('script');s.async=1;s.referrerPolicy='origin';
           q=Object.keys(p).map(function(key){return key+'='+p[key]}).join('&');
           s.src=y+'v1'+f+"?"+q;h.appendChild(s);}
        )(window,document,'https://wayfinder.openathens.net/embed/','/loader.js');`,
                        }}
                    />
                )}
            </MuiDialogContent>
        </Dialog>
    );
};

export default ProvidersDialog;
