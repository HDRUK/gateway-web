import { CancelIcon, CheckCircleIcon } from "@/consts/icons";

interface TickCrossIconProps {
    isTrue?: boolean;
}

const TickCrossIcon = ({ isTrue }: TickCrossIconProps) => {
    return isTrue ? (
        <CheckCircleIcon color="success" />
    ) : (
        <CancelIcon color="error" />
    );
};

export default TickCrossIcon;
