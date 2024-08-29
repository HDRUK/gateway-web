"use client";

import { useEffect } from "react";
import Button from "@/components/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    console.log("ERROR", error);

    return (
        <div>
            <h2>Something went wrong: {error.message}</h2>
            {typeof reset === "function" && (
                <Button onClick={() => reset()}>Try again</Button>
            )}
        </div>
    );
}
