import MuiAccordion, {
    AccordionProps as MuiAccordionProps,
} from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ReactNode } from "react";

export interface AccordionProps extends Omit<MuiAccordionProps, "children"> {
    heading: string | ReactNode;
    contents: string | ReactNode;
}

const Accordion = ({ heading, contents, ...rest }: AccordionProps) => {
    return (
        <MuiAccordion {...rest}>
            <MuiAccordionSummary
                expandIcon={<ArrowDropDownIcon color="primary" />}>
                {heading}
            </MuiAccordionSummary>
            <MuiAccordionDetails>{contents}</MuiAccordionDetails>
        </MuiAccordion>
    );
};

export default Accordion;
