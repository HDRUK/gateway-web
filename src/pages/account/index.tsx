import { GetServerSideProps } from "next";
import { useTags } from "@/hooks";
import { Head } from "@/components";
import { apiService } from "@/services";
import axios from "axios";

function Account({ data }) {
    console.log("data: ", data);
    const { tags } = useTags();

    return (
        <>
            <Head title="Health Data Research Innovation Gateway" />
            <div style={{ color: "red" }}>
                <h1>My account</h1>
                <h2>Tags</h2>
                <ul>
                    {tags?.map(tag => (
                        <li key={tag.type}>{tag.type}</li>
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
