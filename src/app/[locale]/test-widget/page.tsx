"use client";

import Script from "next/script";

export default function HomePage() {
    // const cmsContent = await getHomePage();

    // const sortedPosts = getSortedNewsEventsByDate(cmsContent.posts.edges);

    return (
        <>
            <div id="replaceMe" />
            <Script
                crossOrigin="anonymous"
                type="module"
                src="http://localhost:3000/api/widgets/58-2"
                // http://localhost:8000/api/v1/teams/58/widgets/2/data?domain_origin=http://www.google.com
            />
        </>
    );
}
