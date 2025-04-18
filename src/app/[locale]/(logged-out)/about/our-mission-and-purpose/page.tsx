import { getTranslations } from "next-intl/server";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { ABOUT, OUR_MISSION_AND_PURPOSE, PAGES } from "@/consts/translation";
import { getMissionAndPurposes } from "@/utils/cms";
import metaData from "@/utils/metadata";
import "@/styles/wpStyles.css";

export const metadata = metaData({
    title: "Our Mission and Purpose - About",
    description: "",
});

const TRANSLATION_NO_DATA = "noData";

export default async function MissionsPage() {
    const t = await getTranslations(
        `${PAGES}.${ABOUT}.${OUR_MISSION_AND_PURPOSE}`
    );
    const allMissionsAndPurposes = await getMissionAndPurposes();

    return (
        <>
            <Banner title="Our Mission and Purpose" />
            <Container
                sx={{ background: "white", padding: 10 }}
                className="wpStyles">
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
