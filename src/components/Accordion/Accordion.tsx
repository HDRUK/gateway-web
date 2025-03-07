import { ReactNode } from "react";
import MuiAccordion, {
    AccordionProps as MuiAccordionProps,
} from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { IconType } from "@/interfaces/Ui";
import { ChevronThinIcon } from "@/consts/customIcons";

export interface AccordionProps
    extends Omit<MuiAccordionProps, "children" | "variant"> {
    heading: string | ReactNode;
    contents: string | ReactNode;
    variant?: "underline" | "plain";
    noIndent?: boolean;
    iconLeft?: boolean;
    expandIcon?: IconType;
}

const Accordion = ({
    heading,
    contents,
    variant = "underline",
    noIndent,
    iconLeft,
    expandIcon,
    sx,
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
            <MuiAccordionDetails>{contents}</MuiAccordionDetails>
        </MuiAccordion>
    );
};

export default Accordion;
