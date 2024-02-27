import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { SearchResult } from "@/interfaces/Search";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Paper from "@/components/Paper";
import StyledCheckbox from "@/components/StyledCheckbox";
import Table from "@/components/Table";
import TooltipIcon from "@/components/TooltipIcon";
import { getDateRange } from "@/utils/search";

interface ResultTableProps {
    results: SearchResult[];
}

const CONFORMS_TO_PATH =
    "metadata.metadata.accessibility.formatAndStandards.conformsTo";
const PUBLISHER_NAME_PATH = "metadata.metadata.summary.publisher.publisherName";
const POPULATION_SIZE_PATH = "metadata.metadata.observations.0.measuredValue";

const columnHelper = createColumnHelper<SearchResult>();

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
    columnHelper.accessor("metadata.metadata.summary.title", {
        cell: info => <EllipsisLineLimit text={info.getValue()} />,
        meta: { isPinned: true, hasPinnedBorder: true },
        header: () => <span>{translations.metaDataLabel}</span>,
        size: 240,
    }),
    columnHelper.accessor(POPULATION_SIZE_PATH, {
        cell: info => (
            <div style={{ textAlign: "center" }}>{info?.getValue()}</div>
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
                {getDateRange(info.row.original.metadata?.metadata)}
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
    columnHelper.accessor(CONFORMS_TO_PATH, {
        cell: info => (
            <div style={{ textAlign: "center" }}>{info.getValue()}</div>
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
    columnHelper.accessor(PUBLISHER_NAME_PATH, {
        cell: info => (
            <div style={{ textAlign: "center" }}>
                <EllipsisLineLimit text={info.getValue()} />
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
            <Table<SearchResult>
                columns={getColumns({ handleSelect, selected, translations })}
                rows={results}
            />
        </Paper>
    );
};

export default ResultTable;
