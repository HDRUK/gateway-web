import { NextRequest, NextResponse } from "next/server";
import { revalidateCache } from "@/utils/revalidateCache";
import { headers } from "next/headers";
// import {renderToString} from 'react-dom/server'
import { SimpleComponent } from "../../../../components/SimpleComponent";
import React from "react";
import {build} from 'esbuild'
import path from "path";

export const runtime = 'nodejs'

interface RevalidateRequestBody {
    tags: string | string[];
}

let cachedBundle: string | null = null;


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const {id} = params
        console.log('id', id)
        const popped = id.split('-')
        const teamId = popped[0]
        const wiggywooid = popped[1]


        console.log(teamId, wiggywooid)

        // const headersList = headers()
        // const referer = headersList.get('referer')
        // const origin =  new URL(referer).origin;
        // console.log(origin, '<<<<')

        // const response = await fetch('http://gateway-api:8000/api/v1/teams/'+teamId+'/widgets/'+wiggywooid+'/data?domain_origin='+origin)

        // const json = await response.json();

     const componentPath = path.resolve(process.cwd(), "src/components/SimpleComponent/index.tsx");

//   const result = await build({
//     entryPoints: [componentPath],
//     write: false,          // Don’t write to disk
//     bundle: true,          // Include all imports
//     format: "esm",         
//     platform: "node",
//     jsx: "automatic",
//     target: "es2018",
//   });

//  const result = await build({
//     entryPoints: [componentPath],
//     write: false,
//     bundle: true,
//     platform: "browser",
//     format: "esm",
//     jsx: "automatic",
//     target: "esnext",
//     external: ["react", "react-dom"], 
//   });
if (true) {
 const result = await build({
      entryPoints: [componentPath],
      write: false,
      bundle: true,
      platform: "browser", // build for browser env
      format: "iife",
      target: "es2018",
      jsx: "automatic",
      globalName: "WidgetModule",
      external: ["react", "react-dom"],
      // If any dependency references window/document, replace with undefined during build
      define: {
        window: "undefined",
        document: "undefined",
      },
    });

    // // Patch leftover requires if any slipped through
    // cachedBundle = result.outputFiles[0].text
    //   .replace(/require\(["']react["']\)/g, "window.React")
    //   .replace(/require\(["']react-dom["']\)/g, "window.ReactDOM");
cachedBundle = result.outputFiles[0].text
  // Clean up any dynamic requires that slipped through
  .replace(/require\(["']react["']\)/g, "window.React")
  .replace(/require\(["']react-dom["']\)/g, "window.ReactDOM")
  // :wrench: Fix stray __window references (from MUI etc.)
  .replace(/__window/g, "window");
   
}
  
    const script = `
    (function() {
      // Helper to load React & ReactDOM
      function loadScript(src) {
        return new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = src;
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      Promise.all([
        loadScript("https://unpkg.com/react@18/umd/react.production.min.js"),
        loadScript("https://unpkg.com/react-dom@18/umd/react-dom.production.min.js")
      ]).then(() => {
        // Now we are in the browser; window is defined here :white_check_mark:
        (function(){ ${cachedBundle} })();

        const Widget = window.WidgetModule.default;
        const container = document.getElementById("replaceMe");
        if (!container) return console.warn("replaceMe div not found");
        container.innerHTML = "";
        const root = window.ReactDOM.createRoot(container);
        root.render(window.React.createElement(Widget, {
          title: "Dynamic Widget",
          content: "Built & injected via <script>!"
        }));
      });
    })();
  `;

  return new Response(script, {
    headers: { "Content-Type": "application/javascript" },
  });
//   const { default: Widget } = await import(
//     "data:text/javascript;base64," + Buffer.from(compiledCode).toString("base64")
//   );

 
//   const markup = renderToString(
//     React.createElement(Widget)
//   );

 return new Response(compiledCode, {
    headers: { "Content-Type": "application/javascript" },
  });
//   return new Response(markup, {
//     headers: { "Content-Type": "text/html; charset=utf-8" },
//   });
        console.log(compiledCode)

        return NextResponse.json(
            {
                message: 'tester',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error gerrin that there widget:", error);
        return NextResponse.json(
            {
                message: "Error gerrin that there widget",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
