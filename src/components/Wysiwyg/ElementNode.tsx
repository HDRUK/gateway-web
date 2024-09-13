import { RenderElementProps } from "slate-react";
import { Blocks, Marks, TextAlign } from "@/interfaces/Wysiwyg";

export interface ElementNodeProps
    extends Pick<RenderElementProps, "attributes" | "children"> {
    element: {
        type?: string;
        align?: TextAlign;
    };
}

const ElementNode = (props: ElementNodeProps) => {
    const { attributes, children, element } = props;
    const style = { textAlign: element.align };

    switch (element.type) {
        case Blocks.BLOCK_QUOTE:
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            );
        case Blocks.BULLETED_LIST:
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            );
        case Blocks.LIST_ITEM:
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            );
        case Blocks.NUMBERED_LIST:
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            );
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
    }
};

export default ElementNode;
