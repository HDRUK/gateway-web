import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { SearchResultCollection } from "@/interfaces/Search";
import BoxStacked from "@/components/BoxStacked";
import Chip from "@/components/Chip";

interface ResultCardProps {
    result: SearchResultCollection;
}

const ResultCollectionCard = ({ result }: ResultCardProps) => {
    return (
        <BoxStacked sx={{ aspectRatio: "2.1 / 1", minHeight: "130px" }}>
            <Box
                sx={{
                    color: "white",
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "flex-end",
                    backgroundImage:
                        "url(https://fakeimg.pl/450x214/000000/909090?text=Ratio+2.1:1)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
                <Chip
                    // eslint-disable-next-line no-underscore-dangle
                    label={result._source.name}
                    size="small"
                    sx={{
                        backgroundColor: grey["600"],
                        color: "#fff",
                        maxWidth: "220px",
                    }}
                />
            </Box>
        </BoxStacked>
    );
};

export default ResultCollectionCard;
