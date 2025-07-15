import { ReactElement, ReactNode } from "react";
import { Tooltip } from "@mui/material";
import MuiAccordion, {
    AccordionProps as MuiAccordionProps,
} from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { IconType } from "@/interfaces/Ui";
import { ChevronThinIcon } from "@/consts/customIcons";
import ConditionalWrapper from "../ConditionalWrapper";

export interface AccordionProps
    extends Omit<MuiAccordionProps, "children" | "variant"> {
    heading: string | ReactNode;
    contents: string | ReactNode;
    variant?: "underline" | "plain";
    noIndent?: boolean;
    iconLeft?: boolean;
    expandIcon?: IconType;
    tooltip?: string;
}

const tooltipWrapper = (tooltip: string) => (children: ReactElement) =>
    (
        <Tooltip
            title={tooltip}
            describeChild
            placement="right"
            style={{ width: "100%" }}>
            {children}
        </Tooltip>
    );

const Accordion = ({
    heading,
    contents,
    variant = "underline",
    noIndent,
    iconLeft,
    expandIcon,
    sx,
    tooltip,
    ...restProps
}: AccordionProps) => {
    const Icon = expandIcon || ChevronThinIcon;

    return (
        <MuiAccordion
            sx={{
                background: "transparent",
                boxShadow: "none",
                ...(noIndent && {
                    ".MuiAccordionSummary-root, .MuiAccordionDetails-root": {
                        paddingLeft: 0,
                        paddingRight: 0,
                    },
                }),
                "&.MuiAccordion-root.Mui-disabled": {
                    background: "transparent",
                },
                ...(variant === "underline" && {
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    "&:first-of-type, &:last-of-type": {
                        borderRadius: 0,
                    },
                }),
                ...(variant === "plain" && {
                    "&.MuiAccordion-root:before": {
                        height: 0,
                    },
                    ".MuiAccordionSummary-content": {
                        marginTop: 1,
                        marginBottom: 1,
                    },
                    ".MuiAccordionSummary-root": {
                        minHeight: "auto",
                    },
                }),
                ...(iconLeft && {
                    ".MuiAccordionSummary-root .MuiAccordionSummary-content": {
                        marginLeft: 1,
                    },
                }),
                ...sx,
            }}
            {...restProps}>
            <ConditionalWrapper
                requiresWrapper={!!tooltip}
                wrapper={tooltipWrapper(tooltip || "")}>
                <MuiAccordionSummary
                    expandIcon={
                        <Icon
                            fontSize={!heading ? "large" : "medium"}
                            color="primary"
                            sx={!heading ? { width: "100%" } : {}}
                        />
                    }
                    sx={{
                        ...(iconLeft && { flexDirection: "row-reverse" }),
                        ...(!heading && {
                            ".MuiAccordionSummary-expandIconWrapper": {
                                width: "100%",
                            },
                        }),
                    }}>
                    {heading && heading}
                </MuiAccordionSummary>
            </ConditionalWrapper>
            <MuiAccordionDetails>{contents}</MuiAccordionDetails>
        </MuiAccordion>
    );
};

export default Accordion;
