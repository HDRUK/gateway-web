import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Typography from "@/components/Typography";
import { getDataUse } from "@/utils/api";

const TRANSLATION_PATH = "pages.dataUse";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Data Use",
    description: "",
};

export default async function DataUseItemPage({
    params,
}: {
    params: { dataUseId: string };
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { dataUseId } = params;
    const cookieStore = cookies();
    const data = await getDataUse(cookieStore, dataUseId);

    // const populatedSections = dataUseFields.filter(section =>
    //     section.fields.some(field => !isEmpty(get(data, field.path)))
    // );

    // const activeLinkList = populatedSections.map(section => {
    //     return {
    //         label: t(section.sectionName),
    //     };
    // });

    return (
        <BoxContainer
            id="anchor1"
            sx={{
                gridTemplateColumns: {
                    mobile: "repeat(1, 1fr)",
                    tablet: "repeat(5, 1fr)",
                },
            }}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 2", laptop: "span 1" },
                    bgcolor: "white",
                    p: 0,
                }}>
                {/* <ActiveListSidebar items={activeLinkList} /> */}
            </Box>
            <Box
                sx={{
                    gridColumn: { tablet: "span 3", laptop: "span 4" },
                    p: 0,
                }}>
                <>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                        style={{ boxShadow: "1px 1px 3px 0px #00000017" }}>
                        <BackButton
                            label={t("backText")}
                            style={{ margin: 0 }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        <Box sx={{ p: 0, gap: 2 }}>
                            <Typography variant="h2" sx={{ pt: 0.5, pb: 0.5 }}>
                                {data.project_title}
                            </Typography>
                        </Box>
                        {/* <DataUseContent
                            data={data}
                            populatedSections={populatedSections}
                        /> */}
                    </Box>
                </>
            </Box>
        </BoxContainer>
    );
}
