import { Button, Stack } from "@mui/material";
import { CtaLink } from "@/interfaces/Cms";
import useModal from "@/hooks/useModal";
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
    onRedirect?: () => void;
}

const CohortDiscoveryButton = (props: CohortDiscoveryButtonProps) => {
    const { showModal, hideModal } = useModal();
    const { ctaLink, color } = props;

    const { isRQuestEnabled, isCohortDiscoveryServiceEnabled } = useFeatures();

    const content = (
        <Stack gap={1} justifyContent="center" direction={"row"}>
            {isRQuestEnabled && <CohortDiscoveryRQuestButton {...props} />}{" "}
            {isCohortDiscoveryServiceEnabled && (
                <CohortDiscoveryServiceButton
                    onRedirect={() => {
                        hideModal();
                    }}
                    {...props}
                    color="secondary"
                />
            )}
        </Stack>
    );

    if (isRQuestEnabled && isCohortDiscoveryServiceEnabled) {
        return (
            <Button
                color={color}
                onClick={() =>
                    showModal({
                        title: "Choose which Cohort Discovery Service",
                        content,
                        showConfirm: false,
                        showCancel: false,
                    })
                }>
                {ctaLink?.title}
            </Button>
        );
    }

    return content;
};

export default CohortDiscoveryButton;
