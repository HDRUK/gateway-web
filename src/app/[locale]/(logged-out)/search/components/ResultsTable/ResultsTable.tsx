import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { SearchResultDataset } from "@/interfaces/Search";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import StyledCheckbox from "@/components/StyledCheckbox";
import Table from "@/components/Table";
import TooltipIcon from "@/components/TooltipIcon";
import { RouteName } from "@/consts/routeName";
import { getDateRange, getPopulationSize } from "@/utils/search";

interface ResultTableProps {
    results: SearchResultDataset[];
}

const CONFORMS_TO_PATH = "metadata.accessibility.formatAndStandards.conformsTo";
const PUBLISHER_NAME_PATH = "metadata.summary.publisher.name";

const columnHelper = createColumnHelper<SearchResultDataset>();

const getColumns = ({
    handleSelect,
    selected,
    translations,
}: {
    handleSelect: (data: { [id: string]: boolean }) => void;
    selected: { [id: string]: boolean };
    translations: { [id: string]: string };
}) => [
    columnHelper.display({
        id: "actions",
        meta: { isPinned: true },
        cell: ({ row }) => {
            return (
                <div style={{ textAlign: "center" }}>
                    <StyledCheckbox
                        checked={selected[row.id]}
                        onChange={(_e, value) =>
                            handleSelect({ [row.id]: value })
                        }
                        size="large"
                        sx={{ p: 0 }}
                        iconSx={{ mr: 0 }}
                    />
                </div>
            );
        },
        header: () => null,
        size: 43,
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
        id: "conformsTo",
        cell: ({ row: { original } }) => (
            <div style={{ textAlign: "center" }}>
                {get(original, CONFORMS_TO_PATH)}
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
        id: "publisherName",
        cell: ({ row: { original } }) => (
            <div style={{ textAlign: "center" }}>
                <EllipsisLineLimit
                    showToolTip
                    text={get(original, PUBLISHER_NAME_PATH)}
                />
            </div>
        ),
        header: () => (
            <TooltipIcon
                buttonSx={{ p: 0 }}
                label={translations.dataPublisherLabel}
                size="small"
                content={translations.dataPublisherTooltip}
            />
        ),
        size: 120,
    }),
];

const RESULTS_TABLE_TRANSLATION_PATH = "pages.search.components.ResultsTable";
const ResultTable = ({ results }: ResultTableProps) => {
    const [selected, setSelected] = useState({});
    const t = useTranslations(RESULTS_TABLE_TRANSLATION_PATH);

    const handleSelect = (data: { [id: string]: boolean }) => {
        setSelected({ ...selected, ...data });
    };

    const translations = {
        metaDataLabel: t("title.label"),
        populationSizeLabel: t("populationSize.label"),
        populationSizeTooltip: t("populationSize.tooltip"),
        populationSizeNotReported: t("populationSize.notReported"),
        dateRangePublisherLabel: t("dateRangePublisher.label"),
        dateRangePublisherTooltip: t("dateRangePublisher.tooltip"),
        dataStandardLabel: t("dataStandard.label"),
        dataStandardTooltip: t("dataStandard.tooltip"),
        dataPublisherLabel: t("dataPublisher.label"),
        dataPublisherTooltip: t("dataPublisher.tooltip"),
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
                    handleSelect,
                    selected,
                    translations,
                })}
                rows={results}
            />
        </Paper>
    );
};

export default ResultTable;
