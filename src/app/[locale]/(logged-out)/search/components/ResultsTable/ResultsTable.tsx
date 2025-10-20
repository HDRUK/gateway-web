import { TableContainer, Tooltip } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { KeyedMutator } from "swr";
import { PageTemplatePromo } from "@/interfaces/Cms";
import { Library } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import Table from "@/components/Table";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";
import { getDateRange } from "@/utils/search";
import ActionDropdown from "../ActionDropdown";

interface ResultTableProps {
    results: SearchResultDataset[];
    showLibraryModal: (props: { datasetId: number }) => void;
    cohortDiscovery: PageTemplatePromo;
}

const PUBLISHER_NAME_PATH = "metadata.summary.publisher.name";
const PUBLISHERS_ID = "metadata.summary.publisher.gatewayId";

const columnHelper = createColumnHelper<SearchResultDataset>();

const getColumns = ({
    translations,
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
        id: "title",
        cell: ({ row: { original } }) => {
            const { _id: datasetId } = original;
            const linkHref = `/${RouteName.DATASET_ITEM}/${datasetId}`;

            return (
                <Link href={linkHref}>
                    <EllipsisLineLimit
                        text={get(original, "metadata.summary.title")}
                    />
                </Link>
            );
        },
        meta: { isPinned: true, hasPinnedBorder: true },
        header: () => <span>{translations.metaDataLabel}</span>,
        minSize: 300,
        size: 700,
    }),

    columnHelper.display({
        id: "dataProvider",
        cell: ({ row: { original } }) => {
            const dataCustodianId = get(original, PUBLISHERS_ID);
            // if the below is false, its because the api has failed to find the team id based off the original uid for gatewayId
            const isNumber = !Number.isNaN(dataCustodianId);
            const linkHref = `/${RouteName.DATA_CUSTODIANS_ITEM}/${dataCustodianId}`;

            return (
                <div style={{ textAlign: "center" }}>
                    {isNumber && (
                        <Link
                            href={linkHref}
                            onFocus={e => {
                                e.currentTarget.scrollIntoView({
                                    behavior: "smooth",
                                    inline: "center",
                                    block: "nearest",
                                });
                            }}>
                            <EllipsisLineLimit
                                text={get(original, PUBLISHER_NAME_PATH)}
                            />
                        </Link>
                    )}
                    {!isNumber && (
                        <EllipsisLineLimit
                            text={get(original, PUBLISHER_NAME_PATH)}
                        />
                    )}
                </div>
            );
        },
        header: () => (
            <Tooltip
                describeChild
                title={translations.dataProviderTooltip}
                tabIndex={0}>
                {translations.dataProviderLabel}
            </Tooltip>
        ),
        size: 400,
    }),
    columnHelper.display({
        id: "dateRange",
        cell: info => (
            <div style={{ textAlign: "center" }}>
                {getDateRange(info.row.original?.metadata)}
            </div>
        ),
        header: () => (
            <Tooltip
                describeChild
                title={translations.dateRangePublisherTooltip}
                tabIndex={0}>
                {translations.dateRangePublisherLabel}
            </Tooltip>
        ),
        size: 120,
    }),
    columnHelper.display({
        id: "actions",
        meta: { isPinned: true },
        cell: ({ row: { original } }) => {
            return (
                <div style={{ textAlign: "center" }}>
                    <ActionDropdown
                        result={original}
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
];

const RESULTS_TABLE_TRANSLATION_PATH = "pages.search.components.ResultsTable";
const ResultTable = ({
    results,
    showLibraryModal,
    cohortDiscovery,
}: ResultTableProps) => {
    const t = useTranslations(RESULTS_TABLE_TRANSLATION_PATH);
    const { isLoggedIn, user } = useAuth();

    const { requestStatus } = useCohortStatus(user?.id);

    const { data: libraryData, mutate: mutateLibraries } = useGet<Library[]>(
        `${apis.librariesV1Url}?per_page=-1`,
        { shouldFetch: isLoggedIn }
    );

    const isCohortDiscoveryDisabled =
        isLoggedIn && requestStatus
            ? !["APPROVED", "REJECTED", "EXPIRED"].includes(requestStatus)
            : false;

    const translations = {
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

        actionLabel: t("action.label"),
    };

    return (
        <Paper
            sx={{
                p: 0,
                width: "100%",
                bgcolor: "background.paper",
                border: "1px solid #AAB7C4",
                borderRadius: 2,
                mb: 4,
            }}>
            <TableContainer>
                <Table<SearchResultDataset>
                    style={{ background: "background.paper", borderRadius: 2 }}
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
            </TableContainer>
        </Paper>
    );
};

export default ResultTable;
