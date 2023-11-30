import * as React from "react";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

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
                <ThemeRegistry>{children}</ThemeRegistry>
            </body>
        </html>
    );
}
