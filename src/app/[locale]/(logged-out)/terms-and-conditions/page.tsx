import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getTermsAndConditions } from "@/utils/cms";
import metaData from "@/utils/metadata";
import "@/styles/wpStyles.css";

export const metadata = metaData({
    title: "Terms and Conditions",
    description: "",
});

const TermsAndConditionsPage = async () => {
    const cmsPage = await getTermsAndConditions();

    if (!cmsPage) {
        notFound();
    }

    return (
        <>
            <Banner
                title={cmsPage?.title}
                src="/images/banners/release-notes.png"
            />
            <Container sx={{ padding: 10 }} className="wpStyles">
                {cmsPage?.content && <HTMLContent content={cmsPage?.content} />}
            </Container>
        </>
    );
};

export default TermsAndConditionsPage;
