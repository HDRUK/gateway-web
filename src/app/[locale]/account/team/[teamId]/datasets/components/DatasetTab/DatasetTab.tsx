import Box from "@/components/Box";
import { Dataset } from "@/interfaces/Dataset";
import DatasetCard from "@/components/DatasetCard";
import Pagination from "@/components/Pagination";
import ShowingXofX from "@/components/ShowingXofX";
import Paper from "@/components/Paper";
import { IconType } from "@/interfaces/Ui";
import BoxContainer from "@/components/BoxContainer";
import {
    searchFilter,
    sortField,
    toggleDirection,
} from "@/config/forms/datasetAccountSearch";
import InputWrapper from "@/components/InputWrapper";
import { Control } from "react-hook-form";
import DownloadCSV from "../DownloadCSV";

interface DatasetTabProps {
    list?: Dataset[];
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
    lastPage?: number;
    from?: number;
    to?: number;
    control: Control;
    total?: number;
    label: string;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    isLoading: boolean;
}

const DatasetTab = ({
    actions,
    list,
    label,
    lastPage,
    from,
    to,
    total,
    currentPage,
    setCurrentPage,
    control,
    isLoading,
}: DatasetTabProps) => {
    return (
        <Box sx={{ p: 0 }}>
            <BoxContainer
                sx={{
                    my: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <Box sx={{ p: 0, width: "50%" }}>
                    <InputWrapper control={control} {...searchFilter} />
                </Box>
                <BoxContainer
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box sx={{ p: 0 }}>
                        <InputWrapper control={control} {...sortField} />
                    </Box>
                    <Box sx={{ p: 0 }}>
                        <InputWrapper control={control} {...toggleDirection} />
                    </Box>
                </BoxContainer>
            </BoxContainer>

            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <ShowingXofX from={from} to={to} total={total} />
                <DownloadCSV />
            </Box>

            {(list || [])
                .map(dataset => (
                    <DatasetCard
                        actions={actions}
                        key={dataset.id}
                        dataset={dataset}
                    />
                ))
                .filter(dataset => !!dataset)}
            {list?.length === 0 && (
                <Paper sx={{ p: 2, mb: 2 }}>
                    No {label.toLowerCase()} datasets found on the Gateway for
                    your team.
                </Paper>
            )}
            <Pagination
                isLoading={isLoading}
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
            />
        </Box>
    );
};

export default DatasetTab;
