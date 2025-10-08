"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { get, isArray } from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { VersionItem } from "@/interfaces/Dataset";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import DemographicsAccordion from "@/components/DemographicsAccordion";
import Link from "@/components/Link";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import StructuralMetadataAccordion from "@/components/StructuralMetadataAccordion";
import Table from "@/components/Table";
import TooltipText from "@/components/TooltipText";
import Typography from "@/components/Typography";
import useModal from "@/hooks/useModal";
import { RouteName } from "@/consts/routeName";
import { formatTextWithLinks, splitStringList } from "@/utils/dataset";
import { formatDate } from "@/utils/date";
import { decodeHtmlEntity } from "@/utils/general";
import {
    DatasetSection,
    DatasetType,
    FieldType,
    Observation,
    observationTableColumns,
} from "../../config";
import {
    DatasetButtonItem,
    DatasetFieldWrapper,
    ListContainer,
    ObservationTableWrapper,
} from "./DatasetContent.styles";

const DATE_FORMAT = "DD/MM/YYYY";
const OBSERVATION_DATE = "observationDate";
const TRANSLATION_PATH = "common";
const DOI_URL = "https://doi.org/";
const DOI_NAME_PATH = "metadata.metadata.summary.doiName";

const columnHelper = createColumnHelper<Observation>();

const getColumns = (notReportedText: string) =>
    observationTableColumns.map(column =>
        columnHelper.display({
            id: column.header,
            cell: ({ row: { original } }) =>
                column.path === OBSERVATION_DATE ? (
                    <p>{formatDate(get(original, column.path))}</p>
                ) : (
                    <p>
                        {get(original, column.path) !== -1
                            ? get(original, column.path)
                            : notReportedText}
                    </p>
                ),
            header: () => (
                <TooltipText
                    content={column.tooltip}
                    placement="bottom"
                    label={column.header}
                />
            ),
        })
    );

const renderObservationsTable = (
    notReportedText: string,
    rows?: Observation[]
) => (
    <ObservationTableWrapper>
        <Table<Observation>
            columns={getColumns(notReportedText)}
            rows={rows || []}
        />
    </ObservationTableWrapper>
);

