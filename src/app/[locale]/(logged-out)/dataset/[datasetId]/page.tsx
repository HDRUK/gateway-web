import { get, isEmpty, pick, some } from "lodash";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import HeaderActionBar from "@/components/HeaderActionBar";
import Link from "@/components/Link";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { DataStatus } from "@/consts/application";
import { RouteName } from "@/consts/routeName";
import { SCHEMA_NAME, SCHEMA_VERSION } from "@/consts/schema";
import { getDataset, getSchemaFromTraser } from "@/utils/api";
import { getLatestVersion } from "@/utils/dataset";
import metaData from "@/utils/metadata";
import ActionBar from "./components/ActionBar";
import DatasetContent from "./components/DatasetContent";
import DatasetMindMap from "./components/DatasetMindMap";
import DatasetStats from "./components/DatasetStats";
import GoogleRecommended from "./components/GoogleRecommended";
import Linkages from "./components/Linkages";
import Publications from "./components/Publications";
import Sources from "./components/Sources";
import { datasetFields } from "./config";
import {
    areaSx,
    backBarSx,
    layoutSx,
    leftColumnSx,
    mainColumnSx,
    navSx,
    titleSx,
} from "./page.styles";

const TRANSLATION_PATH = "pages.dataset.components.ActionBar";

export const metadata = metaData({
    title: "Dataset",
    description: "",
});

const DATASET_STAT_PATHS = [
    "metadata.metadata.summary.populationSize",
    "metadata.metadata.provenance.temporal.startDate",
    "metadata.metadata.provenance.temporal.endDate",
    "metadata.metadata.coverage.materialType",
    "metadata.metadata.coverage.spatial",
    "metadata.metadata.accessibility.access.deliveryLeadTime",
];

export default async function DatasetItemPage({
    params,
}: {
    params: Promise<{ datasetId: string }>;
}) {
    const { datasetId } = await params;
    const t = await getTranslations(TRANSLATION_PATH);

    const [data, googleRecommendedDataset, schema] = await Promise.all([
        getDataset(datasetId, SCHEMA_NAME, SCHEMA_VERSION, {
            suppressError: true,
        }),
        getDataset(datasetId, "SchemaOrg", "GoogleRecommended").catch(
            () => undefined
        ),
        getSchemaFromTraser(SCHEMA_NAME, SCHEMA_VERSION).catch(() => undefined),
    ]);

    const duoCodeDetails = Object.fromEntries(
        (schema?.schema?.$defs?.DuoCodesEnum?.oneOf ?? []).map(option => [
            option.const,
            {
                shortcode: option.shortcode,
                label: option.title,
                description: option.description,
            },
        ])
    );

    // Note that the status check is only required under v1 - under v2, we can use
    // an endpoint that will not show the data if not active
    if (!data || data?.status !== DataStatus.ACTIVE) notFound();

    const datasetVersion = data?.versions?.[0];

    const datasetStats = pick(datasetVersion, DATASET_STAT_PATHS);

    const populatedSections = datasetFields.filter(section =>
        section.fields.some(field => !isEmpty(get(datasetVersion, field.path)))
    );

    const linkageCounts = {
        tools: data?.tools_count,
        publications: data?.publications_count,
        publications_about: data?.publications.filter(pub =>
            pub.dataset_versions.filter(
                version => version.link_type === "ABOUT"
            )
        ).length,
        publications_using: data?.publications.filter(pub =>
            pub.dataset_versions.filter(
                version => version.link_type === "USING"
            )
        ).length,
        durs: data?.durs_count,
        collections: data?.collections_count,
    };

    const activeLinkList = populatedSections.map(section => {
        return { label: section.sectionName };
    });

    const datasetWithName = {
        ...data,
        name: datasetVersion.metadata?.metadata?.summary?.title,
    };

    const dataCustodianName = get(
        datasetVersion,
        "metadata.metadata.summary.dataCustodian.name"
    );

    return (
        <BoxContainer sx={layoutSx}>
            <Box sx={leftColumnSx}>
                <Box sx={areaSx("back")}>
                    <HeaderActionBar
                        backButtonText={t("label")}
                        backButtonHref={`/${RouteName.SEARCH}?type=${SearchCategory.DATASETS}`}
                        wrapperSx={backBarSx}
                    />
                </Box>
                <Box sx={areaSx("actions")}>
                    <ActionBar dataset={datasetWithName} />
                </Box>
                <ActiveListSidebar items={activeLinkList} sx={navSx} />
            </Box>
            <Box sx={titleSx}>
                <Typography variant="articleLead" component="h2">
                    {datasetVersion.metadata?.metadata?.summary?.title}
                </Typography>
                {dataCustodianName && data?.team?.id && (
                    <>
                        <Typography variant="articleLead" component="span">
                            -
                        </Typography>
                        <Link
                            variant="articleLead"
                            href={`/${RouteName.DATA_CUSTODIANS_ITEM}/${data?.team?.id}`}>
                            {dataCustodianName}
                        </Link>
                    </>
                )}
            </Box>
            {datasetStats && (
                <Box sx={{ ...areaSx("stats"), overflow: "hidden" }}>
                    <DatasetStats data={datasetStats} />
                </Box>
            )}
            <Box sx={mainColumnSx}>
                <Box sx={{ ...areaSx("mindmap"), overflow: "hidden" }}>
                    <DatasetMindMap
                        data={datasetVersion}
                        teamId={data?.team?.id}
                        isCohortDiscovery={data?.is_cohort_discovery}
                        populatedSections={populatedSections}
                        linkageCounts={linkageCounts}
                        hasStructuralMetadata={
                            !!datasetVersion.metadata?.metadata
                                ?.structuralMetadata?.tables?.length
                        }
                        hasDemographics={
                            !!some(
                                datasetVersion.metadata?.metadata
                                    ?.demographicFrequency,
                                value => value !== null
                            )
                        }
                    />
                </Box>
                <Box sx={areaSx("content")}>
                    <DatasetContent
                        data={datasetVersion}
                        populatedSections={populatedSections}
                        duoCodeDetails={duoCodeDetails}
                    />
                </Box>
            </Box>
            <Box sx={areaSx("sources")}>
                <Sources
                    data={datasetVersion.metadata.metadata}
                    gwdmVersion={datasetVersion.metadata.gwdmVersion}
                />
            </Box>
            <Box
                sx={{
                    ...areaSx("aside"),
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}>
                {data?.linkages && <Linkages linkages={data.linkages} />}
                <Publications data={data} />
            </Box>
            {googleRecommendedDataset && (
                <GoogleRecommended
                    metadata={getLatestVersion(googleRecommendedDataset)}
                />
            )}
        </BoxContainer>
    );
}
