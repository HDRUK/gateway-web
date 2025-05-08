import Button from "@/components/Button";
import { DownloadIcon } from "@/consts/icons";
import { ButtonProps } from "../Button/Button";

type DownloadButtonProps = ButtonProps;

const DownloadButton = ({
    children,
    sx,
    ...restProps
}: DownloadButtonProps) => {
    return (
        <Button
            sx={{ marginBottom: 2, ...sx }}
            variant="link"
            startIcon={<DownloadIcon />}
            {...restProps}>
            {children}
        </Button>
    );
};

export default DownloadButton;
