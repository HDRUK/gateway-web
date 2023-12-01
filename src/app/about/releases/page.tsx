import Container from "@/components/Container";
import { getReleaseNotes } from "@/utils/cms";
import ReleaseTabs from "@/modules/ReleaseTabs";
import Banner from "@/components/Banner";
import BannerImage from "../../../../public/images/banners/release-notes.png";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Releases",
    description: "",
};

const ReleasesPage = async () => {
    const allReleases = await getReleaseNotes();

    return (
        <>
            <Banner title="Gateway Releases" src={BannerImage} />
            <Container sx={{ background: "white", padding: 0 }}>
                <ReleaseTabs allReleases={allReleases} />
            </Container>
        </>
    );
};

export default ReleasesPage;
