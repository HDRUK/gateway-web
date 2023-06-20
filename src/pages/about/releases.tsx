import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import Container from "@/components/Container";
import { getReleaseNotes } from "@/utils/cms";
import { ReleaseNode } from "@/interfaces/Releases";
import ReleaseTabs from "@/modules/ReleaseTabs";
import Banner from "@/components/Banner";
import BannerImage from "../../../public/images/banners/release-notes.png";

interface ReleasesProps {
    allReleases: ReleaseNode[];
}

const Releases = ({ allReleases }: ReleasesProps) => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - About - Releases" />
            <Banner title="Gateway Releases" src={BannerImage} />
            <Container sx={{ background: "white" }}>
                <ReleaseTabs allReleases={allReleases} />
            </Container>
        </>
    );
};

export const getStaticProps = async () => {
    const allReleases = await getReleaseNotes();

    return {
        props: {
            allReleases,
            ...(await loadServerSideLocales()),
        },
        revalidate: 10,
    };
};

export default Releases;
