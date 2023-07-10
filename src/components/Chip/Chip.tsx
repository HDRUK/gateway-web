import Chip, { ChipProps } from "@mui/material/Chip";

interface ChipComponentProps extends ChipProps {
    label: string;
}

const ChipComponent = ({ label, ...rest }: ChipComponentProps) => {
    return <Chip label={label} {...rest} />;
};

export default ChipComponent;
