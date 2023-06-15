import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import { getUserFromToken } from "@/utils/cookies";
import Tabs from "@/components/Tabs";
import { useState } from "react";
import Container from "@/components/Container";

const Releases = () => {
    const [selectedTab, setSelectedTab] = useState("2023");

    const tabs = [
        {
            label: "2023",
            value: "2023",
            content: <div>2023 content</div>,
        },
        {
            label: "2022",
            value: "2022",
            content: <div>2022 content</div>,
        },
        {
            label: "2021",
            value: "2021",
            content: <div>2021 content</div>,
        },
        {
            label: "2020",
            value: "2020",
            content: <div>2020 content</div>,
        },
    ];

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - About - Releases" />
            <Container sx={{ background: "white" }}>
                <Tabs
                    centered
                    value={selectedTab}
                    onChange={handleTabChange}
                    tabs={tabs}
                />
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    req,
    locale,
}) => {
    return {
        props: {
            user: getUserFromToken(req.cookies),
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default Releases;
