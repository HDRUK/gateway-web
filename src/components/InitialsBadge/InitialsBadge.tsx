/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { useTheme } from "@emotion/react";
import * as styles from "./InitialsBadge.styles";

interface InitialsBadgeProps {
    fullName?: string;
    initials?: string;
}

const getInitials = (fullName: string) => {
    const nameArray = fullName?.split(" ");

    const firstLetter = nameArray[0] ? nameArray[0].charAt(0) : "";
    const lastLetter = nameArray[1] ? nameArray[1].charAt(0) : "";

    return `${firstLetter.toUpperCase()}${lastLetter.toUpperCase()}`;
};

const InitialsBadge = ({
    fullName = "",
    initials = "",
}: InitialsBadgeProps) => {
    const theme = useTheme();

    const generatedInitials = useMemo(() => {
        if (!fullName) return "";
        return getInitials(fullName);
    }, [fullName]);

    return (
        <div css={styles.badge(theme)}>
            <div css={styles.initials}>{initials || generatedInitials}</div>
        </div>
    );
};

export default InitialsBadge;
