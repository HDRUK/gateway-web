import { Box } from "@mui/material";
import Link from "next/link";
import BoxStacked from "@/components/BoxStacked";
import { BoxStackedProps } from "@/components/BoxStacked/BoxStacked";
import Chip, { ChipProps } from "@/components/Chip";
import { colors } from "@/config/theme";

export interface CardStackedProps {
    href: string;
    imgUrl: string;
    title: ChipProps["label"];
    chipProps?: Omit<ChipProps, "label">;
    boxStackedProps?: BoxStackedProps;
}

export default function CardStacked({
    href,
    imgUrl,
    title,
    boxStackedProps,
    chipProps,
}: CardStackedProps) {
    return (
        <BoxStacked
            sx={{ aspectRatio: "1.9 / 1", minHeight: "130px" }}
            {...boxStackedProps}>
            <Box
                component={Link}
                href={href}
                sx={{
                    color: colors.white,
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "flex-end",
                    backgroundImage: `url(${imgUrl})`,
                    backgroundColor: colors.white,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                }}>
                <Chip
                    role="heading"
                    aria-level={3}
                    size="small"
                    label={title}
                    sx={{
                        backgroundColor: colors.grey600,
                        color: colors.white,
                        maxWidth: "220px",
                    }}
                    {...chipProps}
                />
            </Box>
        </BoxStacked>
    );
}
