import { ReactNode } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { CmsStep } from "@/interfaces/Cms";
import HTMLContent from "@/components/HTMLContent";
import CohortDiscoveryButton from "../CohortDiscoveryButton";
import {
    StepCircle,
    StepContent,
    StepMarker,
    StepMarkerIcon,
    StepRow,
    StepsList,
    StepTitle,
} from "./StepList.styles";
import ViewCohortDatasetsButton from "./ViewCohortDatasetsButton";

const STEP_BUTTONS: Record<string, ReactNode> = {
    viewDatasets: <ViewCohortDatasetsButton />,
    viewDatasetsNhs: <ViewCohortDatasetsButton nhsSdeOnly />,
    apply: (
        <CohortDiscoveryButton
            color="secondary"
            variant="outlined"
            sx={{ width: "auto", mt: 1 }}
        />
    ),
};

const EMAIL_MARKER = "email";

const firstValue = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

const isNumbered = (step: CmsStep) => firstValue(step.marker) !== EMAIL_MARKER;

const StepList = ({ steps }: { steps: CmsStep[] }) => (
    <StepsList>
        {steps.map((step, index) => {
            // Numbered rows advance the count; "email" markers are skipped.
            const stepNumber = steps
                .slice(0, index + 1)
                .filter(isNumbered).length;
            const buttonKey = firstValue(step.buttonKey);

            return (
                <StepRow key={`${index}-${step.stepTitle}`}>
                    <StepMarker>
                        {isNumbered(step) ? (
                            <StepCircle>{stepNumber}</StepCircle>
                        ) : (
                            <StepMarkerIcon>
                                <MailOutlineIcon />
                            </StepMarkerIcon>
                        )}
                    </StepMarker>
                    <StepContent>
                        <StepTitle variant="h3" component="h2">
                            {step.stepTitle}
                        </StepTitle>
                        {step.stepText && (
                            <HTMLContent content={step.stepText} />
                        )}
                        {buttonKey && STEP_BUTTONS[buttonKey]}
                    </StepContent>
                </StepRow>
            );
        })}
    </StepsList>
);

export default StepList;
