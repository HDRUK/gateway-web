"use client";

import { SWRConfig } from "swr";

const swrProvider = ({ children }: { children: React.ReactNode }) => {
    return <SWRConfig>{children}</SWRConfig>;
};

export default swrProvider;
