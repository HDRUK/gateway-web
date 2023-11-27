import { useEffect, useState } from "react";

const useDebounce = (
    value: any,
    delay: number = 500,
    minLetters: number = 3
) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        if (value.length < minLetters && value.length > 0) return;

        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
