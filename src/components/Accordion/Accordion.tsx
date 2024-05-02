import { ReactNode } from "react";
import { Typography } from "@mui/material";
import MuiAccordion, {
    AccordionProps as MuiAccordionProps,
} from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { ChevronThinIcon } from "@/consts/icons";

export interface AccordionProps
    extends Omit<MuiAccordionProps, "children" | "variant"> {
    heading: string | ReactNode;
    contents: string | ReactNode;
    variant?: "underline" | "plain";
}

const Accordion = ({
    heading,
    contents,
    variant = "underline",
    sx,
    ...restProps
}: AccordionProps) => {
    return (
        <MuiAccordion
            sx={{
                background: "transparent",
                boxShadow: "none",
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
                    ".MuiAccordionSummary-root, .MuiAccordionDetails-root": {
                        paddingLeft: 0,
                        paddingRight: 0,
                    },
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
                ...sx,
            }}
            {...restProps}>
            <MuiAccordionSummary
                expandIcon={
                    <ChevronThinIcon fontSize="medium" color="primary" />
                }>
                {heading}
            </MuiAccordionSummary>
            <MuiAccordionDetails>{contents}</MuiAccordionDetails>
        </MuiAccordion>
    );
};

export default Accordion;
