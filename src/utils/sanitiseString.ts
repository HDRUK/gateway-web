export const sanitiseString = (name: string) => {
    return name
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/[^a-zA-Z0-9.\-_]/g, "") // Remove invalid characters
        .replace(/-+/g, "-"); // Collapse multiple hyphens
};
