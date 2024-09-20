function parseEncodedJSON(value?: string | null) {
    try {
        return value ? JSON.parse(value?.replace(/\\|&quot;/g, '\\"')) : value;
    } catch (_) {
        return value;
    }
}

export { parseEncodedJSON };
