import { ReactNode, Suspense } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { HomepageBannerNode } from "@/interfaces/Homepage";
import CustomerSurvey from "@/components/CustomerSurvey";
import Experiments from "@/components/Experiments";
import Footer from "@/components/Footer";
import { HDRGlobals } from "@/components/HDRGlobals";
import Header from "@/components/Header";
import { LightBox } from "@/components/LightBox";
import NavigationEvents from "@/components/NavigationEvents";
import NavigationProgress from "@/components/NavigationProgress";
import SupportPopOut from "@/components/SupportPopOut";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import ProvidersDialog from "@/modules/ProvidersDialog";
import { SITE_NAME } from "@/consts/application";
import { getHomePageBanner } from "@/utils/cms";
import { getFeatures } from "@/utils/gatewayFlagAdapter";
import metaData from "@/utils/metadata";
import packageJson from "@/../package.json";
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
    title: SITE_NAME,
    isDefault: true,
});

export default async function RootLayout(props: {
    params: Promise<{ locale: string }>;
    children: ReactNode;
}) {
    const { children, params } = props;
    const { locale } = await params;

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

    const { version } = packageJson;

    // A single fetch of all flags, instead of one fetch per flag - the
    // individual `flag()` helpers in `@/flags` each hit this same endpoint
    // independently, which turned every page load into 10 duplicate
    // requests. `getFeatures` still fetches with `cache: "no-store"`, so a
    // flag flipped on the backend is picked up on the very next request.
    const rawFeatures = await getFeatures();

    const features = {
        isSDEConciergeServiceEnquiryEnabled:
            rawFeatures.SDEConciergeServiceEnquiry ?? false,
        isAliasesEnabled: rawFeatures.Aliases ?? false,
        isNhsSdeApplicationsEnabled:
            rawFeatures.NhsSdeApplicationsEnabled ?? false,
        isWidgetsEnabled: rawFeatures.Widgets ?? false,
        isCohortDiscoveryServiceEnabled:
            rawFeatures.CohortDiscoveryService ?? false,
        isRQuestEnabled: rawFeatures.RQuest ?? false,
        isCustodianDashboardEnabled: rawFeatures.V3_CustodianDashboard ?? false,
        isSchemaOnboardingFormEnabled:
            rawFeatures.SchemaOnboardingForm ?? false,
        isSchemaOnboardingFormSelectorEnabled:
            rawFeatures.SchemaOnboardingFormSelector ?? false,
        isExperimentsEnabled: rawFeatures.POC_FeedbackExperiments ?? false,
        isSafePeopleRegistrySSOEnabled:
            rawFeatures.SafePeopleRegistrySSOEnabled ?? false,
        isLoginDisabled: rawFeatures.LoginDisabled ?? false,
        // Per-provider sign-in switches default to *enabled* when the flag is
        // missing, unlike the release gates above: if the features fetch comes
        // back short, leaving a provider up is a far smaller failure than
        // locking everyone out of signing in.
        isLoginGoogleEnabled: rawFeatures.LoginGoogleEnabled ?? true,
        isLoginAzureEnabled: rawFeatures.LoginAzureEnabled ?? true,
        isLoginLinkedInEnabled: rawFeatures.LoginLinkedInEnabled ?? true,
        isLoginOpenAthensEnabled: rawFeatures.LoginOpenAthensEnabled ?? true,
        isLoginRegistryEnabled: rawFeatures.LoginRegistryEnabled ?? true,
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
                                        <Experiments />
                                        <Suspense fallback={null}>
                                            <NavigationEvents />
                                            <NavigationProgress />
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
                <HDRGlobals version={version} features={features} />
            </body>
        </html>
    );
}
