"use client";

import { Box, Chip, Link } from "@mui/material";
import { CollectionItem } from "@/interfaces/Widget";
import BoxStacked from "@/components/BoxStacked";
import { colors } from "@/config/theme";
import { FULL_GATEWAY_URL } from "@/consts/urls";

const boxStackedSX = { aspectRatio: "1.9 / 1", minHeight: 130 } as const;

type CollectionsGridProps = { items: CollectionItem[] };

export default function CollectionsGrid({ items }: CollectionsGridProps) {
    return (
        <Box
            sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                    mobile: "1fr",
                    tablet: "repeat(2, 1fr)",
                },
                p: 1,
            }}>
            {items.map(result => (
                <BoxStacked key={result.id} sx={boxStackedSX}>
                    <Box
                        component={Link}
                        href={`${FULL_GATEWAY_URL}/collection/${result.id}`}
                        target="_blank"
                        sx={{
                            color: colors.white,
                            px: 3,
                            py: 2,
                            display: "flex",
                            alignItems: "flex-end",
                            backgroundImage: `url(${
                                result?.image_link ||
                                "https://media.prod.hdruk.cloud/static/default_placeholder.png"
                            })`,
                            backgroundColor: colors.white,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            textDecoration: "none",
                        }}>
                        <Chip
                            size="small"
                            label={result.name}
                            sx={{
                                backgroundColor: colors.grey600,
                                color: colors.white,
                                maxWidth: "220px",
                            }}
                        />
                    </Box>
                </BoxStacked>
            ))}
        </Box>
    );
}
