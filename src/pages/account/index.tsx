import { GetServerSideProps } from "next";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import config from "@/config";
import { Filter } from "@/interfaces/Filter";
import { generateFilterV1 } from "@/mocks/data";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import Button from "@/components/Button";
import usePut from "@/hooks/usePut";
import useDelete from "@/hooks/useDelete";
import BoxContainer from "@/components/BoxContainer";
import Box from "@/components/Box";
import { getUserFromToken } from "@/utils/cookies";
import Pagination from "@/components/Pagination";
import { useState, useEffect } from "react";

const localeKey = "filter";
const itemName = "Filter";

function Account() {
    const [pageNumber, setPageNumber] = useState(1);

    // eslint-disable-next-line camelcase
    const { data: filters } = useGet<Filter[]>(
        `${config.filtersV1Url}?page=${pageNumber}`
    );
    const res1 = useGet(`${config.filtersV1Url}?page=${pageNumber}`);

    const createFilter = usePost<Filter>(config.filtersV1Url);

    const updateFilter = usePut<Filter>(config.filtersV1Url, {
        itemName,
    });

    const deleteFilter = useDelete(config.filtersV1Url, {
        localeKey,
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

    useEffect(() => {
        async function data1() {
            const response = await fetch(
                `${config.filtersV1Url}?page=${pageNumber}`
            ).then(res => res.json());
            if (response) console.log("fetch", response);
        }
        data1();
    }, [pageNumber]);

    const addFilter = async () => {
        const filter = generateFilterV1({ enabled: true });
        delete filter.id;
        createFilter(filter);
    };

    const update = async (id: number) => {
        const filter = generateFilterV1({ enabled: true, id, type: "course" });
        updateFilter(filter);
    };

    const deleteHandler = async (id: number) => {
        deleteFilter(id);
    };

    const paginationHandler = (_: unknown, page: number) => setPageNumber(page);
    if (res1) console.log("data", res1);

    return (
        <>
            <Head title="Health Data Research Innovation Gateway" />
            <BoxContainer
                sx={{
                    gridTemplateColumns: {
                        mobile: "repeat(1, 1fr)",
                        tablet: "repeat(5, 1fr)",
                    },
                    gap: {
                        mobile: 0,
                        tablet: 1,
                    },
                }}>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 2", laptop: "span 1" },
                    }}
                />
                <Box
                    sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                    <h2 style={{ marginBottom: "10px" }}>Filters</h2>
                    <ul style={{ marginLeft: "20px", height: "auto" }}>
                        {filters?.map(filter => (
                            <li
                                key={filter.id}
                                style={{ marginBottom: "10px" }}>
                                {filter.type}{" "}
                                <Button
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    sx={{ margin: "0 5px" }}
                                    onClick={() => update(filter.id)}>
                                    Change filter
                                </Button>
                                <Button
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    onClick={() => deleteHandler(filter.id)}>
                                    Delete
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <Button
                        color="primary"
                        onClick={() => {
                            addFilter();
                        }}>
                        Add filter
                    </Button>
                    <Pagination
                        count={3}
                        onChange={paginationHandler}
                        variant="outlined"
                        shape="rounded"
                    />
                </Box>
            </BoxContainer>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    locale,
    req,
}) => {
    return {
        props: {
            user: getUserFromToken(req.cookies),
            ...(await loadServerSideLocales(locale)),
            isProtected: true,
        },
    };
};

export default Account;
