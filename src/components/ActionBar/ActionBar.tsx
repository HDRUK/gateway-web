/** @jsxImportSource @emotion/react */

import useActionBar from "@/hooks/useActionBar";
import { ReactNode } from "react";
import * as styles from "./ActionBar.styles";

export interface ActionBarProps {
    children: ReactNode;
}

const ActionBar = () => {
    const { store } = useActionBar();
    const { component, props } = store || {};

    if (!component) return null;

    const Component = component;

    return (
        <div css={styles.root}>
            <Component {...props} />
        </div>
    );
};

export default ActionBar;
