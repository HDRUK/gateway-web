import { Stack } from "@mui/material";
import { CtaLink } from "@/interfaces/Cms";
import { useFeatures } from "@/providers/FeatureProvider";
import CohortDiscoveryRQuestButton from "./CohortDiscoveryRQuest";
import CohortDiscoveryServiceButton from "./CohortDiscoveryService";

export interface CohortDiscoveryButtonProps {
    ctaLink: CtaLink;
    showDatasetExplanatoryTooltip: boolean | null;
    color?: string | null;
    tooltipOverride?: string | null;
    disabledOuter?: boolean;
    clickedAction?: () => void;
}

const CohortDiscoveryButton = (props: CohortDiscoveryButtonProps) => {
    const { isRQuestEnabled, isCohortDiscoveryServiceEnabled } = useFeatures();
    return (
        <Stack gap={0.1}>
            {isRQuestEnabled && <CohortDiscoveryRQuestButton {...props} />}{" "}
            {isCohortDiscoveryServiceEnabled && (
                <CohortDiscoveryServiceButton {...props} color="secondary" />
            )}
        </Stack>
    );
};

export default CohortDiscoveryButton;
