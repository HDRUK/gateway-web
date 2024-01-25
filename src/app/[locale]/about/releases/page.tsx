import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { getReleaseNotes } from "@/utils/cms";
import BannerImage from "../../../../../public/images/banners/release-notes.png";
import ReleaseTabs from "./components/ReleaseTabs";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Releases",
    description: "",
};

const ReleasesPage = async () => {
    const allReleases = await getReleaseNotes();

    return (
        <>
            <Banner title="Gateway Releases test" src={BannerImage} />
            <Container sx={{ background: "white", padding: 0 }}>
                <h1>DEBUG TITLE</h1>
                <ReleaseTabs allReleases={allReleases} />
            </Container>
        </>
    );
};

export default ReleasesPage;
