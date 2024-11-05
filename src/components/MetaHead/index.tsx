import Head from "next/head";

interface MetaHeadProps {
    title: string;
    description: string;
    follow?: boolean;
}
export const MetaHead = ({
    title,
    description,
    follow = true,
}: MetaHeadProps) => (
    <Head>
        <title>{title} - Health Data Research Innovation Gateway</title>
        <meta name="description" content={description} />
        <meta name="robots" content={follow ? "index, follow" : "noindex"} />
    </Head>
);
