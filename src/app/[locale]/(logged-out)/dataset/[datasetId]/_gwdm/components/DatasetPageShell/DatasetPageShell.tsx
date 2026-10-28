import { JSONSchemaDocument, SectionNav } from "@hdruk/gwdm-view";
import { tokens } from "@hdruk/ui/theme";
import { Alert } from "@mui/material";
import { useTranslations } from "next-intl";
import { Dataset } from "@/interfaces/Dataset";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import HeaderActionBar from "@/components/HeaderActionBar";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { RouteName } from "@/consts/routeName";
import { getLatestVersion } from "@/utils/dataset";
import ActionBar from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/ActionBar";
import DatasetMindMap from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/DatasetMindMap";
import DatasetStats from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/DatasetStats";
import GoogleRecommended from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/GoogleRecommended";
import Linkages from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/Linkages";
import Publications from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/Publications";
import {
    areaSx,
    backBarSx,
    backSx,
    layoutSx,
    leftColumnSx,
    mainColumnSx,
    navSx,
    titleSx,
} from "@/app/[locale]/(logged-out)/dataset/[datasetId]/page.styles";
import { makeBaseComponents } from "@/templates/metadata/view/baseComponents";
import { buildProductionSections } from "@/templates/metadata/view/production/productionLayout";
import {
    GeneratedTemplate,
    getMetadataTemplate,
} from "@/templates/metadata/view/registry";
import { DuoCodeDetails } from "../../lib/duoCodeDetails";
import {
    buildGwdmPageFacts,
    GWDM_SCROLL_TARGETS,
} from "../../lib/gwdmPageFacts";
import GwdmSources from "../GwdmSources";
import MetadataFormat from "../MetadataFormat";

export interface DatasetPageShellProps {
    dataset: Dataset;
    /** The GWDM JSON Schema for the dataset's version; undefined if TRASER failed. */
    schema?: JSONSchemaDocument;
    /** Defaults to the template for the dataset's partner and GWDM version. */
    template?: GeneratedTemplate;
    /** The SchemaOrg translation, used only for the JSON-LD script. */
    googleRecommended?: Dataset;
    /** DUO code labels from the HDRUK schema, for GWDM's duoCodes. */
    duoCodeDetails?: Record<string, DuoCodeDetails>;
}

/**
 * The Gateway dataset page around a schema-driven body. Everything branded -
 * back link, actions, title and custodian, stats, mind map, sources, linkages,
 * publications and the JSON-LD script - lives here, so it is identical for
 * every partner and GWDM version and no template can remove it. A template
 * only arranges the metadata content in the "content" area.
 *
 * A clinical trial case study is not a requestable dataset, so it drops the
 * dataset-only chrome: the action bar (access requests, enquiries, library,
 * downloads), stats and mind map.
 */
