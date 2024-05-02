const removeEmpty = <T>(items: T[]) =>
    items.filter(item => item === null || item === undefined);

export { removeEmpty };
