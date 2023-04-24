import { GetServerSideProps } from "next";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import config from "@/config";
import { createFilter } from "@/services/filters";
import useFilters from "@/hooks/useFilters";

function Account() {
    const { filters, mutate } = useFilters();

    const addFilter = async () => {
        const payload = {
            type: "features",
            enabled: true,
            value: "features",
            keys: "features",
        };
        await createFilter(payload);
        console.log("I will mutate");
        mutate(config.filtersV1Url);
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
