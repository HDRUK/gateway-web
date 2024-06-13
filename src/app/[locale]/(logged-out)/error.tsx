"use client";

import { useEffect } from "react";
import Button from "@/components/Button";
import Container from "@/components/Container";

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

    return (
        <Container sx={{ padding: 10 }}>
            <h2>Something went wrong: {error.message}</h2>
            {typeof reset === "function" && (
                <Button onClick={() => reset()}>Try again</Button>
            )}
        </Container>
    );
}
