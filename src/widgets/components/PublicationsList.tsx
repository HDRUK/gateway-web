"use client";

import { useRef, useState } from "react";
import { tokens } from "@hdruk/ui/theme";
import {
    Box,
    Link,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    Typography,
} from "@mui/material";
import { PublicationItem, WidgetBranding } from "@/interfaces/Widget";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import { RouteName } from "@/consts/routeName";
import { FULL_GATEWAY_URL } from "@/consts/urls";

const TRANSLATIONS = {
    published: "Published",
    notAvailable: "n/a",
};

type PublicationsListProps = {
    items: PublicationItem[];
    branding: WidgetBranding;
};

const Authors = ({ text }: { text: string }) => {
    const ref = useRef<HTMLElement>(null);
    const [open, setOpen] = useState(false);

    return (
        <Tooltip
            title={text}
            placement="bottom"
            open={open}
            onOpen={() =>
                setOpen(
                    !!ref.current &&
                        ref.current.scrollWidth > ref.current.clientWidth
                )
            }
            onClose={() => setOpen(false)}>
            <Typography ref={ref} variant="body2" noWrap>
                {text}
            </Typography>
        </Tooltip>
    );
};

export default function PublicationsList({ items }: PublicationsListProps) {
    return (
        <List sx={{ background: tokens.background.white, p: 0, m: 0 }}>
            {items.map(result => (
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
                                        text={result.paper_title}
                                        component="span"
                                    />
                                </Link>
                            </Box>
                        }
                        secondary={
                            <>
                                <Authors
                                    text={
                                        result.authors ||
                                        TRANSLATIONS.notAvailable
                                    }
                                />
                                {result.abstract && (
                                    <Box
                                        sx={{
                                            color: tokens.text.secondaryBlack,
                                            mt: 1.5,
                                            p: 0,
                                        }}>
                                        <EllipsisLineLimit
                                            maxLine={2}
                                            text={result.abstract}
                                        />
                                    </Box>
                                )}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 2,
                                        mt: 2,
                                        p: 0,
                                    }}>
                                    <Typography
                                        sx={{
                                            color: tokens.text.faded,
                                            minWidth: 0,
                                            overflowWrap: "anywhere",
                                        }}>
                                        {result.journal_name}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: tokens.text.faded,
                                            flexShrink: 0,
                                        }}>
                                        {`${TRANSLATIONS.published}: `}
                                        {result.year_of_publication ||
                                            TRANSLATIONS.notAvailable}
                                    </Typography>
                                </Box>
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
}
