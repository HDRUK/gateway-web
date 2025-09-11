import { ReactNode, Suspense } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { HomepageBannerNode } from "@/interfaces/Homepage";
import CustomerSurvey from "@/components/CustomerSurvey";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LightBox } from "@/components/LightBox";
import NavigationEvents from "@/components/NavigationEvents";
import SupportPopOut from "@/components/SupportPopOut";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import ProvidersDialog from "@/modules/ProvidersDialog";
import { getHomePageBanner, getNewCohortDiscovery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import {
    isAliasesEnabled,
    isSDEConciergeServiceEnquiryEnabled,
    isNhsSdeApplicationsEnabled,
} from "@/flags";
import ActionBarProvider from "@/providers/ActionBarProvider";
import CohortRedirectProvider from "@/providers/CohortRedirectProvider";
import DialogProvider from "@/providers/DialogProvider";
import { FeatureProvider } from "@/providers/FeatureProvider";
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

export default async function RootLayout({
    children,
    params: { locale },
}: {
    params: { locale: string };
    children: ReactNode;
}) {
    let messages;
    let homePageBanner: HomepageBannerNode[] = [];
    try {
        messages = (await import(`@/config/messages/${locale}.json`))
            .default as AbstractIntlMessages;
    } catch {
        notFound();
    }
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    const includeBanners = process.env.NEXT_PUBLIC_INCLUDE_BANNERS === "true";

    const features = {
        isSDEConciergeServiceEnquiryEnabled:
            (await isSDEConciergeServiceEnquiryEnabled()) as boolean,
        isAliasesEnabled: (await isAliasesEnabled()) as boolean,
        isNhsSdeApplicationsEnabled:
            (await isNhsSdeApplicationsEnabled()) as boolean,
    };

    if (includeBanners) {
        homePageBanner = (await getHomePageBanner()) as HomepageBannerNode[];
    }

    return (
        <html lang={locale}>
            {gtmId && <GoogleTagManager gtmId={gtmId} />}
            <Organization />
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <SWRProvider>
                        <ThemeRegistry>
                            <FeatureProvider feature={features}>
                                <DialogProvider>
                                    <ActionBarProvider>
                                        <SupportPopOut />
                                        <LightBox />
                                        {homePageBanner?.length > 0 &&
                                            includeBanners && (
                                                <CMSBanners
                                                    data={homePageBanner}
                                                />
                                            )}
                                        <SnackbarProvider />
                                        <CohortRedirectProvider />
                                        <Header />
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
                                </DialogProvider>
                            </FeatureProvider>
                        </ThemeRegistry>
                    </SWRProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
