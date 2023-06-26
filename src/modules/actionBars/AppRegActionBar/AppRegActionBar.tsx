import ModalButtons from "@/components/ModalButtons";
import useActionBar from "@/hooks/useActionBar";
import * as React from "react";

interface Props {
    status: string;
    text: number;
    onSuccess: () => void;
}

const AppRegActionBar = () => {
    const { store, hideBar } = useActionBar();
    const { props } = store;
    const { status, text, onSuccess } = props as unknown as Props;

    return (
        <>
            <div>
                {/* todo: Create chip component */}
                <span
                    style={{
                        background: "#D0D3D4",
                        borderRadius: "14px",
                        padding: "5px 12px",
                        marginRight: "10px",
                    }}>
                    {status}
                </span>
                {text}
            </div>
            <div
                style={{
                    display: "inline-flex",
                    flexWrap: "wrap",
                    gap: "12px",
                }}>
                <ModalButtons
                    cancelText="Discard"
                    confirmText="Save"
                    onCancel={() => hideBar()}
                    onSuccess={onSuccess}
                />
            </div>
        </>
    );
};

export default AppRegActionBar;
