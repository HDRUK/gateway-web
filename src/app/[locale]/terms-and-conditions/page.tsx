import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getTermsAndConditions } from "@/utils/cms";
import BannerImage from "../../../../public/images/banners/release-notes.png";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Terms and Conditions",
    description: "",
};

const TermsAndConditionsPage = async () => {
    const cmsPage = await getTermsAndConditions();

    return (
        <>
            <Banner title={cmsPage.title} src={BannerImage} />
            <Container sx={{ padding: 10 }}>
                <HTMLContent content={cmsPage?.content} />
            </Container>
        </>
    );
};

export default TermsAndConditionsPage;
