import { BaseElement } from "slate";

declare module "slate" {
    export interface BaseElement {
        type?: Blocks | Marks;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    }

    export interface BaseText {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    }
}
