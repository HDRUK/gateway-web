import { GetServerSideProps } from "next";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import apis from "@/config/apis";
import { Filter } from "@/interfaces/Filter";
import { generateFilterV1 } from "@/mocks/data";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import Button from "@/components/Button";
import usePut from "@/hooks/usePut";
import useDelete from "@/hooks/useDelete";

import Pagination from "@/components/Pagination";
import { useState, useMemo } from "react";
import FilterPagination from "@/modules/FilterPagination";
import Container from "@/components/Container";
import Box from "@/components/Box";

const localeKey = "filter";
const itemName = "Filter";

interface PaginationProps {
    lastPage: number;
    nextPageUrl: string;
    list: Filter[];
}

function Account() {
    const [pageNumber, setPageNumber] = useState(1);

    const paginationKey = useMemo(
        () => `${apis.filtersV1Url}?page=${pageNumber}`,
        [pageNumber]
    );

    const { data, isLoading } = useGet<PaginationProps>(paginationKey, {
        withPagination: true,
    });

    const { lastPage, nextPageUrl } = data || {};

    const createFilter = usePost<Filter>(apis.filtersV1Url, {
        withPagination: true,
        paginationKey,
        data,
    });

    const updateFilter = usePut<Filter>(apis.filtersV1Url, {
        itemName,
        withPagination: true,
        paginationKey,
    });

    const deleteFilter = useDelete(apis.filtersV1Url, {
        localeKey,
        withPagination: true,
        paginationKey,
        itemName,
        action: (
            <Button
                color="primary"
                size="small"
                onClick={() => console.log("call custom function")}>
                Custom action
            </Button>
        ),
    });

    const addFilter = async () => {
        const filter = generateFilterV1({ enabled: true });
        delete filter.id;
        createFilter(filter);
    };

    const update = (id: number) => {
        const filter = generateFilterV1({ enabled: true, id, type: "course" });
        updateFilter(filter);
    };

    const deleteHandler = (id: number) => {
        deleteFilter(id);
    };

    return (
        <>
            <Head title="Health Data Research Innovation Gateway" />
            <Container
                sx={{
                    gridTemplateColumns: "repeat(5, 1fr)",
                }}>
                <Box sx={{ p: 5 }}>
                    <h2 style={{ marginBottom: "10px" }}>Filters</h2>
                    <FilterPagination
                        pageUrl={paginationKey}
                        onUpdate={update}
                        onDelete={deleteHandler}
                    />
                    {nextPageUrl && (
                        <div style={{ display: "none" }}>
                            <FilterPagination pageUrl={nextPageUrl} />
                        </div>
                    )}
                    <Button
                        color="primary"
                        onClick={() => {
                            addFilter();
                        }}>
                        Add filter
                    </Button>
                    <Pagination
                        isLoading={isLoading}
                        count={lastPage}
                        onChange={(
                            e: React.ChangeEvent<unknown>,
                            page: number
                        ) => setPageNumber(page)}
                    />
                </Box>
            </Container>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default Account;
