import Banner from "@/components/Banner";
import Container from "@/components/Container";
import metaData from "@/utils/metdata";

export const metadata = metaData({
    title: "Contact Us - About",
    description: "",
});
const ReleasesPage = async () => {
    return (
        <>
            <Banner
                title="Contact Us"
                src="/images/banners/release-notes.png"
            />
            <Container sx={{ background: "white", padding: 0 }} />
        </>
    );
};

export default ReleasesPage;
