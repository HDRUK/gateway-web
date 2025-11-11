import { build } from "esbuild";
import fs from "fs";

(async () => {
  await build({
    entryPoints: ["src/widgets/WidgetInterface.tsx"],
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
    mainFields: ["module", "browser", "main"],
    conditions: ["browser", "import", "default"],
    jsx: "automatic",
    jsxImportSource: "react",
    minify: true,
    alias: {
      "next/font/google": "./src/widgets/shims/next-font-google.js",
    },
  });

  let code = fs.readFileSync("public/embed/widget.js", "utf8");

  code = code
    .replace(/from\s*["']react["']/g, 'from "https://esm.sh/react@18"')
    .replace(/from\s*["']react-dom\/client["']/g, 'from "https://esm.sh/react-dom@18/client?deps=react@18"')
    .replace(/from\s*["']react-dom["']/g, 'from "https://esm.sh/react-dom@18?deps=react@18"')
    .replace(/from\s*["']@mui\/material["']/g, 'from "https://esm.sh/@mui/material@5.14.18?deps=react@18"')
    .replace(/from\s*["']@mui\/material\/styles["']/g, 'from "https://esm.sh/@mui/material@5.14.18/styles?deps=react@18"')
    .replace(/from\s*["']@mui\/material\/([A-Za-z0-9_-]+)["']/g, 'from "https://esm.sh/@mui/material@5.14.18/$1?deps=react@18"')
    .replace(/from\s*["']@mui\/icons-material\/([^"']+)["']/g, (_m, sub) =>
      `from "https://esm.sh/@mui/icons-material@5.14.18/${sub.replace(/\.js$/, "")}?bundle&deps=react@18,@mui/material@5.14.18"`
    )
    .replace(/from\s*["']@emotion\/react["']/g, 'from "https://esm.sh/@emotion@11.11.0/react@11?deps=react@18"')
    .replace(/from\s*["']react\/jsx-runtime["']/g, 'from "https://esm.sh/react@18/jsx-runtime"');

  fs.writeFileSync("public/embed/widget.js", code);

  console.log("✅ widget.js built successfully with CDN imports");
})();
