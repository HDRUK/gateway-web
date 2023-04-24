import { GetServerSideProps } from "next";
import useTags from "@/hooks/useTags";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import config from "@/config";
import { createTag } from "@/services/tags";

function Account() {
    const { tags, mutate } = useTags();

    const addTag = async () => {
        const payload = {
            type: "features",
        };
        await createTag(payload);
        console.log("I will mutate");
        mutate(config.tagsV1Url);
    };

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
                <button
                    onClick={() => {
                        addTag();
                    }}>
                    Add tag
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
