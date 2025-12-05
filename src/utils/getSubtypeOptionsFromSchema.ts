export function getSubtypeOptionsFromSchema(
    schema: Record<string, unknown>,
    selectedLabel: string
): string[] {
    const matchedEntry = Object.entries(schema).find(([_, value]) => {
        return value?.properties?.name?.default === selectedLabel;
    });

    if (!matchedEntry) return ["Not applicable"];

    const [baseKey] = matchedEntry;
    const subTypeKey = `${baseKey}SubTypes`;
    const enumOptions = schema[subTypeKey]?.enum;

    return Array.isArray(enumOptions) ? enumOptions : ["Not applicable"];
}
