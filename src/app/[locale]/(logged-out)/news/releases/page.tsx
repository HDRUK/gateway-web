import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { getReleaseNotes } from "@/utils/cms";
import ReleaseTabs from "./components/ReleaseTabs";
import metaData from "@/utils/metdata";

export const metadata = metaData({
    title: "Releases - About",
    description: "",
});
const ReleasesPage = async () => {
    const allReleases = await getReleaseNotes();

    return (
        <>
            <Banner title="Gateway Releases" />
            <Container sx={{ background: "white", padding: 0 }}>
                <ReleaseTabs allReleases={allReleases} />
            </Container>
        </>
    );
};

export default ReleasesPage;
