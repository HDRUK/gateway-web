import { ImageLoaderProps } from "next/image";

function getStaticAssetUrl(file: string) {
    return `${process.env.NEXT_PUBLIC_MEDIA_STATIC_URL}/${file}`;
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

function loaderSrcOnly({ src }: ImageLoaderProps) {
    return src;
}

export { loaderSrcOnly, parseStaticImagePaths, getStaticAssetUrl };
