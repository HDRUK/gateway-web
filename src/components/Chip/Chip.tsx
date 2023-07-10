import Chip from "@mui/material/Chip";

interface ChipProps {
    label: string;
}

const ChipComponent = ({ label, ...rest }: ChipProps) => {
    return <Chip label={label} {...rest} />;
};

export default ChipComponent;
