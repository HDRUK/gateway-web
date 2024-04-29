import { Box, ChipProps } from "@mui/material";
import { grey } from "@mui/material/colors";
import { SearchResultCollection } from "@/interfaces/Search";
import BoxStacked from "@/components/BoxStacked";
import { BoxStackedProps } from "@/components/BoxStacked/BoxStacked";
import Chip from "@/components/Chip";

interface ResultCardProps {
    result: SearchResultCollection;
    imgUrl?: string;
    chipProps?: Omit<ChipProps, "label">;
    boxStackedProps?: BoxStackedProps;
}

const ResultCollectionCard = ({
    result,
    imgUrl,
    boxStackedProps,
    chipProps,
}: ResultCardProps) => {
    return (
        <BoxStacked
            sx={{ aspectRatio: "2.1 / 1", minHeight: "130px" }}
            {...boxStackedProps}>
            <Box
                sx={{
                    color: "white",
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "flex-end",
                    backgroundImage: `url(${
                        imgUrl ||
                        "https://fakeimg.pl/450x214/000000/909090?text=Ratio+2.1:1"
                    })`,
                    backgroundColor: "black",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
                <Chip
                    role="heading"
                    aria-level={3}
                    // eslint-disable-next-line no-underscore-dangle
                    label={result.name}
                    size="small"
                    sx={{
                        backgroundColor: grey["600"],
                        color: "#fff",
                        maxWidth: "220px",
                    }}
                    {...chipProps}
                />
            </Box>
        </BoxStacked>
    );
};

export default ResultCollectionCard;
