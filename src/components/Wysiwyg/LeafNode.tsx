import { Box } from "@mui/material";
import { RenderLeafProps } from "slate-react";

export interface LeafNodeProps
    extends Pick<RenderLeafProps, "attributes" | "children"> {
    leaf: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        code?: boolean;
    };
}

const LeafNode = (props: LeafNodeProps) => {
    const {
        leaf: { bold, italic, underline, code },
        attributes,
        children,
    } = props;

    if (bold) {
        return <strong>{children}</strong>;
    }

    if (code) {
        return <code>{children}</code>;
    }

    if (italic) {
        return <em>{children}</em>;
    }

    if (underline) {
        return <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};

export default LeafNode;
