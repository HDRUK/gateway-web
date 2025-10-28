"use client";

import Script from "next/script";

export default function TestPage() {
    return (
        <>
            <div id="replaceMe" />
            <Script
                type="module"
                crossOrigin="anonymous"
                src="http://localhost:3000/api/widget/58-2"
            />
        </>
    );
}
