import Banner from "@/components/Banner";
import Container from "@/components/Container";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Contact Us",
    description: "",
};

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
