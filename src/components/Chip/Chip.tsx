import MuiChip, { ChipProps as MuiChipProps } from "@mui/material/Chip";

export interface ChipProps extends MuiChipProps {
    label: string;
}

const Chip = ({ label, ...rest }: ChipProps) => {
    return <MuiChip label={label} {...rest} />;
};

export default Chip;
