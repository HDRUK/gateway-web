import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import { getUserFromToken } from "@/utils/cookies";
import ActionBar from "@/components/ActionBar";
import Link from "@/components/Link";
import { useRouter } from "next/router";

const ListAppPage = () => {
    const router = useRouter();
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
                    }}>
                    <Link
                        href={`/account/team/${router.query.teamId}/app-management`}>
                        App Management
                    </Link>
                </Box>
                <Box
                    sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                    <h2 style={{ marginBottom: "10px" }}>API List</h2>
                </Box>
            </BoxContainer>
            <ActionBar />
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
            isProtected: true,
        },
    };
};

export default ListAppPage;
