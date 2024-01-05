const capitalise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const splitCamelcase = (str: string) => {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export { capitalise, splitCamelcase };