const DatasetPageShell = ({
    dataset,
    schema,
    template,
    googleRecommended,
    duoCodeDetails,
}: DatasetPageShellProps) => {
    const t = useTranslations("pages.dataset.components");

    const facts = buildGwdmPageFacts(dataset);
    const resolved =
        template ??
        getMetadataTemplate({
            partner: facts.partner,
            gwdmVersion: facts.gwdmVersion,
        });

    // Native GWDM, which the legacy HDRUK `Metadata` interface does not describe.
    const data = (dataset.versions[0].metadata?.metadata ??
        {}) as unknown as Record<string, unknown>;

    // The API nests link_type under dataset_versions, which the
    // PublicationHasDatasetVersion interface does not declare.
    const publications = (dataset.publications ?? []) as unknown as {
        dataset_versions?: { link_type?: string }[];
    }[];
    const countByLinkType = (type: string) =>
        publications.filter(pub =>
            pub.dataset_versions?.some(version => version.link_type === type)
        ).length;

    const linkageCounts = {
        tools: dataset.tools_count,
        publications: dataset.publications_count,
        publications_about: countByLinkType("ABOUT"),
        publications_using: countByLinkType("USING"),
        durs: dataset.durs_count,
        collections: dataset.collections_count,
    };

    // A production-layout template renders the existing page's own sections,
    // nav and anchors, so it needs no schema and no scroll-target remapping.
    const isProductionLayout = resolved.meta.layout === "production";
    const productionSections = isProductionLayout
        ? buildProductionSections(data)
        : [];
    const scrollTargets = isProductionLayout ? undefined : GWDM_SCROLL_TARGETS;
    const canRenderContent = isProductionLayout || !!schema;

    // The mind map only scrolls to sections it is told are populated, by the
    // production page's section names.
    const mindMapSections = (
        isProductionLayout
            ? productionSections.map(section => ({
                  sectionName: section.title,
              }))
            : [
                  facts.hasStructuralMetadata && {
                      sectionName: "Structural Metadata",
                  },
                  facts.hasDemographics && { sectionName: "Demographics" },
              ].filter(
                  (section): section is { sectionName: string } => !!section
              )
    ).map(section => ({ ...section, fields: [] }));

    // The production chrome still reads HDRUK paths, so it gets the
    // compatibility view of the version rather than the native GWDM.
    const chromeDataset = {
        ...dataset,
        name: facts.title,
        versions: [facts.legacyVersion],
    };

    const { Template } = resolved;
    const components = (resolved.makeComponents ?? makeBaseComponents)({
        data,
        schema: schema ?? {},
        duoCodeDetails,
    });

    return (
        <BoxContainer sx={layoutSx}>
            <Box sx={leftColumnSx}>
                <Box sx={backSx}>
                    <HeaderActionBar
                        backButtonText={t("ActionBar.label")}
                        backButtonHref={`/${RouteName.SEARCH}?type=${SearchCategory.DATASETS}`}
                        wrapperSx={backBarSx}
                    />
                </Box>
                <Box
                    sx={{
                        ...areaSx("actions"),
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}>
                    {!facts.isCaseStudy && (
                        <ActionBar dataset={chromeDataset} />
                    )}
                    <MetadataFormat
                        sourceSchema={facts.sourceSchema}
                        partner={facts.partner}
                        metadataVersion={facts.metadataVersion}
                        issued={facts.issued}
                        modified={facts.modified}
                    />
                </Box>
                {canRenderContent && (
                    // display: contents keeps the nav itself a grid item, so
                    // navSx still places it in the "nav" area.
                    <Box data-testid="section-nav" sx={{ display: "contents" }}>
                        {isProductionLayout ? (
                            // Positional #anchor{n} targets, as production.
                            <ActiveListSidebar
                                items={productionSections.map(section => ({
                                    label: section.title,
                                }))}
                                sx={navSx}
                            />
                        ) : (
                            <SectionNav
                                sections={resolved.meta.sections}
                                data={data}
                                schema={schema ?? {}}
                                Nav={ActiveListSidebar}
                                sx={navSx}
                            />
                        )}
                    </Box>
                )}
            </Box>

            <Box sx={titleSx}>
                <Typography variant="articleLead" component="h2">
                    {facts.title}
                </Typography>
                {facts.custodianName && dataset.team?.id && (
                    <>
                        <Typography variant="articleLead" component="span">
                            -
                        </Typography>
                        <Link
                            variant="articleLead"
                            href={`/${RouteName.DATA_CUSTODIANS_ITEM}/${dataset.team.id}`}>
                            {facts.custodianName}
                        </Link>
                    </>
                )}
            </Box>

            {!facts.isCaseStudy && (
                <Box sx={{ ...areaSx("stats"), overflow: "hidden" }}>
                    <DatasetStats
                        data={facts.legacyVersion}
                        scrollTargets={scrollTargets}
                    />
                </Box>
            )}

            <Box sx={mainColumnSx}>
                {!facts.isCaseStudy && (
                    <Box sx={{ ...areaSx("mindmap"), overflow: "hidden" }}>
                        <DatasetMindMap
                            data={facts.legacyVersion}
                            teamId={dataset.team?.id}
                            isCohortDiscovery={dataset.is_cohort_discovery}
                            populatedSections={mindMapSections}
                            linkageCounts={linkageCounts}
                            hasStructuralMetadata={facts.hasStructuralMetadata}
                            hasDemographics={facts.hasDemographics}
                            scrollTargets={scrollTargets}
                        />
                    </Box>
                )}
                <Box
                    sx={areaSx("content")}
                    data-template-source={resolved.source}>
                    {canRenderContent ? (
                        // One card around every section, as DatasetContent draws it.
                        <Paper
                            sx={{
                                borderRadius: `${tokens.radius.medium}px`,
                                p: 2,
                            }}>
                            <Template
                                data={data}
                                schema={schema ?? {}}
                                title={facts.title}
                                components={components}
                            />
                        </Paper>
                    ) : (
                        <Alert severity="warning">
                            {t("DatasetPageShell.schemaUnavailable")}
                        </Alert>
                    )}
                </Box>
            </Box>

            <Box sx={areaSx("sources")}>
                <GwdmSources
                    datasetTypes={facts.datasetTypes}
                    datasetSubTypes={facts.datasetSubTypes}
                    custodianName={facts.custodianName}
                    collectionSituations={facts.collectionSituations}
                />
            </Box>

            <Box
                sx={{
                    ...areaSx("aside"),
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}>
                {dataset.linkages && <Linkages linkages={dataset.linkages} />}
                <Publications data={dataset} />
            </Box>

            {googleRecommended && (
                <GoogleRecommended
                    metadata={getLatestVersion(googleRecommended)}
                />
            )}
        </BoxContainer>
    );
};

export default DatasetPageShell;
