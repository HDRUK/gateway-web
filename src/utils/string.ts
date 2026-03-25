const toTitleCase = (value: string) => {
    return value.replace(/\w\S*/g, (data: string) => {
        return data.charAt(0).toUpperCase() + data.substr(1).toLowerCase();
    });
};

const getLastSplitPart = (input: string, delimiter: string): string => {
    const parts = input.split(delimiter);
    return parts[parts.length - 1];
};

const getShortenedText = (text: string, characterLimit: number) => {
    return text.length > characterLimit
        ? `${text.slice(0, characterLimit)}...`
        : text;
};

export { toTitleCase, getLastSplitPart, getShortenedText };
