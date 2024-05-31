"use client";

import { List, ListItem } from "@mui/material";
import { flatMap, groupBy, map } from "lodash";
import {
    StructuralMetadata,
    StructuralMetadataColumn,
} from "@/interfaces/Dataset";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

type GroupByResult<T> = {
    [key: string]: T[];
};

const formatMetadata = (metadata: StructuralMetadata) => {
    const grouped = groupBy(
        metadata,
        "name"
    ) as unknown as GroupByResult<StructuralMetadata>;

    return map(grouped, (items, name) => {
        const { description } = items[0];

        const rows = flatMap(items, item =>
            (item.columns as StructuralMetadataColumn[]).flatMap(column => ({
                name: column.name,
                description: column.description,
                dataType: column.dataType,
            }))
        );

        return { name, description, rows };
    });
};

const StructuralMetadataAccordion = ({
    metadata,
}: {
    metadata: StructuralMetadata;
}) => {
    const formattedMetadata = formatMetadata(metadata);

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
                            {item.rows.map((row, index) => (
                                <ListItem
                                    key={row.name}
                                    divider={index < item.rows.length - 1}
                                    sx={{
                                        display: "flex",
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
