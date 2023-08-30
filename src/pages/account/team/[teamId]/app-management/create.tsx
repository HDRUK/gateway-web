import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import ActionBar from "@/components/ActionBar";
import CreateApp from "@/modules/AppManagement/CreateApp";
import LeftNav from "@/modules/LeftNav";

const CreateAppPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - App Registration" />
            <BoxContainer
                sx={{
                    gridTemplateColumns: {
                        mobile: "repeat(1, 1fr)",
                        tablet: "repeat(5, 1fr)",
                    },
                    gap: {
                        mobile: 0,
                        tablet: 1,
                    },
                }}>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 2", laptop: "span 1" },
                        bgcolor: "white",
                    }}>
                    <LeftNav />
                </Box>
                <Box
                    sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                    <h2 style={{ marginBottom: "10px" }}>API Management</h2>
                    <p>
                        Manage and edit your &quot;how to request access&quot;
                        information, your data access request workflows
                    </p>
                    <CreateApp />
                </Box>
            </BoxContainer>
            <ActionBar />
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default CreateAppPage;
