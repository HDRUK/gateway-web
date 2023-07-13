import Box from "@/components/Box";
import Button from "@/components/Button";
import { Divider, Typography } from "@mui/material";
import { Control } from "react-hook-form";

interface DeleteApplicationProps {
    control: Control;
}

const DeleteApplication = ({ control }: DeleteApplicationProps) => {
    return (
        <Box sx={{ padding: 0 }}>
            <Divider />
            <Typography
                component="span"
                sx={{
                    fontWeight: "normal",
                    paddingTop: 2,
                }}>
                Delete this app
            </Typography>
            <Typography component="span" sx={{ marginTop: 1, marginBottom: 4 }}>
                Permanently delete this app from your management page. This act is irreversible.
                <Box
                    sx={{
                        p: 0,
                        display: "flex",
                        justifyContent: "end",
                    }}>
                    <Button type="submit" variant="outlined">
                        Delete App
                    </Button>
                </Box>
            </Typography>
        </Box>
    );
};

export default DeleteApplication;