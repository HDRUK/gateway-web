import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getCookieNotice } from "@/utils/cms";
import metaData from "@/utils/metadata";
import "@/styles/wpStyles.css";
import CookieToggle from "./components/CookieToggle";

export const metadata = metaData({
    title: "Cookie Notice",
    description: "",
});
const PrivacyPolicyPage = async () => {
    const cmsPage = await getCookieNotice();

    if (!cmsPage) {
        notFound();
    }

    return (
        <>
            <Banner title={cmsPage?.title} />
            <Container sx={{ padding: 10 }} className="wpStyles">
                {cmsPage?.content && <HTMLContent content={cmsPage?.content} />}
                <CookieToggle />
            </Container>
        </>
    );
};

export default PrivacyPolicyPage;
