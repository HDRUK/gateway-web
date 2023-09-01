import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import LeftNav from "@/modules/LeftNav";
import { ReactNode } from "react";

interface AccountLayoutProps {
    children: ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
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
                    bgcolor: "white",
                }}>
                <LeftNav />
            </Box>
            <Box sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                {children}
            </Box>
        </BoxContainer>
    );
};

export default AccountLayout;
