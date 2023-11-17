import Box from "@/components/Box";
import { Dataset } from "@/interfaces/Dataset";
import DatasetCard from "@/components/DatasetCard";
import Pagination from "@/components/Pagination";
import ShowingXofX from "@/components/ShowingXofX";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import { IconType } from "@/interfaces/Ui";

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
    isLoading,
}: DatasetTabProps) => {
    if (isLoading) return <Loading />;
    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ p: 0 }}>
                <ShowingXofX from={from} to={to} total={total} />
            </Box>
            {(list || [])?.map(dataset => (
                <DatasetCard
                    actions={actions}
                    key={dataset.id}
                    dataset={dataset}
                />
            ))}
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
