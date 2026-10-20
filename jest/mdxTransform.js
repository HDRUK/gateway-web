/**
 * Jest transform for the metadata view templates (.mdx).
 *
 * Templates have no imports by design, so MDX's "function-body" output is
 * enough: it is wrapped as a CommonJS module and handed React's JSX runtime
 * plus the app's own MDX component map - the same mapping @next/mdx applies
 * in the real build. Compilation runs in a child process because
 * @mdx-js/mdx is ESM-only and CI's Node 20 cannot require() it synchronously.
 */
const { execFileSync } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const COMPILER = path.join(__dirname, "compileMdx.mjs");
const VERSION =
    fs.readFileSync(COMPILER, "utf8") + fs.readFileSync(__filename, "utf8");

module.exports = {
    process(sourceText, sourcePath) {
        const body = execFileSync(process.execPath, [COMPILER, sourcePath], {
            input: sourceText,
            encoding: "utf8",
            maxBuffer: 16 * 1024 * 1024,
        });

        const code = `
const runtime = require("react/jsx-runtime");
const { useMDXComponents } = require("@/mdx-components");
module.exports = (function () {
${body}
}).call(undefined, { ...runtime, useMDXComponents });
module.exports.__esModule = true;
`;
        return { code };
    },

    getCacheKey(sourceText, sourcePath) {
        return crypto
            .createHash("sha256")
            .update(VERSION)
            .update(sourcePath)
            .update(sourceText)
            .digest("hex");
    },
};
