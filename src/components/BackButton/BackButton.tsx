"use client";

import { CSSProperties } from "react";
import { SxProps } from "@mui/material";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { getPreviousPage } from "@/hooks/useTrackPreviousPage";
import { ArrowBackIosNewIcon } from "@/consts/icons";

interface BackButtonProps {
    label: string;
    onClick?: () => void;
    style?: CSSProperties;
    buttonSx?: SxProps;
}

const BackButton = ({ label, onClick, buttonSx, ...rest }: BackButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        const previousPage = getPreviousPage();

        if (previousPage) {
            router.back();
        } else if (onClick) {
            onClick();
        }
    };

    // Hide button if there's no way to go back
    if (!onClick && !getPreviousPage()) {
        return null;
    }

    return (
        <Button
            sx={{ marginBottom: 2, ...buttonSx }}
            variant="link"
            onClick={handleClick}
            startIcon={<ArrowBackIosNewIcon />}
            {...rest}>
            {label}
        </Button>
    );
};

export default BackButton;
