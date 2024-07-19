import { ReactNode, Suspense } from "react";
// import { GoogleTagManager } from "@next/third-parties/google";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import NavigationEvents from "@/components/NavigationEvents";
import SupportPopOut from "@/components/SupportPopOut";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { sourceSans3 } from "@/config/fonts";
import ActionBarProvider from "@/providers/ActionBarProvider";
import DialogProvider from "@/providers/DialogProvider";
import SWRProvider from "@/providers/SWRProvider";
import SnackbarProvider from "@/providers/SnackbarProvider";

export const metadata = {
    title: "Health Data Research Innovation Gateway",
    description:
        "The Health Data Research Innovation Gateway is a portal enabling researchers and innovators in academia, industry and the NHS to search for and request access to UK health research data.",
};

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
    // const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

    return (
        <html lang={locale}>
            {/* {gtmId && <GoogleTagManager gtmId={gtmId} />} */}
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
                                        {children}
                                        <Footer />
                                    </div>
                                    <Suspense fallback={null}>
                                        <NavigationEvents />
                                    </Suspense>
                                </ActionBarProvider>
                            </DialogProvider>
                        </ThemeRegistry>
                    </SWRProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
