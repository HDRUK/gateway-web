import DOMPurify from "isomorphic-dompurify";

const capitalise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const convertToCamelCase = (inputString: string) =>
    inputString.replace(/_([a-z])/g, (_match, group) => group.toUpperCase());

const splitCamelcase = (str: string) => {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const getTrimmedpathname = (locale: string, pathname: string) => {
    return pathname.replace(`/${locale}`, "");
};

function extractSubdomain(url: string) {
    try {
        const parsedUrl = new URL(url);
        const hostnameParts = parsedUrl.hostname.split(".");

        // Remove the first part (e.g., "api")
        hostnameParts.shift();

        // Join the remaining parts and prepend a dot
        const subdomain = `.${hostnameParts.join(".")}`;

        return subdomain;
    } catch (error) {
        console.error("Invalid URL:", url);
        return null;
    }
}

function getStaticAssetUrl(file: string) {
    return `${process.env.NEXT_PUBLIC_MEDIA_STATIC_URL}/${file}`;
}

function getTeamAssetPath(file: string) {
    return `/teams/${file}`;
}

function parseStaticImagePaths<T>(values: T, prefix?: string) {
    return Object.entries(values || {}).reduce(
        (accumulator, currentValue) => ({
            ...accumulator,
            [currentValue[0]]: getStaticAssetUrl(
                `${prefix ? `${prefix}/` : ""}${currentValue[1]}`
            ),
        }),
        {}
    ) as T;
}

function decodeHtmlEntity(input: string): string {
    return DOMPurify(input);
}

export {
    capitalise,
    convertToCamelCase,
    splitCamelcase,
    extractSubdomain,
    getTrimmedpathname,
    parseStaticImagePaths,
    getTeamAssetPath,
    decodeHtmlEntity,
};
