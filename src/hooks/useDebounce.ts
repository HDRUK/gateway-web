import { useEffect, useState } from "react";

const useDebounce = (value: string, delay = 500, minLetters = 3) => {
    const [debouncedValue, setDebouncedValue] = useState(value || "");

    useEffect(() => {
        if (value.length < minLetters && value.length > 0) return undefined;

        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay, minLetters]);

    return debouncedValue;
};

export default useDebounce;
