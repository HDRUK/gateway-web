import { useRouter } from "next/router";
import useModal from "@/hooks/useModal";
import { SpeechBubbleIcon } from "@/consts/customIcons";

// const { showModal } = useModal();
// const { push } = useRouter();

// const handleFeasabilityButton = () => {
//     showModal({
//         title: "title",
//         content: "content",
//         confirmText: "confirm text",
//         onSuccess: () => {
//             push("/");
//         },
//         showCancel: false,
//     });
// };

const menuItems = [
    {
        label: "General enquiry",
        href: "TBC",
        icon: <SpeechBubbleIcon color="primary" sx={{ mr: 1 }} />,
    },
    {
        label: "Feasibility enquiry",
        href: "TBC",
        // action: handleFeasabilityButton,
        icon: <SpeechBubbleIcon color="primary" sx={{ mr: 1 }} />,
    },
    {
        label: "Data Access Request",
        href: "TBC",
        icon: <SpeechBubbleIcon color="primary" sx={{ mr: 1 }} />,
    },
];

export default menuItems;
