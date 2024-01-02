import { useTranslations } from "next-intl";
import BoxContainer from "@/components/BoxContainer";
import Box from "@/components/Box";
import { ACCOUNT, PAGES, TITLE } from "@/consts/translation";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account",
    description: "",
};

function AccountHome() {
    const t = useTranslations(`${PAGES}.${ACCOUNT}`);

    return (
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
                <h2>{t(TITLE)}</h2>
            </Box>
        </BoxContainer>
    );
}

export default AccountHome;
