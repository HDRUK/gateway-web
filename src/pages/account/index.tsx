import { GetServerSideProps } from "next";
import useTags from "@/hooks/useTags";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";

function Account() {
    const { tags } = useTags();

    return (
        <>
            <Head title="Health Data Research Innovation Gateway" />
            <div>
                <h2 style={{ marginBottom: "10px" }}>Tags</h2>
                <ul style={{ marginLeft: "20px" }}>
                    {tags?.map(tag => (
                        <li key={tag.id}>{tag.type}</li>
                    ))}
                </ul>
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
