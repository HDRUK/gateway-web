"use client";

import { usePathname, useParams } from "next/navigation";
import Script from "next/script";
import { BreadcrumbList, WithContext } from "schema-dts";

interface itemType {
    "@id": string;
    name: string;
}

interface itemListType {
    "@type": "ListItem";
    position: number;
    item: itemType;
}

const BreadCrumbs = () => {
    const { locale } = useParams();
    const origin =
        typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : "";
    const pathname = usePathname();
    const mainDomain = `${origin}/${locale}`;

    let position = 1;
    const listItems: itemListType[] = [
        {
            "@type": "ListItem",
            position,
            item: {
                "@id": mainDomain,
                name: "Home",
            },
        },
    ];

    const isHome = pathname === +"/" + locale;

    if (!isHome) {
        const splitPaths = pathname!.split("/");
        const getPathForSub = (position: number, size: number) => {
            const length = position + 1;
            const isFirstOrOnlyItem = size === length || length === 1;
            if (isFirstOrOnlyItem) {
                return origin + pathname;
            }
            let url = origin;
            splitPaths.shift(); // removes ''
            splitPaths.forEach((path, index) => {
                if (index + 1 < size) {
                    url += `/${path}`;
                }
            });
            return url;
        };
        splitPaths.shift(); // removes ''
        if (locale) {
            splitPaths.shift(); // removes 'en'
        }

        splitPaths.forEach((path: string, index, row) => {
            position += 1;
            const name = path.replace("-", " ");
            const item: itemListType = {
                "@type": "ListItem",
                position,
                item: {
                    "@id": getPathForSub(index, row.length),
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                },
            };
            listItems.push(item);
        });
    }

    const jsonLd: WithContext<BreadcrumbList> = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: listItems,
    };

    return (
        <Script id="breadcrumbs" type="application/ld+json">
            {JSON.stringify(jsonLd)}
        </Script>
    );
};

export default BreadCrumbs;
