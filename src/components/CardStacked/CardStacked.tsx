import { tokens } from "@hdruk/ui/theme";
import { Box } from "@mui/material";
import Link from "next/link";
import BoxStacked from "@/components/BoxStacked";
import { BoxStackedProps } from "@/components/BoxStacked/BoxStacked";
import Chip, { ChipProps } from "@/components/Chip";
import HTMLContent from "../HTMLContent";

export interface CardStackedProps {
    href: string;
    imgUrl: string;
    title: ChipProps["label"];
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
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "flex-end",
                    backgroundImage: `url(${imgUrl})`,
                    backgroundColor: tokens.background.white,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                }}>
                <Chip
                    size="small"
                    label={<HTMLContent content={title} />}
                    sx={{
                        backgroundColor: tokens.status.faded,
                        color: tokens.text.primaryWhite,
                        maxWidth: "220px",
                    }}
                    data-testid="grid-chip"
                    {...chipProps}
                />
            </Box>
        </BoxStacked>
    );
}
