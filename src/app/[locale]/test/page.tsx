"use client"

import Script from "next/script";


export default async function TestPage() {
    
    return (
        <>
        here
        <div id="replaceMe"></div>
        <Script src="http://localhost:3000/api/widgets/58-4"/>
        </>
    );
}
