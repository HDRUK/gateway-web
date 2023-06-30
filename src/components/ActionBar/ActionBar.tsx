/* eslint-disable react/prop-types */
/** @jsxImportSource @emotion/react */

import useActionBar from "@/hooks/useActionBar";
import * as styles from "./ActionBar.styles";
import ModalButtons from "../ModalButtons";

const ActionBar = () => {
    const { store } = useActionBar();
    const { props, name } = store;
    const {
        component,
        confirmText,
        confirmType,
        cancelText,
        onCancel,
        onSuccess,
        ...rest
    } = props;

    if (!name) return null;

    const Component = component as React.ComponentType;

    return (
        <div css={styles.root(!!component)}>
            {component && <Component {...rest} />}
            <div css={styles.ButtonWrapper}>
                <ModalButtons
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    confirmText={confirmText}
                    cancelText={cancelText}
                    confirmType={confirmType}
                />
            </div>
        </div>
    );
};

export default ActionBar;
