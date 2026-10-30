import { JSONSchemaDocument } from "@hdruk/gwdm-view";
import { loadTraserSchema } from "../../../../jest/traserSchemas";

const traserSchema = (name: string, version: string) =>
    loadTraserSchema(name, version) as JSONSchemaDocument | null;

export default traserSchema;
