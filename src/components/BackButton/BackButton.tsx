/** @jsxImportSource @emotion/react */

import { useRouter } from "next/router";
import MuiLink from "@mui/material/Link";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import * as styles from "./BackButton.styles";

interface BackButtonProps {
    label: string;
}

const BackButton = ({ label, ...props }: BackButtonProps) => {
    const router = useRouter();

    return (
        <MuiLink
            sx={{
                verticalAlign: "middle",
            }}
            onClick={() => router.back()}
            css={styles.backButton()}
            {...props}>
            <ArrowLeftIcon />
            {label}
        </MuiLink>
    );
};

export default BackButton;
