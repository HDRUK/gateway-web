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
import { useState } from "react";

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
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    filterTitle,
    setFilterTitle,
    isLoading,
}: DatasetTabProps) => {
    //handle for the select filter box
    const { handleSubmit, control } = useForm({
        defaultValues: { sortField: sortField },
        //reValidateMode: "onChange",
        //mode: "onChange",
    });

    const onChangeSortField = (e: React.ChangeEvent<unknown>) => {
        const value = e.target.value;
        const [option] = sortByOptions.filter(o => o.value === value);
        setSortDirection(option.defaultDirection);
        setSortField(option.value);
    };

    const onChangeSortDirection = (e: React.ChangeEvent<unknown>) => {
        setSortDirection(sortDirection == "desc" ? "asc" : "desc");
    };

    //handle a change to the TextField box initially and change the current query
    const handleSearchChange = (e: React.ChangeEvent<unknown>) => {
        setFilterTitle(e.target.value);
    };

    return (
        <Box sx={{ p: 0 }}>
            <BoxContainer
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <Box sx={{ minWidth: "70%" }}>
                    <Box sx={{ p: 0 }}>
                        <TextField
                            sx={{
                                width: "100%",
                                padding: 0,
                                "& .MuiInputBase-root": {
                                    padding: 0, // Adjust the padding as needed
                                },
                            }}
                            variant="outlined"
                            name="searchTitle"
                            id="searchTitle"
                            placeholder="search titles"
                            value={filterTitle}
                            onChange={handleSearchChange}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ p: 0, minWidth: "250px" }}>
                        <Select
                            onChange={onChangeSortField}
                            control={control}
                            options={sortByOptions}
                            label=""
                            value={sortField}
                            name="sortField"
                        />
                    </Box>
                    <Box sx={{ p: 0 }}>
                        <Button
                            sx={{ marginBottom: 2 }}
                            variant="link"
                            onClick={onChangeSortDirection}>
                            {sortDirection == "asc" ? (
                                <SortAscIcon color="primary" fontSize="large" />
                            ) : (
                                <SortDescIcon
                                    color="primary"
                                    fontSize="large"
                                />
                            )}
                        </Button>
                    </Box>
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
