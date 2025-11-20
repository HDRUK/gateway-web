import { Fragment, Suspense } from "react";
import { Skeleton } from "@mui/material";
import { get, isEmpty } from "lodash";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import Chip from "@/components/Chip";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import { SectionSkeleton } from "@/components/Skeletons";
import { DataCustodianEntitiesSkeleton } from "@/components/Skeletons/Skeletons";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import apis from "@/config/apis";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/config/theme";
import { getTeamInfo } from "@/utils/api";
import { getCohortDiscovery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import ActionBar from "./components/ActionBar";
import DataCustodianContent from "./components/DataCustodianContent";
import { DatasetsOuter } from "./components/DatasetsOuter";
import EntitiesOuter from "./components/EntitiesOuter";
import { accordions, dataCustodianFields } from "./config";

const TRANSLATION_PATH = "pages.dataCustodian";

export const metadata = metaData({
    title: "Data Custodian",
    description: "",
});
export default async function DataCustodianItemPage({
    params,
}: {
    params: { dataCustodianId: string };
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { dataCustodianId } = params;
    const cookieStore = cookies();

    const infoData = await getTeamInfo(cookieStore, dataCustodianId, {
        suppressError: true,
    });
    if (!infoData) notFound();

    const resp = await fetch(
        `${apis.teamsV1UrlIP}/${dataCustodianId}/datasets_cohort_discovery`,
        {
            next: {
                revalidate: 180,
                tags: ["all", `custodian_datasets-${dataCustodianId}`],
            },
            cache: "force-cache",
        }
    );
    if (!resp.ok) {
        throw new Error("Failed to fetch custodian data");
    }
    const { data: cohortDiscoverySupport } = await resp.json();

    const cohortDiscovery = await getCohortDiscovery();

    const populatedSections = dataCustodianFields.filter(section =>
        section.fields.some(field => !isEmpty(get(infoData, field.path)))
    );

    const activeLinkList = populatedSections.concat(accordions).map(section => {
        return {
            label: t(section.sectionName),
        };
    });

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    <Typography variant="h1" sx={{ ml: 2, mt: 2 }}>
                        {infoData.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 0 }}>
                        <AspectRatioImage
                            width={554}
                            height={250}
                            alt={infoData.name}
                            src={
                                infoData?.team_logo ||
                                StaticImages.BASE.placeholder
                            }
                        />
                    </Box>
                    <ActionBar
                        team={{
                            id: infoData.id,
                            name: infoData.name,
                            member_of: infoData.member_of,
                        }}
                        cohortDiscovery={cohortDiscovery}
                        cohortDiscoveryEnabled={
                            cohortDiscoverySupport.supportsCohortDiscovery
                        }
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        <Suspense
                            fallback={
                                <Skeleton variant="rectangular" height={200} />
                            }>
                            <DataCustodianContent
                                dataCustodianId={dataCustodianId}
                                populatedSections={populatedSections}
                            />
                            {!!infoData.aliases?.length && (
                                <Fragment key="custodian_alias">
                                    <Typography variant="h3">
                                        {t("aliases")}
                                    </Typography>
                                    <Box
                                        sx={{ p: 0, pb: 1, display: "flex" }}
                                        gap={1}>
                                        {infoData.aliases?.map(alias => (
                                            <Chip
                                                label={alias.name}
                                                key={alias.id}
                                                color="alias"
                                            />
                                        ))}
                                    </Box>
                                </Fragment>
                            )}
                        </Suspense>
                        <Suspense
                            fallback={<SectionSkeleton title="Datasets" />}>
                            <DatasetsOuter
                                dataCustodianId={+dataCustodianId}
                                startIndex={populatedSections.length}
                            />
                        </Suspense>
                        <Suspense fallback={<DataCustodianEntitiesSkeleton />}>
                            <EntitiesOuter
                                dataCustodianId={+dataCustodianId}
                                startIndex={populatedSections.length}
                            />
                        </Suspense>
                        {/* Post-MVP: Service Offerings */}
                    </Box>
                </>
            }
        />
    );
}
