import { useCallback } from "react";
import { KeyedMutator } from "swr";
import { DatasetEnquiry } from "@/interfaces/Enquiry";
import { Library } from "@/interfaces/Library";
import { SearchResultDataset } from "@/interfaces/Search";
import FeasibilityEnquiryDialog from "@/modules/FeasibilityEnquiryDialog";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useDialog from "@/hooks/useDialog";

interface UseFeasibilityEnquiryProps {
    isLoggedIn: boolean;
    dataset: Pick<SearchResultDataset, "team" | "_id" | "metadata">;
    redirectPath?: string | null;
    mutateLibraries?: KeyedMutator<Library[]>;
}

const useFeasibilityEnquiry = () => {
    const { showDialog } = useDialog();

    return useCallback(
        ({
            isLoggedIn,
            dataset,
            redirectPath = "/",
            mutateLibraries,
        }: UseFeasibilityEnquiryProps) => {
            const { _id, team, metadata } = dataset;

            if (!isLoggedIn) {
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
                    teamMemberOf: team.member_of,
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
