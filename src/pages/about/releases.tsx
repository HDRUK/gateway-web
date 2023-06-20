import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import Container from "@/components/Container";
import { getReleaseNotes } from "@/utils/cms";
import { ReleaseNotesResponse } from "@/interfaces/Releases";
import ReleaseTabs from "@/modules/ReleaseTabs";

interface ReleasesProps {
    allReleases: ReleaseNotesResponse;
}

const Releases = ({ allReleases }: ReleasesProps) => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - About - Releases" />
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
