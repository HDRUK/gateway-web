import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { getTermsAndConditions } from "@/utils/cms";
import BannerImage from "../../../../public/images/banners/release-notes.png";
import CmsPageContent from "./components/CmsPageContent";

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
                <CmsPageContent cmsPage={cmsPage} />
            </Container>
        </>
    );
};

export default TermsAndConditionsPage;
