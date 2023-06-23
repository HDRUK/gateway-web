import useActionBar from "@/hooks/useActionBar";
import { ReactNode } from "react";

export interface ActionBarProps {
    children: ReactNode;
}

const ActionBar = () => {
    const { store } = useActionBar();
    const { component, props } = store || {};

    if (!component) return null;

    const Component = component;

    return (
        <div style={{ border: "red 1px solid" }}>
            <Component {...props} />
        </div>
    );
};

export default ActionBar;
