import { ReactNode } from "react";
import { Metadata } from "next";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return children;
};

export const metadata: Metadata = {
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
