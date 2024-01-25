import * as React from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NavigationEvents from "@/components/NavigationEvents";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
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
    children: React.ReactNode;
}) {
    const HOTJAR_ENV = "NEXT_PUBLIC_HOTJAR_ID";
    const PUBLIC_ENV = "NEXT_PUBLIC_API_V1_URL";
    const HOTJAR_ID = process.env[HOTJAR_ENV];
    // const HOTJAR_VERSION = 6;

    console.log(
        `LAYOUT - DEBUG ENV TEST - HOTJAR_ID=${HOTJAR_ID} - NEXT_PUBLIC_API_V1_URL=${process.env[PUBLIC_ENV]}`
    );

    if (!locales.includes(locale)) notFound();

    const messages = useMessages();

    return (
        <html lang={locale}>
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
                                            fontFamily: "arial",
                                        }}>
                                        <Header />
                                        <main>{children}</main>
                                        <React.Suspense fallback={null}>
                                            <NavigationEvents />
                                        </React.Suspense>
                                        <Footer />
                                    </div>
                                </ActionBarProvider>
                            </DialogProvider>
                        </ThemeRegistry>
                    </SWRProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
