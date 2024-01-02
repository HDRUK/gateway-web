import BannerImage from "../../../../public/images/banners/our-mission-and-purpose.png";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { getMissionAndPurposes } from "@/utils/cms";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Our mission and purpose",
    description: "",
};

export default async function MissionsPage() {
    const allMissionsAndPurposes = await getMissionAndPurposes();

    return (
        <>
            <Banner title="Our Mission and purpose" src={BannerImage} />
            <Container sx={{ background: "white", padding: 10 }}>
                <div>
                    {!allMissionsAndPurposes.length && (
                        <p>Nothing to see here</p>
                    )}
                    {allMissionsAndPurposes.map(mission => (
                        <div>
                            <div
                                style={{
                                    fontWeight: "bolder",
                                    fontSize: "16pt",
                                }}
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: mission.node.title,
                                }}
                            />
                            <div
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: mission.node.content,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </>
    );
}
