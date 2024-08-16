"use client";

import { List, ListItem } from "@mui/material";
import { flatMap, groupBy, map } from "lodash";
import { useTranslations } from "next-intl";
import {
    StructuralMetadata,
    StructuralMetadataColumn,
    StructuralMetadataPublicSchema,
} from "@/interfaces/Dataset";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

type GroupByResult<T> = {
    [key: string]: T[];
};

const formatMetadata = (
    metadata: StructuralMetadata | StructuralMetadata[]
) => {
    const grouped = groupBy(
        metadata,
        "name"
    ) as unknown as GroupByResult<StructuralMetadata>;

    return map(grouped, (items, name) => {
        if (!items || items.length === 0) {
            return undefined;
        }

        const { description } = items[0];

        const rows = flatMap(items, item =>
            (item.columns as StructuralMetadataColumn[]).flatMap(column => ({
                name: column.name,
                description: column.description,
                dataType: column.dataType,
                sensitive: column.sensitive ? "TRUE" : "FALSE",
            }))
        );

        return { name, description, rows };
    });
};

const TRANSLATION_PATH = "components.StructuralMetadataAccordion";

const StructuralMetadataAccordion = ({
    metadata,
}: {
    metadata:
        | StructuralMetadata
        | StructuralMetadata[]
        | StructuralMetadataPublicSchema;
}) => {
    const t = useTranslations(TRANSLATION_PATH);

    const isPublicSchema = (
        metadata:
            | StructuralMetadata
            | StructuralMetadata[]
            | StructuralMetadataPublicSchema
    ): metadata is StructuralMetadataPublicSchema => {
        return (
            (metadata as StructuralMetadataPublicSchema).tables !== undefined
        );
    };

    let tableData;
    if (!tableData) {
        return null;
    }
    if (isPublicSchema(metadata)) {
        tableData = metadata.tables;
    } else if (Array.isArray(metadata)) {
        tableData = metadata;
    } else {
        tableData = [metadata];
    }

    const formattedMetadata = formatMetadata(tableData);
    return (
        <>
            {formattedMetadata.map(item => (
                <Accordion
                    key={item.name}
                    heading={
                        <Box
                            sx={{
                                p: 0,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}>
                            <Typography variant="h4" sx={{ m: 0 }}>
                                {item.name}
                            </Typography>
                            {item.description && (
                                <TooltipIcon
                                    buttonSx={{ p: 0, pr: 2 }}
                                    content={item.description}
                                    label=""
                                />
                            )}
                        </Box>
                    }
                    contents={
                        <List sx={{ p: 0 }}>
                            <ListItem
                                key={`${item}.header`}
                                sx={{
                                    display: "flex",
                                    pl: 0,
                                    pr: 0,
                                }}>
                                <Typography sx={{ flex: 1, fontWeight: 500 }}>
                                    {t("columnName")}
                                </Typography>
                                <Typography
                                    sx={{
                                        flex: 1,
                                        fontWeight: 500,
                                    }}>
                                    {t("dataType")}
                                </Typography>
                                <Typography sx={{ flex: 1, fontWeight: 500 }}>
                                    {t("columnDesc")}
                                </Typography>
                                <Typography
                                    sx={{
                                        flex: 1,
                                        fontWeight: 500,
                                    }}>
                                    {t("sensitive")}
                                </Typography>
                            </ListItem>
                            {item.rows.map((row, index) => (
                                <ListItem
                                    key={row.name}
                                    divider={index < item.rows.length - 1}
                                    sx={{
                                        display: "flex",
                                        pl: 0,
                                        pr: 0,
                                    }}>
                                    <Typography sx={{ flex: 1 }}>
                                        {row.name}
                                    </Typography>
                                    <Typography
                                        sx={{ flex: 1, color: colors.grey600 }}>
                                        {row.dataType}
                                    </Typography>
                                    <Typography
                                        sx={{ flex: 1, color: colors.grey600 }}>
                                        {row.description}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            flex: 1,
                                            color: colors.grey600,
                                        }}>
                                        {row.sensitive}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    }
                />
            ))}
        </>
    );
};

export default StructuralMetadataAccordion;
