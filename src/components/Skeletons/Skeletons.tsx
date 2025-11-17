import { ReactElement } from "react";
import Skeleton from "@mui/material/Skeleton";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Typography from "@/components/Typography";

const SkeletonAccordian = ({ title }: { title: string }) => {
    return (
        <Accordion
            variant="plain"
            noIndent
            elevation={0}
            heading={<Typography variant="h3">{title}</Typography>}
            defaultExpanded
            contents={
                <BoxContainer
                    sx={{
                        gridTemplateColumns: {
                            mobile: "repeat(1, 1fr)",
                            desktop: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}>
                    {[...Array(6).keys()].map(() => (
                        <Skeleton
                            key={`${title}-skeleton`}
                            variant="rectangular"
                            height={154}
                            sx={{ bgcolor: "white" }}
                        />
                    ))}
                </BoxContainer>
            }
        />
    );
};

const NetworkSkeleton = (): ReactElement => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}>
            <SkeletonAccordian title="Data Uses" />
            <SkeletonAccordian title="Analysis Scripts & Software" />
            <SkeletonAccordian title="Publications" />
            <SkeletonAccordian title="Collections" />
        </Box>
    );
};

const DataCustodianEntitiesSkeleton = (): ReactElement => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}>
            <SkeletonAccordian title="Collections" />
            <SkeletonAccordian title="Analysis Scripts & Software" />
            <SkeletonAccordian title="Data Uses" />
            <SkeletonAccordian title="Publications" />
        </Box>
    );
};

const SectionSkeleton = ({ title }: { title: string }): ReactElement => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pb: 0,
            }}>
            <SkeletonAccordian title={title} />
        </Box>
    );
};

export { NetworkSkeleton, DataCustodianEntitiesSkeleton, SectionSkeleton };
