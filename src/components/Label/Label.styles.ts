import { css } from "@emotion/react";

export const label = ({ required }: { required: boolean }) =>
    css({
        ...(required && {
            ":after": {
                content: '"*"',
            },
        }),
    });
