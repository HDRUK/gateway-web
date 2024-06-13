const createArrayOfLength = (length: number) =>
    Array.from({ length })
        .map((v, index) => index)
        .map(value => value.toString().padStart(2, "0"));

const hourOptions = createArrayOfLength(24);
const minuteOptions = createArrayOfLength(60);

export { hourOptions, minuteOptions };
