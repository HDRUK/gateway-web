"use client";

import { InView } from "react-intersection-observer";
import { get, isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { DataUse, DatasetWithTitle } from "@/interfaces/DataUse";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import { RouteName } from "@/consts/routeName";
import { formatDate } from "@/utils/date";
import { convertToCamelCase } from "@/utils/general";
import { DataUseSection, FieldType } from "../../config";
import { DatasetFieldWrapper, ListContainer } from "./DataUseContent.styles";

const TRANSLATION_PATH = "pages.dataUse";
const DATE_FORMAT = "DD/MM/YYYY";
const TOOLTIP_SUFFIX = "Tooltip";
const DATASETS = "datasets";
const NON_GATEWAY_DATASETS = "non_gateway_datasets";

const DataUseContent = ({
    data,
    populatedSections,
}: {
    data: DataUse;
    populatedSections: DataUseSection[];
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const path = usePathname();

    const renderDataUseField = (
        path: string,
        type: FieldType,
        value: string | string[] | DatasetWithTitle[]
    ) => {
        const val = value as string;

        switch (type) {
            case FieldType.DATE: {
                return <Typography>{formatDate(val, DATE_FORMAT)}</Typography>;
            }
            case FieldType.TAG: {
                return (
                    <DatasetFieldWrapper>
                        {(value as DatasetWithTitle[])?.map(dataset => (
                            <EllipsisCharacterLimit
                                key={dataset.id}
                                text={dataset.shortTitle}
                                characterLimit={50}
                                isButton
                                action={() =>
                                    router.push(
                                        `/${RouteName.DATASET_ITEM}/${dataset.id}`
                                    )
                                }
                            />
                        ))}
                    </DatasetFieldWrapper>
                );
            }
            case FieldType.LIST_TEXT: {
                return (
                    <ListContainer>
                        {(value as string[])?.map(item => (
                            <Typography key={item}>{item}</Typography>
                        ))}
                    </ListContainer>
                );
            }
            case FieldType.LIST_LINK: {
                return (
                    <ListContainer>
                        {(value as string[])?.map(item => (
                            <Link key={item} href={item} target="_blank">
                                {item}
                            </Link>
                        ))}
                    </ListContainer>
                );
            }
            default:
                return <Typography>{val}</Typography>;
        }
    };

    const renderDatasetsField = (
        path: string,
        type: FieldType,
        datasetValue: DatasetWithTitle[]
    ) => {
        const nonGatewayDatasetValue = get(data, NON_GATEWAY_DATASETS);

        return (
            <ListContainer key={path}>
                {!isEmpty(datasetValue) &&
                    renderDataUseField(path, type, datasetValue)}
                {!isEmpty(nonGatewayDatasetValue) &&
                    renderDataUseField(
                        NON_GATEWAY_DATASETS,
                        FieldType.LIST_TEXT,
                        nonGatewayDatasetValue
                    )}
            </ListContainer>
        );
    };

    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    tablet: "repeat(5, 1fr)",
                },
                gap: {
                    mobile: 1,
                    tablet: 2,
                },
                p: 0,
            }}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 5", laptop: "span 5" },
                    p: 0,
                }}>
                <Paper sx={{ borderRadius: 2, p: 2 }}>
                    {populatedSections
                        .filter(section => section.sectionName !== "general")
                        .map((section, index) => (
                            <InView
                                key={`${section.sectionName}_inview`}
                                id={`anchor${index + 2}`}
                                threshold={1}
                                as="div"
                                onChange={inView => {
                                    if (inView && path) {
                                        router.replace(
                                            `${path}?section=${index + 2}`,
                                            { scroll: false }
                                        );
                                    }
                                }}>
                                <Box
                                    key={`${section.sectionName}_wrap`}
                                    id={`anchor${index + 2}`}
                                    sx={{
                                        "&:not(:last-of-type)": {
                                            borderBottom: 1,
                                            borderColor: "greyCustom.light",
                                        },
                                        pl: 0,
                                        pr: 0,
                                    }}>
                                    <Typography variant="h2">
                                        {t(section.sectionName)}
                                    </Typography>

                                    {section.fields.map(field => {
                                        const isPopulatedDatasetsField =
                                            field.path === DATASETS &&
                                            (!isEmpty(get(data, field.path)) ||
                                                !isEmpty(
                                                    get(
                                                        data,
                                                        NON_GATEWAY_DATASETS
                                                    )
                                                ));

                                        const value = get(data, field.path);

                                        if (
                                            (isEmpty(value) &&
                                                !isPopulatedDatasetsField) ||
                                            field.path === NON_GATEWAY_DATASETS
                                        ) {
                                            return null;
                                        }

                                        const label = convertToCamelCase(
                                            field.path
                                        );

                                        return (
                                            <BoxContainer
                                                sx={{
                                                    gridTemplateColumns: {
                                                        desktop:
                                                            "repeat(3, 1fr)",
                                                    },
                                                    gap: 1,
                                                    "&:not(:last-of-type)": {
                                                        mb: 2,
                                                    },
                                                }}
                                                key={field.path}>
                                                <Box
                                                    sx={{
                                                        gridColumn: {
                                                            desktop: "span 1",
                                                        },
                                                        p: 0,
                                                    }}>
                                                    {!field.hideTooltip ? (
                                                        <TooltipIcon
                                                            content={t(
                                                                `${label}${TOOLTIP_SUFFIX}`
                                                            )}
                                                            label={t(label)}
                                                        />
                                                    ) : (
                                                        t(label)
                                                    )}
                                                </Box>
                                                <Box
                                                    sx={{
                                                        gridColumn: {
                                                            desktop: "span 2",
                                                        },
                                                        p: 0,
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}>
                                                    {isPopulatedDatasetsField
                                                        ? renderDatasetsField(
                                                              field.path,
                                                              field.type,
                                                              value
                                                          )
                                                        : renderDataUseField(
                                                              field.path,
                                                              field.type,
                                                              value
                                                          )}
                                                </Box>
                                            </BoxContainer>
                                        );
                                    })}
                                </Box>
                            </InView>
                        ))}
                </Paper>
            </Box>
        </BoxContainer>
    );
};

export default DataUseContent;
