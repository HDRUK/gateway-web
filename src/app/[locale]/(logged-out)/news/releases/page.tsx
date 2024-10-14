import { redirect, RedirectType } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { getReleaseNotes } from "@/utils/cms";
import ReleaseTabs from "./components/ReleaseTabs";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Releases",
    description: "",
};

const ReleasesPage = async () => {
    const allReleases = await getReleaseNotes();

    return (
        <>
            <Banner
                title="Gateway Releases"
                src="/images/banners/release-notes.png"
            />
            <Container sx={{ background: "white", padding: 0 }}>
                <ReleaseTabs allReleases={allReleases} />
            </Container>
        </>
    );
};

export default ReleasesPage;
