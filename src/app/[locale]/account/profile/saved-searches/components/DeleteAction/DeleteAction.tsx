import { Box } from "@mui/material";
import { DeleteForeverIcon } from "@/consts/icons";

export default function DeleteAction({ onDelete, id }) {
    return (
        <Box
            sx={{
                pl: 1,
                display: "flex",
                alignItems: "center",
                height: "45px",
                borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                borderLeftColor: "primary.main",
            }}>
            <DeleteForeverIcon
                color="primary"
                onClick={() => onDelete(id)}
                role="button"
            />
        </Box>
    );
}
