import Container from "@/components/Container";
import { getMissionAndPurposes } from "@/utils/cms";
import Banner from "@/components/Banner";
import { getTranslations } from "next-intl/server";

import BannerImage from "../../../../../public/images/banners/our-mission-and-purpose.png";
import {
    ABOUT,
    NO_DATA,
    OUR_MISSION_AND_PURPOSE,
    PAGES,
} from "@/consts/translation";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Our mission and purpose",
    description: "",
};

export default async function MissionsPage() {
    const t = await getTranslations(
        `${PAGES}.${ABOUT}.${OUR_MISSION_AND_PURPOSE}`
    );
    const allMissionsAndPurposes = await getMissionAndPurposes();

    return (
        <>
            <Banner title="Our Mission and purpose" src={BannerImage} />
            <Container sx={{ background: "white", padding: 10 }}>
                <div>
                    {!allMissionsAndPurposes.length && <p>{t(NO_DATA)}</p>}
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
