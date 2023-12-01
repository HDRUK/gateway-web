/** @jsxImportSource @emotion/react */

"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { ArrowBackIosNewIcon } from "@/consts/icons";

interface BackButtonProps {
    label: string;
}

const BackButton = ({ label, ...rest }: BackButtonProps) => {
    const router = useRouter();

    return (
        <Button
            sx={{ marginBottom: 2 }}
            variant="link"
            onClick={() => router.back()}
            startIcon={<ArrowBackIosNewIcon />}
            {...rest}>
            {label}
        </Button>
    );
};

export default BackButton;
