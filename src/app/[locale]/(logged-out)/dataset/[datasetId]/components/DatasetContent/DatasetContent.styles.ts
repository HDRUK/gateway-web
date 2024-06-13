import { styled } from "@mui/material";
import Box from "@/components/Box";
import Chip from "@/components/Chip";

export const ObservationTableWrapper = styled(Box)(({ theme }) => ({
    padding: 0,
    border: `1px solid ${theme.palette.greyCustom.main}`,
    overflowX: "scroll",
}));

export const DatasetFieldWrapper = styled(Box)(() => ({
    padding: 0,
    gap: 1,
    display: "flex",
    flexWrap: "wrap",
}));

export const DatasetFieldItem = styled(Chip)(() => ({
    textOverflow: "ellipsis",
    maxWidth: 200,
    overflow: "hidden",
    whiteSpace: "nowrap",
    marginBottom: "4px",
}));
