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

            if (!isLoggedIn) {
                setPostLoginActionCookie(
                    PostLoginActions.OPEN_FEASIBILITY_ENQUIRY,
                    {
                        dataset: {
                            datasetId: Number(_id),
                            name: metadata.summary.title,
                            teamId: team.id,
                            teamName: team.name,
                        },
                    }
                );

                showDialog(ProvidersDialog, {
                    isProvidersDialog: true,
                    redirectPath,
                });
            } else {
                const dataset: DatasetEnquiry = {
                    datasetId: Number(_id),
                    name: metadata.summary.title,
                    teamId: team.id,
                    teamName: team.name,
                };

                showDialog(FeasibilityEnquiryDialog, {
                    result: dataset,
                    mutateLibraries,
                });
            }
        },
        [showDialog]
    );
};

export default useFeasibilityEnquiry;
