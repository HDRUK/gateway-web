import fs from "fs";
import path from "path";
import { compile } from "json-schema-to-typescript";
import { SCHEMA_BRANCH } from "../src/consts/schema";

const TARGETS: { name: string; version: string }[] = [
    { name: "HDRUK", version: "4.1.0" },
    { name: "GWDM", version: "2.2" },
];

const SCHEMATA_RAW = `https://raw.githubusercontent.com/HDRUK/schemata-2/${SCHEMA_BRANCH}`;
const OUTPUT_ROOT = path.join(process.cwd(), "src", "generated", "schemas");

const schemaUrl = (name: string, version: string) =>
    `${SCHEMATA_RAW}/hdr_schemata/models/${name}/${version}/schema.json`;

(async () => {
    for (const { name, version } of TARGETS) {
        const url = schemaUrl(name, version);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `${name} ${version}: ${response.status} ${response.statusText} from ${url}`
            );
        }

        const outDir = path.join(OUTPUT_ROOT, name);
        fs.mkdirSync(outDir, { recursive: true });

        const ts = await compile(await response.json(), `${name}${version}`, {
            bannerComment:
                "/* eslint-disable */\n" +
                "/**\n" +
                ` * AUTO-GENERATED from HDRUK/schemata-2 (${SCHEMA_BRANCH}):\n` +
                ` * hdr_schemata/models/${name}/${version}/schema.json\n` +
                " * via `npm run generate:schema-types`. DO NOT HAND-EDIT.\n" +
                " * NOTE: json-schema-to-typescript suffixes duplicate $defs titles (e.g.\n" +
                " * Documentation1, Coverage1) when the same title appears on multiple schema\n" +
                " * nodes - this is cosmetic.\n" +
                " */",
            style: { singleQuote: false },
        });

        fs.writeFileSync(path.join(outDir, `${version}.ts`), ts);
        console.log(`Wrote src/generated/schemas/${name}/${version}.ts`);
    }
})();
