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
    dataset: SearchResultDataset;
    mutateLibraries: KeyedMutator<Library[]>;
}

const useFeasibilityEnquiry = () => {
    const { showDialog } = useDialog();

    return useCallback(
        ({
            isLoggedIn,
            dataset,
            mutateLibraries,
        }: UseFeasibilityEnquiryProps) => {
            const { _id, team, metadata } = dataset;

            console.log("dataset", dataset);

            if (!isLoggedIn) {
                showDialog(ProvidersDialog, {
                    isProvidersDialog: true,
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
        []
    );
};

export default useFeasibilityEnquiry;
