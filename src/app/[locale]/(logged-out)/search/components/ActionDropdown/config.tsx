import { SpeechBubbleIcon } from "@/consts/customIcons";
import FeasibilityEnquiryDialog from "@/modules/FeasibilityEnquiryDialog";

const menuItems = [
    {
        label: "General enquiry",
        href: "TBC",
        icon: <SpeechBubbleIcon color="primary" sx={{ mr: 1 }} />,
    },
    {
        label: "Feasibility enquiry",
        dialog: FeasibilityEnquiryDialog,
        icon: <SpeechBubbleIcon color="primary" sx={{ mr: 1 }} />,
    },
    {
        label: "Data Access Request",
        href: "TBC",
        icon: <SpeechBubbleIcon color="primary" sx={{ mr: 1 }} />,
    },
];

export default menuItems;
