import { ReactNode } from "react";
import MuiAccordion, {
    AccordionProps as MuiAccordionProps,
} from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { ChevronThinIcon } from "@/consts/icons";

export interface AccordionProps extends Omit<MuiAccordionProps, "children"> {
    heading: string | ReactNode;
    contents: string | ReactNode;
    transparent?: boolean;
}

const Accordion = ({
    heading,
    contents,
    transparent,
    sx,
    ...rest
}: AccordionProps) => {
    return (
        <MuiAccordion
            sx={{
                ...(transparent && {
                    background: "transparent",
                    boxShadow: "none",
                    "&.MuiAccordion-root.Mui-disabled": {
                        background: "transparent",
                    },
                    ".MuiAccordionSummary-root": {
                        padding: 0,
                    },
                }),
                ...sx,
            }}
            {...rest}>
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
