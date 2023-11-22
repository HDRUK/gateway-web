import Box from "@/components/Box";
import { Dataset } from "@/interfaces/Dataset";
import DatasetCard from "@/components/DatasetCard";
import Pagination from "@/components/Pagination";
import ShowingXofX from "@/components/ShowingXofX";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Select from "@/components/Select";
import { IconType } from "@/interfaces/Ui";
import BoxContainer from "@/components/BoxContainer";
import { useForm } from "react-hook-form";
import { SortIcon, NorthIcon } from "@/consts/icons";

interface SortByOption {
    label: string;
    value: string;
    defaultDirection: string;
}

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
    sortByOptions: SortByOption[];
    sortField: string;
    setSortField: (field: string) => void;
    sortDirection: string;
    setSortDirection: (direction: string) => void;
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
    sortByOptions,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    isLoading,
}: DatasetTabProps) => {
    const { handleSubmit, control } = useForm({
        //...(props.required && { resolver: yupResolver(validationSchema) }),
        defaultValues: { sortField: sortField },
        reValidateMode: "onChange",
        mode: "all",
    });

    const onChangeSortField = (e: unknown) => {
        setSortField(e.target.value);
    };

    if (isLoading) return <Loading />;
    return (
        <Box sx={{ p: 0 }}>
            <BoxContainer
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <Box> search here....</Box>
                <Box sx={{ minWidth: "250px", display: "flex", gap: 1 }}>
                    <Select
                        onChange={onChangeSortField}
                        control={control}
                        options={sortByOptions}
                        label=""
                        value={sortField}
                        name="sortField"
                    />
                    <NorthIcon />
                    <SortIcon />
                </Box>
            </BoxContainer>

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
