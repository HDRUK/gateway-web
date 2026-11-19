import fs from "fs";
import path from "path";

const SRC = path.join(__dirname, "..", "..", "..");
const ROOTS = [
    path.join(SRC, "templates", "metadata", "form"),
    path.join(
        SRC,
        "app",
        "[locale]",
        "account",
        "team",
        "[teamId]",
        "(withoutLeftNav)",
        "datasets",
        "_schema"
    ),
];

const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return walk(full);
        return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
            ? [full]
            : [];
    });

const isClient = (source: string) => /^\s*["']use client["']/.test(source);

const resolveImport = (from: string, specifier: string): string | undefined => {
    const base = specifier.startsWith("@/")
        ? path.join(SRC, specifier.slice(2))
        : specifier.startsWith(".")
        ? path.resolve(path.dirname(from), specifier)
        : undefined;
    if (!base) return undefined;
    return [
        base,
        `${base}.ts`,
        `${base}.tsx`,
        path.join(base, "index.ts"),
        path.join(base, "index.tsx"),
    ].find(
        candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile()
    );
};

const importsOf = (source: string) =>
    [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(match => match[1]);

describe("server components in the schema onboarding form", () => {
    const serverModules = ROOTS.flatMap(walk).filter(
        file => !isClient(fs.readFileSync(file, "utf8"))
    );

    it("finds the modules it checks", () => {
        expect(serverModules.length).toBeGreaterThan(2);
    });

    it.each(serverModules.map(file => [path.relative(SRC, file), file]))(
        "%s imports no client-only styled() module",
        (_label, file) => {
            const offending = importsOf(fs.readFileSync(file, "utf8"))
                .map(specifier => ({
                    specifier,
                    resolved: resolveImport(file, specifier),
                }))
                .filter(({ resolved }) => {
                    if (!resolved) return false;
                    const source = fs.readFileSync(resolved, "utf8");
                    const code = source.replace(
                        /\/\*[\s\S]*?\*\/|\/\/.*$/gm,
                        ""
                    );
                    return !isClient(source) && /\bstyled\(/.test(code);
                })
                .map(({ specifier }) => specifier);

            expect(offending).toEqual([]);
        }
    );
});
