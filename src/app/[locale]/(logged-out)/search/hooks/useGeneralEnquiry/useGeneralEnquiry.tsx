import { useCallback } from "react";
import { DatasetEnquiry } from "@/interfaces/Enquiry";
import { SearchResultDataset } from "@/interfaces/Search";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useDialog from "@/hooks/useDialog";
import useSidebar from "@/hooks/useSidebar";
import GeneralEnquirySidebar from "../../components/GeneralEnquirySidebar";

interface UseGeneralEnquiryProps {
    isLoggedIn: boolean;
    dataset: SearchResultDataset;
}

const useGeneralEnquiry = () => {
    const { showDialog } = useDialog();
    const { showSidebar } = useSidebar();

    return useCallback(({ isLoggedIn, dataset }: UseGeneralEnquiryProps) => {
        const { _id, team } = dataset;

        if (!isLoggedIn) {
            showDialog(ProvidersDialog, {
                isProvidersDialog: true,
            });
        } else {
            const datasets: DatasetEnquiry[] = [
                {
                    datasetId: Number(_id),
                    teamId: team.id,
                    teamName: team.name,
                    teamMemberOf: team.member_of,
                },
            ];

            showSidebar({
                title: "Messages",
                content: <GeneralEnquirySidebar datasets={datasets} />,
            });
        }
    }, []);
};

export default useGeneralEnquiry;
