import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div style={{ width: "100%", padding: "20px" }}>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
