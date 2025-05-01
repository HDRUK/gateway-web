"use client";

import { useTrackPreviousPage } from "@/hooks/useTrackPreviousPage";

const PageTracker = () => {
    useTrackPreviousPage();
    return null;
};

export default PageTracker;
