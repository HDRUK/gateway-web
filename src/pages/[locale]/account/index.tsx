import { GetServerSideProps } from "next";
import Head from "@/components/Head";
import messages from "@/config/messages/en.json";
import BoxContainer from "@/components/BoxContainer";
import Box from "@/components/Box";

function Account() {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway" />
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
                    }}
                />
                <Box
                    sx={{
                        gridColumn: { tablet: "span 3", laptop: "span 4" },
                    }}>
                    <h2>My account</h2>
                </Box>
            </BoxContainer>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            messages,
        },
    };
};

export default Account;
