/**
 * Jest global setup: pulls the onboarding schemas from a running Traser into
 * node_modules/.cache so they are never committed. Tests read them with
 * loadTraserSchema and skip when Traser was unreachable (e.g. CI).
 */
const fs = require("fs");
const path = require("path");

const SCHEMAS = [
    ["HDRUK", "4.1.0"],
    ["PRUK", "1.0.0"],
];

const CACHE_DIR = path.join(
    __dirname,
    "..",
    "node_modules",
    ".cache",
    "traser-schemas"
);

const TRASER_URLS = [
    process.env.TRASER_SERVICE_URL,
    "http://localhost:3001",
].filter(Boolean);

const cachePath = (name, version) =>
    path.join(CACHE_DIR, `${name}-${version}.json`);

const fetchSchema = async (name, version) => {
    for (const url of TRASER_URLS) {
        try {
            const response = await fetch(
                `${url}/get/schema?name=${name}&version=${version}`,
                { signal: AbortSignal.timeout(2000) }
            );
            if (response.ok) {
                const { schema } = await response.json();
                return schema;
            }
        } catch {}
    }
    return null;
};

module.exports = async () => {
    fs.mkdirSync(CACHE_DIR, { recursive: true });

    await Promise.all(
        SCHEMAS.map(async ([name, version]) => {
            const schema = await fetchSchema(name, version);
            if (schema) {
                fs.writeFileSync(
                    cachePath(name, version),
                    JSON.stringify(schema)
                );
            }
        })
    );
};

module.exports.loadTraserSchema = (name, version) => {
    const file = cachePath(name, version);
    return fs.existsSync(file)
        ? JSON.parse(fs.readFileSync(file, "utf8"))
        : null;
};
