import { Suspense, ReactNode } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import NavigationEvents from "@/components/NavigationEvents";
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
                                            fontFamily:
                                                sourceSans3.style.fontFamily,
                                        }}>
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
