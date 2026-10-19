// Compiles one .mdx template (read from stdin) to an MDX "function-body":
// plain JS that takes its JSX runtime and useMDXComponents as arguments[0].
// Run in a child process by mdxTransform.js because @mdx-js/mdx is ESM-only
// and Jest transformers must be synchronous CommonJS.
import { compile } from "@mdx-js/mdx";

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

const file = await compile(
    { value: Buffer.concat(chunks).toString("utf8"), path: process.argv[2] },
    {
        outputFormat: "function-body",
        // Read useMDXComponents from the runtime argument, as @next/mdx reads
        // it from src/mdx-components.tsx in the real build.
        providerImportSource: "#",
        development: false,
    }
);

process.stdout.write(String(file));
