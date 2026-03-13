import { useState } from "react";

export const useControlledAccordion = (initialExpanded: boolean) => {
    const [expanded, setExpanded] = useState(initialExpanded);

    return {
        expanded,
        onChange: (_: React.SyntheticEvent, isExpanded: boolean) =>
            setExpanded(isExpanded),
    };
};
