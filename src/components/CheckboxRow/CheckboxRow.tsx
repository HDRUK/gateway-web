import Box from "@/components/Box";
import Checkbox from "@/components/Checkbox";
import { Typography } from "@mui/material";
import { CheckboxProps } from "../Checkbox/Checkbox";

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
