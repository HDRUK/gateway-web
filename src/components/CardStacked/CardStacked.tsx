import { Chip, ChipProps } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import { Box } from "@mui/material";
import Link from "next/link";
import BoxStacked from "@/components/BoxStacked";
import { BoxStackedProps } from "@/components/BoxStacked/BoxStacked";
import HTMLContent from "../HTMLContent";

export interface CardStackedProps {
    href: string;
    imgUrl: string;
    title: string;
    chipProps?: Omit<ChipProps, "label">;
    boxStackedProps?: BoxStackedProps;
}

export const boxStackedSX = { aspectRatio: "1.9 / 1", minHeight: 130 };

export default function CardStacked({
    href,
    imgUrl,
    title,
    boxStackedProps,
    chipProps,
}: CardStackedProps) {
    return (
        <BoxStacked sx={boxStackedSX} {...boxStackedProps}>
            <Box
                component={Link}
                href={href}
                sx={{
                    color: tokens.text.primaryWhite,
                    textDecoration: "none",
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "flex-end",
                    overflow: "hidden",
                    backgroundImage: `url(${imgUrl})`,
                    backgroundColor: tokens.background.white,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                }}>
                <Chip
                    size="small"
                    color="archived"
                    label={<HTMLContent content={title} />}
                    sx={{
                        maxWidth: "100%",
                        "& .MuiChip-label > div": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        },
                    }}
                    data-testid="grid-chip"
                    {...chipProps}
                />
            </Box>
        </BoxStacked>
    );
}
