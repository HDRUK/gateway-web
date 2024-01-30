import { cookies } from "next/headers";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import { getFilters } from "@/utils/api";
import FilterPanel from "./components/FilterPanel";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Search",
    description: "",
};

const SearchPage = async () => {
    const cookieStore = cookies();
    const filters = await getFilters(cookieStore);
    return (
        <div>
            <BoxContainer
                sx={{
                    gridTemplateColumns: {
                        mobile: "repeat(1, 1fr)",
                        tablet: "repeat(7, 1fr)",
                    },
                    gap: {
                        mobile: 0,
                        tablet: 1,
                    },
                }}>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 2", laptop: "span 2" },
                    }}>
                    <FilterPanel filters={filters} />
                </Box>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 5", laptop: "span 5" },
                    }}
                />
            </BoxContainer>
        </div>
    );
};

export default SearchPage;
