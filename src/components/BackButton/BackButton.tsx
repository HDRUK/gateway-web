/** @jsxImportSource @emotion/react */

import { useRouter } from "next/router";
import Button from "@/components/Button";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import * as styles from "./BackButton.styles";

interface BackButtonProps {
    label: string;
}

const BackButton = ({ label, ...props }: BackButtonProps) => {
    const router = useRouter();

    return (
        <Button
            sx={{
                verticalAlign: "middle",
            }}
            variant="link"
            onClick={() => router.back()}
            css={styles.backButton()}
            {...props}>
            <ArrowLeftIcon />
            {label}
        </Button>
    );
};

export default BackButton;