const DatasetContent = ({
    data,
    populatedSections,
}: {
    data: VersionItem;
    populatedSections: DatasetSection[];
}) => {
    const router = useRouter();
    const t = useTranslations(TRANSLATION_PATH);
    const { showModal } = useModal();

    const renderDatasetField = (
        type: FieldType,
        value: string | DatasetType[]
    ) => {
        switch (type) {
            case FieldType.DATE: {
                return (
                    <Typography>{formatDate(value, DATE_FORMAT)}</Typography>
                );
            }
            case FieldType.TAG_LIST: {
                let tagList: string[] | string = value;

                if (typeof tagList === "string") {
                    tagList = tagList.split(",");
                }
                tagList = tagList.map(tag => decodeHtmlEntity(tag));

                return (
                    <DatasetFieldWrapper>
                        {tagList.map(tag => (
                            <DatasetButtonItem
                                color="success"
                                size="small"
                                onClick={() =>
                                    router.push(
                                        `/${RouteName.SEARCH}?type=${
                                            SearchCategory.DATASETS
                                        }&query=${encodeURIComponent(tag)}`
                                    )
                                }>
                                {tag}
                            </DatasetButtonItem>
                        ))}
                    </DatasetFieldWrapper>
                );
            }
            case FieldType.LIST: {
                const list = isArray(value)
                    ? value
                    : Array.from(new Set(splitStringList(value)));

                return list.map((item, i) => [
                    i > 0 && ", ",
                    formatTextWithLinks(item),
                ]);
            }
            case FieldType.LINK_LIST: {
                const list = isArray(value)
                    ? value
                    : Array.from(new Set(splitStringList(value)));

                return (
                    <ListContainer>
                        {list.map(item => (
                            <Link href={item} target="_blank">
                                {item}
                            </Link>
                        ))}
                    </ListContainer>
                );
            }

            case FieldType.DATASETTYPE_LIST: {
                return value.map((item, i) => [i > 0 && ", ", item.name]);
            }

            default: {
                return (
                    <MarkDownSanitizedWithHtml content={value} wrapper="span" />
                );
            }
        }
    };

    return (
        <Paper sx={{ borderRadius: 2, p: 2 }}>
            {populatedSections.map((section, index) => {
                const id = `anchor-${section.sectionName.replaceAll(
                    /\s/g,
                    ""
                )}`;
                return (
                    <div
                        key={`${section.sectionName}_section`}
                        id={`anchor${index + 1}`}>
                        <Box
                            key={`${section.sectionName}_wrap`}
                            id={id}
                            sx={{
                                "&:not(:last-of-type)": {
                                    borderBottom: 1,
                                    borderColor: "greyCustom.light",
                                },
                                pl: 0,
                                pr: 0,
                            }}>
                            <Typography
                                variant="h2"
                                aria-live="polite"
                                tabIndex={-1}>
                                {section.sectionName}
                            </Typography>

                            {section.sectionName === "Observations" ? (
                                renderObservationsTable(
                                    t("notReported"),
                                    get(data, "metadata.metadata.observations")
                                )
                            ) : section.sectionName === "Demographics" ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        p: 0,
                                    }}>
                                    <Button
                                        onClick={() =>
                                            showModal({
                                                title: "Demographics",
                                                content: (
                                                    <DemographicsAccordion
                                                        data={get(
                                                            data,
                                                            section.fields[0]
                                                                .path
                                                        )}
                                                    />
                                                ),
                                                showConfirm: false,
                                                showCancel: false,
                                            })
                                        }>
                                        Open table
                                    </Button>
                                </Box>
                            ) : section.sectionName ===
                              "Structural Metadata" ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        p: 0,
                                    }}>
                                    <Button
                                        onClick={() =>
                                            showModal({
                                                title: "Structural Metadata",
                                                content: (
                                                    <StructuralMetadataAccordion
                                                        metadata={get(
                                                            data,
                                                            section.fields[0]
                                                                .path
                                                        )}
                                                    />
                                                ),
                                                showConfirm: false,
                                                showCancel: false,
                                                styleProps: {
                                                    maxWidth: "laptop",
                                                },
                                            })
                                        }>
                                        Open table
                                    </Button>
                                </Box>
                            ) : (
                                section.fields.map(field => {
                                    let value = get(data, field.path);

                                    if (
                                        !value ||
                                        value === -1 ||
                                        (Array.isArray(value) && !value.length)
                                    ) {
                                        return null;
                                    }

                                    if (field.path === DOI_NAME_PATH) {
                                        value = DOI_URL.concat(value);
                                    }

                                    if (!field.label) {
                                        return (
                                            <Box
                                                sx={{
                                                    p: 0,
                                                    pb: 2,
                                                }}
                                                key={value}>
                                                {renderDatasetField(
                                                    field.type,
                                                    value
                                                )}
                                            </Box>
                                        );
                                    }

                                    return (
                                        <BoxContainer
                                            sx={{
                                                gridTemplateColumns: {
                                                    desktop: "repeat(3, 1fr)",
                                                },
                                                gap: 1,
                                                "&:not(:last-of-type)": {
                                                    mb: 2,
                                                },
                                            }}
                                            key={field.label}>
                                            <Box
                                                sx={{
                                                    gridColumn: {
                                                        desktop: "span 1",
                                                    },
                                                    p: 0,
                                                }}>
                                                {field.tooltip ? (
                                                    <TooltipText
                                                        content={field.tooltip}
                                                        label={field.label}
                                                    />
                                                ) : (
                                                    field.label
                                                )}
                                            </Box>
                                            <Box
                                                sx={{
                                                    gridColumn: {
                                                        desktop: "span 2",
                                                    },
                                                    p: 0,
                                                    wordWrap: "break-word",
                                                }}>
                                                {renderDatasetField(
                                                    field.type,
                                                    value
                                                )}
                                            </Box>
                                        </BoxContainer>
                                    );
                                })
                            )}
                        </Box>
                    </div>
                );
            })}
        </Paper>
    );
};

export default DatasetContent;
