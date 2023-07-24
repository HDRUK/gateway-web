import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import Container from "@/components/Container";
import { getMissionAndPurposes } from "@/utils/cms";
import Banner from "@/components/Banner";
import { MissionAndPurposesNode } from "@/interfaces/MissionAndPurposes";

import BannerImage from "../../../public/images/banners/our-mission-and-purpose.png";

interface MissionAndPurposesProps {
    allMissionsAndPurposes: MissionAndPurposesNode[];
}

const Missions = ({ allMissionsAndPurposes }: MissionAndPurposesProps) => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - About - Our mission and purpose" />
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
                                dangerouslySetInnerHTML={{
                                    __html: mission.node.title,
                                }}
                            />
                            <div
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
};

export const getStaticProps = async () => {
    const allMissionsAndPurposes = await getMissionAndPurposes();

    return {
        props: {
            allMissionsAndPurposes,
            ...(await loadServerSideLocales()),
        },
        revalidate: 10,
    };
};

export default Missions;
