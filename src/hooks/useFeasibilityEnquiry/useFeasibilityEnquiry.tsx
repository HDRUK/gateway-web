import { useCallback } from "react";
import { KeyedMutator } from "swr";
import { DatasetEnquiry } from "@/interfaces/Enquiry";
import { Library } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import FeasibilityEnquiryDialog from "@/modules/FeasibilityEnquiryDialog";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useDialog from "@/hooks/useDialog";
import usePostLoginActionCookie from "@/hooks/usePostLoginAction";
import { PostLoginActions } from "@/consts/postLoginActions";

interface UseFeasibilityEnquiryProps {
    isLoggedIn: boolean;
    dataset: Pick<SearchResultDataset, "team" | "_id" | "metadata">;
    redirectPath?: string | null;
    mutateLibraries?: KeyedMutator<Library[]>;
}

const useFeasibilityEnquiry = () => {
    const { showDialog } = useDialog();
    const { setPostLoginActionCookie } = usePostLoginActionCookie({});

    return useCallback(
        ({
            isLoggedIn,
            dataset,
            redirectPath = "/",
            mutateLibraries,
        }: UseFeasibilityEnquiryProps) => {
            const { _id, team, metadata } = dataset;
            console.log("dataset", dataset);
            if (!isLoggedIn) {
                console.log("useFeasibilityEnquiry not isLoggedIn");
                const result = dataset;
                console.log("result", result);
                setPostLoginActionCookie(
                    PostLoginActions.OPEN_FEASIBILITY_ENQUIRY,
                    {
                        dataset: {
                            datasetId: Number(_id),
                            name: metadata.summary.title,
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
                const dataset2: DatasetEnquiry = {
                    datasetId: Number(_id),
                    name: metadata.summary.title,
                    teamId: team.id,
                    teamName: team.name,
                    teamMemberOf: team.member_of,
                };

                showDialog(FeasibilityEnquiryDialog, {
                    result: dataset2,
                    mutateLibraries,
                });
            }
        },
        [showDialog]
    );
};

export default useFeasibilityEnquiry;
