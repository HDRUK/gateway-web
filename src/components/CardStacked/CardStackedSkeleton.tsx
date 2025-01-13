import { Skeleton } from "@mui/material";
import BoxStacked from "@/components/BoxStacked";
import { BoxStackedProps } from "@/components/BoxStacked/BoxStacked";
import { boxStackedSX } from "./CardStacked";

export interface CardStackedSkeletonProps {
    boxStackedProps?: BoxStackedProps;
}

export default function CardStackedSkeleton({
    boxStackedProps,
}: CardStackedSkeletonProps) {
    return (
        <BoxStacked
            sx={{ ...boxStackedSX, opacity: "0.75" }}
            {...boxStackedProps}>
            <Skeleton
                variant="rectangular"
                width={300}
                height="100%"
                animation="wave"
            />
        </BoxStacked>
    );
}
