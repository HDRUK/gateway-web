import MuiAccordion, {
    AccordionProps as MuiAccordionProps,
} from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ReactNode } from "react";

export interface AccordionProps extends Omit<MuiAccordionProps, "children"> {
    accordionHeading: string | ReactNode;
    detailContents: string;
}

const Accordion = ({
    accordionHeading,
    detailContents,
    ...rest
}: AccordionProps) => {
    return (
        <div>
            <MuiAccordion {...rest}>
                <MuiAccordionSummary
                    expandIcon={<ArrowDropDownIcon color="primary" />}>
                    {accordionHeading}
                </MuiAccordionSummary>
                <MuiAccordionDetails>
                    <Typography>{detailContents}</Typography>
                </MuiAccordionDetails>
            </MuiAccordion>
        </div>
    );
};

export default Accordion;
