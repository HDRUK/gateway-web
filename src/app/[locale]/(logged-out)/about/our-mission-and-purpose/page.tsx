import { getTranslations } from "next-intl/server";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { ABOUT, OUR_MISSION_AND_PURPOSE, PAGES } from "@/consts/translation";
import { getMissionAndPurposes } from "@/utils/cms";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Our Mission and Purpose",
    description: "",
};

const TRANSLATION_NO_DATA = "noData";

export default async function MissionsPage() {
    const t = await getTranslations(
        `${PAGES}.${ABOUT}.${OUR_MISSION_AND_PURPOSE}`
    );
    const allMissionsAndPurposes = await getMissionAndPurposes();

    return (
        <>
<<<<<<< HEAD
            <Banner
                title="Our Mission and Purpose"
                src="/images/banners/our-mission-and-purpose.png"
            />
=======
            <Banner title="Our Mission and Purpose" />
>>>>>>> origin/dev
            <Container sx={{ background: "white", padding: 10 }}>
                <div>
                    {!allMissionsAndPurposes.length && (
                        <p>{t(TRANSLATION_NO_DATA)}</p>
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
