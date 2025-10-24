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
        "@emotion/react",
        "@emotion/styled",
    ],
    minify: true,
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
        'from "https://esm.sh/@mui/material@5?deps=react@18"'
    )
    .replace(
        /from\s*["']@mui\/material\/styles["']/g,
        'from "https://esm.sh/@mui/material/styles?deps=react@18"'
    )
    .replace(
        /from\s*["']@mui\/icons-material["']/g,
        'from "https://esm.sh/@mui/icons-material@5?deps=react@18"'
    )

    // emotion
    .replace(
        /from\s*["']@emotion\/react["']/g,
        'from "https://esm.sh/@emotion/react@11?deps=react@18"'
    )
    .replace(
        /from\s*["']@emotion\/styled["']/g,
        'from "https://esm.sh/@emotion/styled@11?deps=react@18"'
    );

code = "const React = o;\n" + code;

fs.writeFileSync("public/embed/widget.js", code);

console.log("✅ widget.js built successfully with CDN imports");
