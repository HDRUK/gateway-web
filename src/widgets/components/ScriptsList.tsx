"use client";

import { Box, Link, List, ListItem, ListItemText } from "@mui/material";
import { ScriptItem } from "@/interfaces/Widget";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import theme, { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import { FULL_GATEWAY_URL } from "@/consts/urls";

type ScriptsListProps = { items: ScriptItem[] };

export default function ScriptsList({ items }: ScriptsListProps) {
    return (
        <List sx={{ background: colors.white, p: 0, m: 0 }}>
            {items.map(result => (
                <ListItem
                    key={result.id}
                    alignItems="flex-start"
                    sx={{
                        borderBottom: `1px solid ${colors.grey300}`,
                        "&:last-of-type": { borderBottom: "none", pb: 0 },
                    }}>
                    <ListItemText
                        disableTypography
                        primary={
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    p: 0,
                                    mb: 1.5,
                                }}>
                                <Link
                                    href={`${FULL_GATEWAY_URL}/${RouteName.TOOL_ITEM}/${result.id}`}
                                    target="_blank"
                                    fontSize={16}
                                    fontWeight={600}>
                                    <EllipsisLineLimit
                                        text={result.name}
                                        component="span"
                                    />
                                </Link>
                            </Box>
                        }
                        secondary={
                            <EllipsisLineLimit
                                component="div"
                                maxLine={2}
                                sx={{
                                    margin: `${theme.spacing(
                                        2
                                    )} 0 ${theme.spacing(1.5)}`,
                                    color: colors.grey800,
                                }}
                                text={
                                    result?.description ? (
                                        <MarkDownSanitizedWithHtml
                                            content={result.description}
                                        />
                                    ) : (
                                        "n/a"
                                    )
                                }
                            />
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
}
