function toTitleCase(value: string) {
    return value.replace(/\w\S*/g, (data: string) => {
        return data.charAt(0).toUpperCase() + data.substr(1).toLowerCase();
    });
}

export { toTitleCase };
