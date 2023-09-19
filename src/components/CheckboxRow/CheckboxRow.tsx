import Box from "@/components/Box";
import Checkbox, { CheckboxProps } from "@/components/Checkbox/Checkbox";
import { Typography } from "@mui/material";

export interface CheckboxRowProps extends CheckboxProps {
    title: string;
}

const CheckboxRow = ({ title, ...rest }: CheckboxRowProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}>
            <Typography sx={{ width: "100px" }}>{title}</Typography>
            <Checkbox formControlSx={{ marginBottom: 0 }} {...rest} />
        </Box>
    );
};

export default CheckboxRow;
