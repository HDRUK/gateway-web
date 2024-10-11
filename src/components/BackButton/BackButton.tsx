"use client";

import { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { ArrowLeftIcon } from "@/consts/icons";

interface BackButtonProps {
    label: string;
    onClick?: () => void;
    style?: CSSProperties;
}

const BackButton = ({ label, onClick, ...rest }: BackButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <Button
            sx={{ marginBottom: 2 }}
            variant="link"
            onClick={handleClick}
            startIcon={<ArrowLeftIcon />}
            {...rest}>
            {label}
        </Button>
    );
};

export default BackButton;
