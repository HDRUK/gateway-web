import { GetServerSideProps } from "next";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import config from "@/config";
import { Filter } from "@/interfaces/Filter";
import { generateFilterV1 } from "@/mocks/data";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";

function Account() {
    const { data: filters } = useGet<Filter[]>(config.filtersV1Url);
    const createFilter = usePost<Filter>(config.filtersV1Url);

    const addFilter = async () => {
        const filter = generateFilterV1({ enabled: true });
        delete filter.id;
        createFilter(filter);
    };

    return (
        <>
            <Head title="Health Data Research Innovation Gateway" />
            <div>
                <h2 style={{ marginBottom: "10px" }}>Filters</h2>
                <ul style={{ marginLeft: "20px" }}>
                    {filters?.map(filter => (
                        <li key={filter.id}>{filter.type}</li>
                    ))}
                </ul>
                <button
                    onClick={() => {
                        addFilter();
                    }}>
                    Add filter
                </button>
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
