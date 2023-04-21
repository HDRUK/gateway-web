import { GetServerSideProps } from "next";
import useTags from "@/hooks/useTags";
import Head from "@/components/Head";
/** 
     * Commenting out until connection with Laravel is resolved
     * 
    import { getRequest } from "@/services/api";
    import axios from "axios";
*/

function Account() {
    const { tags } = useTags();

    return (
        <>
            <Head title="Health Data Research Innovation Gateway" />
            <div>
                <h1 style={{ marginBottom: "10px" }}>My account</h1>
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    /** 
     * Commenting out until connection with Laravel is resolved
     * 
    const res = await axios.get("http://localhost:8000/api/status", {
        withCredentials: true,
        headers: {
            Cookie: req.headers.cookie,
        },
    });
    const data = await res.data;
     */
    return {
        props: {
            // data,
            isProtected: true,
        },
    };
};

export default Account;
