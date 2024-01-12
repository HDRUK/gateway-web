import { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div style={{ width: "100%", fontFamily: "arial" }}>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
