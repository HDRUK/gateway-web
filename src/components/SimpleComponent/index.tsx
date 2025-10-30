"use client";

import { useState } from "react";
import { Button } from "@mui/material";

export const SimpleComponent = ({ datasets, collectino }) => {
    const [value, setValue] = useState(0);

    return (
        <ThemeRegistry>
            <Button onClick={() => setValue(prev => prev - 1)}>deduct</Button>
            {value}
            <Button onClick={() => setValue(prev => prev + 1)}>add</Button>
        </ThemeRegistry>
    );
};
