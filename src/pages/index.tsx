import Head from "@/components/Head";
import type { GetServerSideProps } from "next";
import { loadServerSideLocales } from "@/utils/locale";

export default function Home() {
    return <Head title="Health Data Research Innovation Gateway" />;
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};
