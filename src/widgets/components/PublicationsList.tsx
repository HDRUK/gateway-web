"use client";

import { tokens } from "@hdruk/ui/theme";
import {
    Box,
    Link,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import { PublicationItem, WidgetBranding } from "@/interfaces/Widget";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import { RouteName } from "@/consts/routeName";
import { FULL_GATEWAY_URL } from "@/consts/urls";

type PublicationsListProps = {
    items: PublicationItem[];
    branding: WidgetBranding;
};

export default function PublicationsList({ items }: PublicationsListProps) {
    return (
        <List sx={{ background: tokens.background.white, p: 0, m: 0 }}>
            {items.map(result => {
                const source = [result.journal_name, result.year_of_publication]
                    .filter(Boolean)
                    .join(" · ");

                return (
                    <ListItem
                        key={result.id}
                        alignItems="flex-start"
                        sx={{
                            borderBottom: `1px solid ${tokens.status.grey}`,
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
                                        href={`${FULL_GATEWAY_URL}/${RouteName.PUBLICATION}/${result.id}`}
                                        target="_blank"
                                        fontSize={16}
                                        fontWeight={600}>
                                        <EllipsisLineLimit
                                            text={result.paper_title ?? ""}
                                            component="span"
                                        />
                                    </Link>
                                </Box>
                            }
                            secondary={
                                <>
                                    <EllipsisLineLimit
                                        component="div"
                                        maxLine={2}
                                        text={result.authors || "n/a"}
                                    />
                                    {source && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: tokens.text
                                                    .secondaryBlack,
                                            }}>
                                            {source}
                                        </Typography>
                                    )}
                                </>
                            }
                        />
                    </ListItem>
                );
            })}
        </List>
    );
}
