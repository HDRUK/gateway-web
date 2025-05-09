import { createColumnHelper } from "@tanstack/react-table";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { KeyedMutator } from "swr";
import { PageTemplatePromo } from "@/interfaces/Cms";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { Library } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import Table from "@/components/Table";
import TooltipIcon from "@/components/TooltipIcon";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { CheckIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { formatTextDelimiter } from "@/utils/dataset";
import { getDateRange, getPopulationSize } from "@/utils/search";
import ActionDropdown from "../ActionDropdown";

interface ResultTableProps {
    results: SearchResultDataset[];
    showLibraryModal: (props: { datasetId: number }) => void;
    cohortDiscovery: PageTemplatePromo;
}

const CONFORMS_TO_PATH = "metadata.accessibility.formatAndStandards.conformsTo";
const PUBLISHER_NAME_PATH = "metadata.summary.publisher.name";
const PUBLISHERS_ID = "metadata.summary.publisher.gatewayId";
const COHORT_DISCOVERY_PATH = "isCohortDiscovery";
const ACCESS_SERVICE_PATH =
    "metadata.accessibility.access.accessServiceCategory";
const CONTAINS_TISSUE_PATH = "metadata.additional.containsTissue";
const STRUCTURAL_METADATA_PATH = "metadata.additional.hasTechnicalMetadata";

const columnHelper = createColumnHelper<SearchResultDataset>();

const getColumns = ({
    translations,
    libraryData,
    showLibraryModal,
    mutateLibraries,
    isCohortDiscoveryDisabled,
    cohortDiscovery,
}: {
    translations: { [id: string]: string };
    libraryData?: Library[];
    showLibraryModal: (props: { datasetId: number }) => void;
    mutateLibraries: KeyedMutator<Library[]>;
    isCohortDiscoveryDisabled: boolean;
    cohortDiscovery: PageTemplatePromo;
}) => [
    columnHelper.display({
        id: "actions",
        meta: { isPinned: true },
        cell: ({ row: { original } }) => {
            return (
                <div style={{ textAlign: "center" }}>
                    <ActionDropdown
                        result={original}
                        libraryData={libraryData}
                        showLibraryModal={showLibraryModal}
                        mutateLibraries={mutateLibraries}
                        isCohortDiscoveryDisabled={isCohortDiscoveryDisabled}
                        cohortDiscovery={cohortDiscovery}
                    />
                </div>
            );
        },
        header: () => <span>{translations.actionLabel}</span>,
        size: 120,
    }),

    columnHelper.display({
        id: "title",
        cell: ({ row: { original } }) => {
            const { _id: datasetId } = original;
            const linkHref = `/${RouteName.DATASET_ITEM}/${datasetId}`;

            return (
                <Link href={linkHref}>
                    <EllipsisLineLimit
                        showToolTip
                        text={get(original, "metadata.summary.title")}
                    />
                </Link>
            );
        },
        meta: { isPinned: true, hasPinnedBorder: true },
        header: () => <span>{translations.metaDataLabel}</span>,
        size: 240,
    }),

    columnHelper.display({
        id: "dataProvider",
        cell: ({ row: { original } }) => {
            const dataCustodianId = get(original, PUBLISHERS_ID);
            // if the below is false, its because the api has failed to find the team id based off the original uid for gatewayId
            const isNumber = !Number.isNaN(dataCustodianId);
            const linkHref = `/${RouteName.DATA_PROVIDERS_ITEM}/${dataCustodianId}`;

            return (
                <div style={{ textAlign: "center" }}>
                    {isNumber && (
                        <Link href={linkHref}>
                            <EllipsisLineLimit
                                showToolTip
                                text={get(original, PUBLISHER_NAME_PATH)}
                            />
                        </Link>
                    )}
                    {!isNumber && (
                        <EllipsisLineLimit
                            showToolTip
                            text={get(original, PUBLISHER_NAME_PATH)}
                        />
                    )}
                </div>
            );
        },
        header: () => (
            <TooltipIcon
                buttonSx={{ p: 0 }}
                label={translations.dataProviderLabel}
                size="small"
                content={translations.dataProviderTooltip}
            />
        ),
        size: 120,
    }),

    columnHelper.display({
        id: "populationSize",
        cell: ({ row: { original } }) => (
            <div style={{ textAlign: "center" }}>
                {getPopulationSize(
                    original?.metadata,
                    translations.populationSizeNotReported
                )}
            </div>
        ),
        header: () => (
            <TooltipIcon
                buttonSx={{ p: 0 }}
                size="small"
                label={translations.populationSizeLabel}
                content={translations.populationSizeTooltip}
            />
        ),
        size: 120,
    }),

    columnHelper.display({
        id: "dateRange",
        cell: info => (
            <div style={{ textAlign: "center" }}>
                {getDateRange(info.row.original?.metadata)}
            </div>
        ),
        header: () => (
            <TooltipIcon
                buttonSx={{ p: 0 }}
                size="small"
                label={translations.dateRangePublisherLabel}
                content={translations.dateRangePublisherTooltip}
            />
        ),
        size: 120,
    }),

    columnHelper.display({
        id: "accessService",
        cell: ({ row: { original } }) => (
            <div style={{ textAlign: "center" }}>
                {get(original, ACCESS_SERVICE_PATH)}
            </div>
        ),
        header: () => (
            <TooltipIcon
                buttonSx={{ p: 0 }}
                label={translations.accessServiceLabel}
                size="small"
                content={translations.accessServiceTooltip}
            />
        ),
        size: 120,
    }),

    columnHelper.display({
        id: "conformsTo",
        cell: ({ row: { original } }) => (
            <div style={{ textAlign: "center" }}>
                {formatTextDelimiter(get(original, CONFORMS_TO_PATH))}
            </div>
        ),
        header: () => (
            <TooltipIcon
                buttonSx={{ p: 0 }}
                size="small"
                label={translations.dataStandardLabel}
                content={translations.dataStandardTooltip}
            />
        ),
        size: 120,
    }),

    columnHelper.display({
        id: "cohortDiscovery",
        cell: ({ row: { original } }) => {
            const isCohortDiscovery = get(original, COHORT_DISCOVERY_PATH);
            return (
                <div style={{ textAlign: "center" }}>
                    {isCohortDiscovery ? <CheckIcon color="primary" /> : "-"}
                </div>
            );
        },
        header: () => (
            <TooltipIcon
                buttonSx={{ p: 0 }}
                label={translations.cohortDiscoveryLabel}
                size="small"
                content={translations.cohortDiscoveryTooltip}
            />
        ),
        size: 120,
    }),

    columnHelper.display({
        id: "containsTissue",
        cell: ({ row: { original } }) => {
            const containsTissue = get(original, CONTAINS_TISSUE_PATH);
            return (
                <div style={{ textAlign: "center" }}>
                    {containsTissue ? <CheckIcon color="primary" /> : "-"}
                </div>
            );
        },
        header: () => (
            <TooltipIcon
                buttonSx={{ p: 0 }}
                label={translations.containsTissueLabel}
                size="small"
                content={translations.containsTissueTooltip}
            />
        ),
        size: 120,
    }),

    columnHelper.display({
        id: "hasTechnicalMetadata",
        cell: ({ row: { original } }) => {
            const containsTissue = get(original, STRUCTURAL_METADATA_PATH);
            return (
                <div style={{ textAlign: "center" }}>
                    {containsTissue ? <CheckIcon color="primary" /> : "-"}
                </div>
            );
        },
        header: () => (
            <TooltipIcon
                buttonSx={{ p: 0 }}
                label={translations.hasTechnicalMetadataLabel}
                size="small"
                content={translations.hasTechnicalMetadataTooltip}
            />
        ),
        size: 120,
    }),
];

const RESULTS_TABLE_TRANSLATION_PATH = "pages.search.components.ResultsTable";
const ResultTable = ({
    results,
    showLibraryModal,
    cohortDiscovery,
}: ResultTableProps) => {
    const t = useTranslations(RESULTS_TABLE_TRANSLATION_PATH);
    const { isLoggedIn, user } = useAuth();

    const { data: libraryData, mutate: mutateLibraries } = useGet<Library[]>(
        `${apis.librariesV1Url}?perPage=-1`,
        { shouldFetch: isLoggedIn }
    );

    const { data: userData } = useGet<CohortRequest>(
        `${apis.cohortRequestsV1Url}/user/${user?.id}`,
        {
            shouldFetch: !!user?.id,
        }
    );

    const isCohortDiscoveryDisabled =
        isLoggedIn && userData
            ? !["APPROVED", "REJECTED", "EXPIRED"].includes(
                  userData.request_status
              )
            : false;

    const translations = {
        actionLabel: t("action.label"),
        metaDataLabel: t("title.label"),
        populationSizeLabel: t("populationSize.label"),
        populationSizeTooltip: t("populationSize.tooltip"),
        populationSizeNotReported: t("populationSize.notReported"),
        dateRangePublisherLabel: t("dateRangePublisher.label"),
        dateRangePublisherTooltip: t("dateRangePublisher.tooltip"),
        dataStandardLabel: t("dataStandard.label"),
        dataStandardTooltip: t("dataStandard.tooltip"),
        dataProviderLabel: t("dataProvider.label"),
        dataProviderTooltip: t("dataProvider.tooltip"),
        accessServiceLabel: t("accessService.label"),
        accessServiceTooltip: t("accessService.tooltip"),
        cohortDiscoveryLabel: t("cohortDiscovery.label"),
        cohortDiscoveryTooltip: t("cohortDiscovery.tooltip"),
        containsTissueLabel: t("containsTissue.label"),
        containsTissueTooltip: t("containsTissue.tooltip"),
        hasTechnicalMetadataLabel: t("hasTechnicalMetadata.label"),
        hasTechnicalMetadataTooltip: t("hasTechnicalMetadata.tooltip"),
    };

    return (
        <Paper
            sx={{
                p: 0,
                border: "1px solid lightgray",
                overflowX: "scroll",
                width: "100%",
                position: "relative",
                mb: 4,
            }}>
            <Table<SearchResultDataset>
                columns={getColumns({
                    translations,
                    libraryData,
                    showLibraryModal,
                    mutateLibraries,
                    isCohortDiscoveryDisabled,
                    cohortDiscovery,
                })}
                rows={results}
            />
        </Paper>
    );
};

export default ResultTable;
