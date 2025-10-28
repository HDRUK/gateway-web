import { build } from "esbuild";
import fs from "fs";

await build({
    entryPoints: ["src/widgets/WidgetDisplay.tsx"],
    bundle: true,
    platform: "browser",
    format: "esm",
    target: "es2020",
    outfile: "public/embed/widget.js",
    external: [
        "react",
        "react-dom",
        "@mui/material",
        "@mui/material/utils",
        "@mui/material/SvgIcon",
        "@mui/icons-material",
        "@emotion/react",
        "@emotion/styled",
    ],

    mainFields: ["module", "browser", "main"], // pick ESM
    conditions: ["browser", "import", "default"],

    jsx: "automatic",
    loader: {
        ".svg": "dataurl", // or "dataurl" to inline
    },
    jsxImportSource: "react",
    minify: true,
    alias: {
        "next/font/google": "./src/widgets/shims/next-font-google.js",
    },
});

let code = fs.readFileSync("public/embed/widget.js", "utf8");

code = code

    // React
    .replace(/from\s*["']react["']/g, 'from "https://esm.sh/react@18"')
    .replace(
        /from\s*["']react-dom\/client["']/g,
        'from "https://esm.sh/react-dom@18/client?deps=react@18"'
    )
    .replace(
        /from\s*["']react-dom["']/g,
        'from "https://esm.sh/react-dom@18?deps=react@18"'
    )

    // material UI (only supported entry points)
    .replace(
        /from\s*["']@mui\/material["']/g,
        'from "https://esm.sh/@mui/material?deps=react@18"'
    )
    .replace(
        /from\s*["']@mui\/material\/styles["']/g,
        'from "https://esm.sh/@mui/material/styles?deps=react@18"'
    )

    .replace(
        /from\s*["']@mui\/icons-material["']/g,
        'from "https://esm.sh/@mui/icons-material?deps=react@18"'
    )

    // .replace(
    //     /from\s*["']@mui\/material\/utils["']/g,
    //     'from "https://esm.sh/@mui/material/utils?deps=react@18"'
    // )

    // emotion
    .replace(
        /from\s*["']@emotion\/react["']/g,
        'from "https://esm.sh/@emotion/react@11?deps=react@18"'
    )
    .replace(
        /from\s*["']@emotion\/styled["']/g,
        'from "https://esm.sh/@emotion/styled?deps=react@18"'
    )
    .replace(
        /from\s*["']@mui\/material\/([A-Za-z0-9_-]+)["']/g,
        'from "https://esm.sh/@mui/material/$1?deps=react@18"'
    )
    .replace(
        /from\s*["']react\/jsx-runtime["']/g,
        'from "https://esm.sh/react@18/jsx-runtime"'
    );

// Icons — strip optional ".js", bundle, and include MUI as a dep
code = code.replace(
    /from\s*["']@mui\/icons-material\/([^"']+)["']/g,
    (_m, sub) =>
        `from "https://esm.sh/@mui/icons-material@5.14.19/${sub.replace(
            /\.js$/,
            ""
        )}?bundle&deps=react@18,@mui/material@5.14.19"`
);

// MUI utils (folder or subpath) — bundle to avoid dynamic require
code = code.replace(
    /from\s*["']@mui\/material\/utils(?:\/([^"']+))?["']/g,
    (_m, sub = "") =>
        `from "https://esm.sh/@mui/material@5.14.19/utils${
            sub ? `/${sub}` : ""
        }?bundle&deps=react@18"`
);

// (Optional) react/jsx-runtime to ESM URL
code = code.replace(
    /from\s*["']react\/jsx-runtime["']/g,
    'from "https://esm.sh/react@18/jsx-runtime"'
);

// code = "const React = o;\n" + code;

fs.writeFileSync("public/embed/widget.js", code);

console.log("✅ widget.js built successfully with CDN imports");
