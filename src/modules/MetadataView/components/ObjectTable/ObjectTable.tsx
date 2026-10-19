import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { RendererProps } from "../../types";
import { isEmptyValue } from "../../utils/isEmptyValue";
import { labelFor } from "../../utils/labelFor";
import { resolveSchemaNode } from "../../utils/resolveSchemaNode";
import { tableColumnKeys } from "../../utils/tableColumnKeys";
import ValueChips from "../ValueChips";

const EMPTY_CELL = "-";

const ObjectTable = (props: RendererProps) => {
    const { value, resolved, rootSchema, depth, path, render } = props;
    const rows = (value ?? []) as Record<string, unknown>[];
    const itemsResolved = resolveSchemaNode(resolved.node.items, rootSchema);
    const itemProperties = itemsResolved.node.properties ?? {};
    const keys = tableColumnKeys(resolved, value, rootSchema);

    if (!keys.length) return null;

    // One populated column is a list wearing a table's clothes - a header and
    // a border around a single value per row. Hand it back as the list it is.
    if (keys.length === 1) {
        const [only] = keys;
        return (
            <ValueChips
                {...props}
                value={rows.map(row => row[only]).filter(v => !isEmptyValue(v))}
            />
        );
    }

    const columns = keys.map(key => ({
        key,
        resolved: resolveSchemaNode(itemProperties[key], rootSchema),
    }));

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell key={column.key}>
                                {labelFor(column.resolved, column.key)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index}>
                            {columns.map(column => (
                                <TableCell key={column.key}>
                                    {render(
                                        column.resolved,
                                        row[column.key],
                                        depth + 1,
                                        path
                                            ? `${path}.${column.key}`
                                            : column.key
                                    ) ?? EMPTY_CELL}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ObjectTable;
