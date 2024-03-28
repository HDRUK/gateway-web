"use client";

/* eslint-disable react/prop-types */
import ModalButtons from "@/components/ModalButtons";
import useActionBar from "@/hooks/useActionBar";
import { ModalButtonProps } from "../ModalButtons/ModalButtons";
import { ButtonWrapper, Wrapper } from "./ActionBar.styles";

interface ProviderProps extends ModalButtonProps {
    component: React.ComponentType<unknown>;
}

const ActionBar = () => {
    const { store } = useActionBar();
    const { props, name } = store as {
        name: string;
        props: ProviderProps;
    };
    const {
        component,
        confirmText,
        confirmType,
        cancelText,
        onCancel,
        onSuccess,
        tertiaryButton,
        formId,
        showCancel,
        ...rest
    } = props;

    if (!name) return null;

    const Component = component;

    return (
        <Wrapper hasComponent={!!component}>
            {component && <Component {...rest} />}
            <ButtonWrapper>
                <ModalButtons
                    tertiaryButton={tertiaryButton}
                    showCancel={showCancel}
                    formId={formId}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    confirmText={confirmText}
                    cancelText={cancelText}
                    confirmType={confirmType}
                />
            </ButtonWrapper>
        </Wrapper>
    );
};

export default ActionBar;
