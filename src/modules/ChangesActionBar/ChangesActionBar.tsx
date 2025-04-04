import { ReactNode } from "react";
import Chip from "@/components/Chip";
import useActionBar from "@/hooks/useActionBar";

const ChangesActionBar = () => {
    const { store } = useActionBar();
    const { props } = store;
    // eslint-disable-next-line react/prop-types
    const { changeCount } = props as { changeCount: ReactNode };

    return (
        <div>
            <Chip label="Draft" sx={{ mr: 2 }} />
            {changeCount} changes
        </div>
    );
};

export default ChangesActionBar;
