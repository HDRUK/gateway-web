import { Button, ButtonProps } from "@hdruk/ui";
import { DownloadIcon } from "@/consts/icons";

export type DownloadButtonProps = ButtonProps;

const DownloadButton = ({
    children,
    sx,
    ...restProps
}: DownloadButtonProps) => {
    return (
        <Button
            sx={{ marginBottom: 2, ...sx }}
            purpose={restProps.purpose ?? "link"}
            startIcon={<DownloadIcon />}
            {...restProps}>
            {children}
        </Button>
    );
};

export default DownloadButton;
