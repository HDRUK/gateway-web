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

const localeKey = "filter";
const itemName = "Filter";

function Account() {
    const { data: filters } = useGet<Filter[]>(config.filtersV1Url);

    const createFilter = usePost<Filter>(config.filtersV1Url);

    const updateFilter = usePut<Filter>(config.filtersV1Url, {
        itemName,
    });

    const deleteFilter = useDelete(config.filtersV1Url, {
        localeKey,
        itemName,
        actions: (
            <Button
                color="error"
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

    const update = async (id: number) => {
        const filter = generateFilterV1({ enabled: true, id, type: "course" });
        updateFilter(filter);
    };

    const deleteHandler = async (id: number) => {
        deleteFilter(id);
    };

    return (
        <>
            <Head title="Health Data Research Innovation Gateway" />
            <div>
                <h2 style={{ marginBottom: "10px" }}>Filters</h2>
                <ul style={{ marginLeft: "20px" }}>
                    {filters?.map(filter => (
                        <li key={filter.id} style={{ marginBottom: "10px" }}>
                            {filter.type}{" "}
                            <Button
                                variant="text"
                                color="primary"
                                size="small"
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
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
            isProtected: true,
        },
    };
};

export default Account;
