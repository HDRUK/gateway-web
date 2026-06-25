"use client";

import { SWRConfig } from "swr";

const swrProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SWRConfig value={{ revalidateOnFocus: false, revalidateOnReconnect: false }}>
            {children}
        </SWRConfig>
    );
};

export default swrProvider;
