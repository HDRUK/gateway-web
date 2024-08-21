import ProvidersDialog from "@/modules/ProvidersDialog";
// import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import useSidebar from "@/hooks/useSidebar";
import GeneralEnquirySidebar from "../../../dataset/[datasetId]/components/GeneralEnquirySidebar";

const genEnq = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log('genEnq started2');
    const { isLoggedIn } = useAuth();
    const { showDialog } = useDialog();
    const { showSidebar } = useSidebar();

    if (!true) {
        showDialog(ProvidersDialog, {
            isProvidersDialog: true,
        });
    } else {
        showSidebar({
            title: "Messages",
            content: (
                <GeneralEnquirySidebar
                    teamId={42}
                    teamName={"name"}
                    teamMemberOf={"member"}
                />
            ),
        });
    }
    console.log('genEnq ended');
};

const menuItems = [
    {
        label: "General enquiry",
        action: genEnq,
    },
    {
        label: "Feasibility enquiry",
        href: "TBC",
    },
    {
        label: "Data Access Request",
        href: "TBC",
    },
];

export default menuItems;
