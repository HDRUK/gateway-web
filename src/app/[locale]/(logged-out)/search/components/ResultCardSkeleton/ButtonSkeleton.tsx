import { Button, ButtonProps } from "@hdruk/ui";
import { Skeleton, SxProps, Theme } from "@mui/material";

interface ButtonSkeletonProps extends ButtonProps {
    skeletonSx?: SxProps<Theme>;
}

const ButtonSkeleton = ({
    skeletonSx,
    ...buttonProps
}: ButtonSkeletonProps) => (
    <Skeleton variant="rounded" sx={skeletonSx}>
        <Button {...buttonProps} tabIndex={-1} />
    </Skeleton>
);

export default ButtonSkeleton;
