/** @jsxImportSource @emotion/react */

import { useMemo } from "react";
import { rolesMeta } from "@/consts/roles";

import { Typography } from "@mui/material";
import * as styles from "./PermissionDescriptions.styles";

interface PermissionDescriptionsProps {
    roles: string[];
}

const PermissionDescriptions = ({ roles }: PermissionDescriptionsProps) => {
    const descriptions = useMemo(() => {
        return roles.map(role => rolesMeta[role]);
    }, [roles]);

    if (!descriptions.length) return null;

    return (
        <ul css={styles.root}>
            {descriptions.map((description, index) => {
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={index}>
                        <Typography>
                            <strong>{description.tooltipLabel}</strong>
                            {description.tooltipDescription}
                        </Typography>
                    </li>
                );
            })}
        </ul>
    );
};

export default PermissionDescriptions;
