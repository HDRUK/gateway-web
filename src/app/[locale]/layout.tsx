import { ReactNode, Suspense } from "react";
import visuallyHidden from "@mui/utils/visuallyHidden";
import { GoogleTagManager } from "@next/third-parties/google";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import CustomerSurvey from "@/components/CustomerSurvey";
import Footer from "@/components/Footer";
import NavigationEvents from "@/components/NavigationEvents";
import SupportPopOut from "@/components/SupportPopOut";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import ProvidersDialog from "@/modules/ProvidersDialog";
import { sourceSans3 } from "@/config/fonts";
import metaData from "@/utils/metadata";
import ActionBarProvider from "@/providers/ActionBarProvider";
import DialogProvider from "@/providers/DialogProvider";
import SWRProvider from "@/providers/SWRProvider";
import SnackbarProvider from "@/providers/SnackbarProvider";
import CMSBanners from "./components/CMSBanners";
import PageTracker from "./components/PageTracker";
import Organization from "./components/RichResults/Organization";

export const metadata = metaData({
    title: "Health Data Research Gateway",
    isDefault: true,
    description:
        "The Health Data Research Gateway is a portal enabling researchers and innovators in academia, industry and the NHS to search for and request access to UK health research data.",
});

const locales = ["en"];

export default function RootLayout({
    children,
    params: { locale },
}: {
    params: { locale: string };
    children: ReactNode;
}) {
    if (!locales.includes(locale)) notFound();

    const messages = useMessages();
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

    return (
        <html lang={locale}>
            {gtmId && <GoogleTagManager gtmId={gtmId} />}
            <Organization />
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <SWRProvider>
                        <ThemeRegistry>
                            <DialogProvider>
                                <ActionBarProvider>
                                    <SnackbarProvider />
                                    <div
                                        style={{
                                            width: "100%",
                                            fontFamily:
                                                sourceSans3.style.fontFamily,
                                            display: "flex",
                                            flexDirection: "column",
                                            minHeight: "100vh",
                                        }}>
                                        <SupportPopOut />
                                        <CMSBanners />
                                        {children}
                                        <Footer />
                                        <CustomerSurvey />
                                        <Suspense fallback={null}>
                                            <NavigationEvents />
                                            <PageTracker />
                                        </Suspense>
                                    </ActionBarProvider>
                                    {/* ProvidersDialog has to remain in DOM */}
                                    <ProvidersDialog />

                                    <div
                                        role="note"
                                        // eslint-disable-next-line
                                        tabIndex={0}
                                        style={visuallyHidden}>
                                        end of page
                                    </div>
                                </DialogProvider>
                            </FeatureProvider>
                        </ThemeRegistry>
                    </SWRProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
