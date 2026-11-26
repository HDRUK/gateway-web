import { ReactNode } from "react";
import { Metadata } from "next";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return children;
};

const { NEXT_PUBLIC_GATEWAY_URL } = process.env;

export const metadata: Metadata = {
    ...(NEXT_PUBLIC_GATEWAY_URL && {
        metadataBase: new URL(NEXT_PUBLIC_GATEWAY_URL),
    }),
    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: dark)",
                url: "/images/logos/favicon-dark",
                href: "/images/logos/favicon-dark.png",
            },
            {
                media: "(prefers-color-scheme: light)",
                url: "/images/logos/favicon-light.png",
                href: "/images/logos/favicon-light.png",
            },
        ],
    },
};

export default Layout;
