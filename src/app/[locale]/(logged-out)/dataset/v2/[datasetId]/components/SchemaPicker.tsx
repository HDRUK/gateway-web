"use client";

import { useState } from "react";
import { Button } from "@hdruk/ui";
import { MenuItem, Select, TextField } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { AvailableSchemas } from "../lib/fetchSchema";

const NATIVE = "native";

export interface SchemaPickerProps {
    datasetId: string;
    schemaModel?: string;
    schemaVersion?: string;
    available: AvailableSchemas;
}

const toOptionValue = (model: string, version: string) =>
    `${model}/${version}`;

const SchemaPicker = ({
    datasetId,
    schemaModel,
    schemaVersion,
    available,
}: SchemaPickerProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const [id, setId] = useState(datasetId);
    const [schema, setSchema] = useState(
        schemaModel && schemaVersion
            ? toOptionValue(schemaModel, schemaVersion)
            : NATIVE
    );

    const options = Object.entries(available).flatMap(([model, versions]) =>
        versions.map(version => toOptionValue(model, version))
    );

    const apply = (nextId: string, nextSchema: string) => {
        const params = new URLSearchParams();

        if (nextSchema !== NATIVE) {
            const [model, version] = nextSchema.split("/");
            params.set("schema_model", model);
            params.set("schema_version", version);
        }

        const query = params.toString();
        const base = pathname?.replace(/\/[^/]*$/, "") ?? "";

        router.push(`${base}/${nextId}${query ? `?${query}` : ""}`, {
            scroll: false,
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                gap: 2,
                mb: 2,
            }}>
            <Box sx={{ p: 0 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Dataset ID
                </Typography>
                <TextField
                    size="small"
                    value={id}
                    onChange={event => setId(event.target.value)}
                    sx={{ width: 120 }}
                />
            </Box>

            <Box sx={{ p: 0 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Schema requested
                </Typography>
                <Select
                    size="small"
                    value={schema}
                    onChange={event => setSchema(event.target.value)}
                    sx={{ minWidth: 240 }}>
                    <MenuItem value={NATIVE}>native (as stored)</MenuItem>
                    {options.map(option => (
                        <MenuItem key={option} value={option}>
                            {option.replace("/", " ")}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Button onClick={() => apply(id, schema)}>Fetch</Button>
        </Box>
    );
};

export default SchemaPicker;
