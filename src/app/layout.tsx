import * as React from "react";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import SWRProvider from "@/providers/SWRProvider";
import DialogProvider from "@/providers/DialogProvider";
import SnackbarProvider from "@/providers/SnackbarProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Health Data Research Innovation Gateway",
    description:
        "The Health Data Research Innovation Gateway is a portal enabling researchers and innovators in academia, industry and the NHS to search for and request access to UK health research data.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <SWRProvider>
                    <ThemeRegistry>
                        <DialogProvider>
                            <SnackbarProvider />
                            <div
                                style={{
                                    width: "100%",
                                    fontFamily: "arial",
                                }}>
                                <Header />
                                <main>{children}</main>
                                <Footer />
                            </div>
                        </DialogProvider>
                    </ThemeRegistry>
                </SWRProvider>
            </body>
        </html>
    );
}
