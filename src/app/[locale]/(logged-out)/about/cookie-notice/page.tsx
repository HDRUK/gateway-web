import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getCookieNotice } from "@/utils/cms";
import metaData from "@/utils/metdata";
import "@/styles/wpStyles.css";

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
            </Container>
        </>
    );
};

export default PrivacyPolicyPage;
