import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { getTermsAndConditions } from "@/utils/cms";
import BannerImage from "../../../../public/images/banners/release-notes.png";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Terms and Conditions",
    description: "",
};

const TermsAndConditionsPage = async () => {
    const termsAndConditionsContent = await getTermsAndConditions();

    return (
        <>
            <Banner title={termsAndConditionsContent.title} src={BannerImage} />
            <Container sx={{ padding: 10 }}>
                <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: termsAndConditionsContent.content,
                    }}
                />
            </Container>
        </>
    );
};

export default TermsAndConditionsPage;
