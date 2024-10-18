import { useCallback } from "react";
import { DatasetEnquiry } from "@/interfaces/Enquiry";
import { SearchResultDataset } from "@/interfaces/Search";
import GeneralEnquirySidebar from "@/modules/GeneralEnquirySidebar";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useDialog from "@/hooks/useDialog";
import useSidebar from "@/hooks/useSidebar";

interface UseGeneralEnquiryProps {
    isLoggedIn: boolean;
    dataset: Pick<SearchResultDataset, "team" | "_id">;
    redirectPath?: string | null;
}

const useGeneralEnquiry = () => {
    const { showDialog } = useDialog();
    const { showSidebar } = useSidebar();

    return useCallback(
        ({
            isLoggedIn,
            dataset,
            redirectPath = "/",
        }: UseGeneralEnquiryProps) => {
            const { _id, team } = dataset;

            if (!isLoggedIn) {
                showDialog(ProvidersDialog, {
                    isProvidersDialog: true,
                    redirectPath,
                });
            } else {
                const datasets: DatasetEnquiry[] = [
                    {
                        datasetId: Number(_id) || null,
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
        },
        [showSidebar, showDialog]
    );
};

export default useGeneralEnquiry;
