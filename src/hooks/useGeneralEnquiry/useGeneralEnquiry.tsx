import { useCallback } from "react";
import { DatasetEnquiry } from "@/interfaces/Enquiry";
import { SearchResultDataset } from "@/interfaces/Search";
import GeneralEnquirySidebar from "@/modules/GeneralEnquirySidebar";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useDialog from "@/hooks/useDialog";
import usePostLoginActionCookie from "@/hooks/usePostLoginAction";
import useSidebar from "@/hooks/useSidebar";
import { PostLoginActions } from "@/consts/postLoginActions";

interface UseGeneralEnquiryProps {
    isLoggedIn: boolean;
    dataset: Pick<SearchResultDataset, "team" | "_id">;
    redirectPath?: string | null;
}

const useGeneralEnquiry = () => {
    const { showDialog } = useDialog();
    const { showSidebar } = useSidebar();
    const { setPostLoginActionCookie } = usePostLoginActionCookie({});

    return useCallback(
        ({
            isLoggedIn,
            dataset,
            redirectPath = "/",
        }: UseGeneralEnquiryProps) => {
            const { _id, team } = dataset;

            if (!isLoggedIn) {
                setPostLoginActionCookie(
                    PostLoginActions.OPEN_GENERAL_ENQUIRY,
                    {
                        dataset: {
                            datasetId: Number(_id) || null,
                            teamId: team.id,
                            teamName: team.name,
                            teamMemberOf: team.member_of,
                        },
                    }
                );
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
