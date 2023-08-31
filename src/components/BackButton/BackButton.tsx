/** @jsxImportSource @emotion/react */

import { useRouter } from "next/router";
import Button from "@/components/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

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
