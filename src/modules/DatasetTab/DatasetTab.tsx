import Box from "@/components/Box";
import { Dataset } from "@/interfaces/Dataset";
import DatasetCard from "@/components/DatasetCard";
import Pagination from "@/components/Pagination";
import ShowingXofX from "@/components/ShowingXofX";
import Paper from "@/components/Paper";
import Select from "@/components/Select";
import Button from "@/components/Button";
import TextField from "@mui/material/TextField";
import { IconType } from "@/interfaces/Ui";
import BoxContainer from "@/components/BoxContainer";
import { useForm } from "react-hook-form";
import { SortAscIcon, SortDescIcon } from "@/consts/icons";

interface SortByOption {
    label: string;
    value: string;
    direction: string;
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
    sort: SortByOption;
    setSort: (field: SortByOption) => void;
    filterTitle: string;
    setFilterTitle: (title: string) => void;
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
    sort,
    setSort,
    filterTitle,
    setFilterTitle,
    isLoading,
}: DatasetTabProps) => {
    //handle for the select filter box
    const { control } = useForm({
        defaultValues: { sortField: sort.value },
    });

    const onChangeSortField = (e: React.ChangeEvent<unknown>) => {
        const value = e.target.value;
        const [option] = sortByOptions.filter(o => o.value === value);
        setSort(option);
    };

    const onChangeSortDirection = (e: React.ChangeEvent<unknown>) => {
        const updatedSort = {
            ...sort,
            direction: sort.direction === "desc" ? "asc" : "desc",
        };
        setSort(updatedSort);
    };

    //handle a change to the TextField box initially and change the current query
    const handleSearchChange = (e: React.ChangeEvent<unknown>) => {
        setFilterTitle(e.target.value);
    };

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
                    <TextField
                        sx={{
                            width: "100%",
                            mb: "16px",
                        }}
                        size="small"
                        variant="outlined"
                        name="searchTitle"
                        id="searchTitle"
                        placeholder="Search titles"
                        value={filterTitle}
                        onChange={handleSearchChange}
                    />
                </Box>
                <BoxContainer
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box sx={{ p: 0 }}>
                        <Select
                            sx={{
                                minWidth: "200px",
                            }}
                            onChange={onChangeSortField}
                            control={control}
                            options={sortByOptions}
                            label=""
                            value={sort.value}
                            name="sortField"
                        />
                    </Box>
                    <Box sx={{ p: 0 }}>
                        <Button
                            sx={{ marginBottom: 2 }}
                            variant="link"
                            onClick={onChangeSortDirection}>
                            {sort.direction == "asc" ? (
                                <SortAscIcon color="primary" fontSize="large" />
                            ) : (
                                <SortDescIcon
                                    color="primary"
                                    fontSize="large"
                                />
                            )}
                        </Button>
                    </Box>
                </BoxContainer>
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
