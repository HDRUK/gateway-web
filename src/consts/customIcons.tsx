"use client";

import { createSvgIcon } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";

type checkboxSizes = "small" | "medium" | "large";

const sizeMappings = {
    small: 24,
    medium: 24,
    large: 24,
};

interface IconType
    extends Omit<React.HTMLAttributes<HTMLSpanElement>, "theme"> {
    size: checkboxSizes;
}
const CheckboxIcon = styled("span")(
    ({ theme, size }: IconType & { theme: Theme }) => {
        return {
            marginRight: 5,
            border: `2px solid ${theme.palette.grey[400]}`,
            width: sizeMappings[size],
            height: sizeMappings[size],
            backgroundColor: "white",
            "input:hover ~ &": {
                backgroundColor: theme.palette.grey[100],
            },
            "input:disabled ~ &": {
                background: theme.palette.grey[300],
                borderColor: theme.palette.grey[300],
            },
        };
    }
);

const CheckboxCheckedIcon = styled(CheckboxIcon)(({ theme, size }) => ({
    backgroundColor: theme.palette.secondary.main,
    borderWidth: 0,
    "&::before": {
        display: "block",
        width: sizeMappings[size],
        height: sizeMappings[size],
        backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath" +
            " fill-rule='evenodd' clip-rule='evenodd' d='M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
    },
    "input:hover ~ &": {
        backgroundColor: theme.palette.secondary.dark,
    },
}));

const CheckboxIndeterminateIcon = styled(CheckboxIcon)(({ theme, size }) => ({
    backgroundColor: theme.palette.secondary.main,
    borderWidth: 0,
    "&::before": {
        display: "block",
        width: sizeMappings[size],
        height: sizeMappings[size],
        backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath" +
            " fill-rule='evenodd' clip-rule='evenodd' d='M21 3H3v18h18V3zm-4 10H7v-2h10v2z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
    },
    "input:hover ~ &": {
        backgroundColor: theme.palette.secondary.dark,
    },
}));

const RemoveFilterIcon = createSvgIcon(
    <svg
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth={1.5}
        stroke="currentColor"
        viewBox="0 0 122.88 110.668">
        <g>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M91.124,15.645c12.928,0,23.406,10.479,23.406,23.406 c0,12.927-10.479,23.406-23.406,23.406c-12.927,0-23.406-10.479-23.406-23.406C67.718,26.125,78.197,15.645,91.124,15.645 L91.124,15.645z M2.756,0h117.322c1.548,0,2.802,1.254,2.802,2.802c0,0.848-0.368,1.622-0.996,2.139l-10.667,13.556 c-1.405-1.375-2.95-2.607-4.614-3.672l6.628-9.22H9.43l37.975,46.171c0.59,0.516,0.958,1.254,0.958,2.102v49.148l21.056-9.623 V57.896c1.651,1.9,3.548,3.582,5.642,4.996v32.133c0,1.105-0.627,2.064-1.586,2.506l-26.476,12.758 c-1.327,0.773-3.023,0.332-3.798-1.033c-0.258-0.441-0.368-0.92-0.368-1.4V55.02L0.803,4.756c-1.07-1.106-1.07-2.839,0-3.945 C1.355,0.258,2.056,0,2.756,0L2.756,0z M96.93,28.282c1.328-1.349,3.489-1.355,4.825-0.013c1.335,1.342,1.341,3.524,0.013,4.872 l-5.829,5.914l5.836,5.919c1.317,1.338,1.299,3.506-0.04,4.843c-1.34,1.336-3.493,1.333-4.81-0.006l-5.797-5.878l-5.807,5.889 c-1.329,1.349-3.489,1.355-4.826,0.013c-1.335-1.342-1.341-3.523-0.013-4.872l5.83-5.913l-5.836-5.919 c-1.317-1.338-1.3-3.507,0.04-4.843c1.339-1.336,3.492-1.333,4.81,0.006l5.796,5.878L96.93,28.282L96.93,28.282z"
            />
        </g>
    </svg>,
    "RemoveFilter"
);

const SortAscIcon = createSvgIcon(
    <svg
        stroke="currentColor"
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M9 8.24994C8.81 8.24994 8.62 8.17994 8.47 8.02994L6.5 6.05994L4.53 8.02994C4.24 8.31994 3.76 8.31994 3.47 8.02994C3.18 7.73994 3.18 7.25994 3.47 6.96994L5.97 4.46994C6.26 4.17994 6.74 4.17994 7.03 4.46994L9.53 6.96994C9.82 7.25994 9.82 7.73994 9.53 8.02994C9.38 8.17994 9.19 8.24994 9 8.24994Z" />
        <path d="M6.5 19.75C6.09 19.75 5.75 19.41 5.75 19V5C5.75 4.59 6.09 4.25 6.5 4.25C6.91 4.25 7.25 4.59 7.25 5V19C7.25 19.41 6.91 19.75 6.5 19.75Z" />
        <path d="M20 17.25H12C11.59 17.25 11.25 16.91 11.25 16.5C11.25 16.09 11.59 15.75 12 15.75H20C20.41 15.75 20.75 16.09 20.75 16.5C20.75 16.91 20.41 17.25 20 17.25Z" />
        <path d="M16 11.25H12C11.59 11.25 11.25 10.91 11.25 10.5C11.25 10.09 11.59 9.75 12 9.75H16C16.41 9.75 16.75 10.09 16.75 10.5C16.75 10.91 16.41 11.25 16 11.25Z" />
        <path d="M14 8.25H12C11.59 8.25 11.25 7.91 11.25 7.5C11.25 7.09 11.59 6.75 12 6.75H14C14.41 6.75 14.75 7.09 14.75 7.5C14.75 7.91 14.41 8.25 14 8.25Z" />
        <path d="M18 14.25H12C11.59 14.25 11.25 13.91 11.25 13.5C11.25 13.09 11.59 12.75 12 12.75H18C18.41 12.75 18.75 13.09 18.75 13.5C18.75 13.91 18.41 14.25 18 14.25Z" />
    </svg>,
    "SortAscIcon"
);

const ChevronThinIcon = createSvgIcon(
    <svg fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="chevron">
            <path
                id="Path"
                d="M12 16.205C11.768 16.205 11.537 16.125 11.349 15.964L3.59003 9.31404L4.89203 7.79504L12 13.888L19.108 7.79504L20.41 9.31404L12.651 15.964C12.463 16.125 12.232 16.205 12 16.205Z"
                fill="currentColor"
            />
        </g>
    </svg>,
    "SortAscIcon"
);

const SortDescIcon = createSvgIcon(
    <svg
        stroke="currentColor"
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6.5 19.7499C6.31 19.7499 6.12 19.6799 5.97 19.5299L3.47 17.0299C3.18 16.7399 3.18 16.2599 3.47 15.9699C3.76 15.6799 4.24 15.6799 4.53 15.9699L6.5 17.9399L8.47 15.9699C8.76 15.6799 9.24 15.6799 9.53 15.9699C9.82 16.2599 9.82 16.7399 9.53 17.0299L7.03 19.5299C6.88 19.6799 6.69 19.7499 6.5 19.7499Z"
            fill="#000000"
        />
        <path
            d="M6.5 19.75C6.09 19.75 5.75 19.41 5.75 19V5C5.75 4.59 6.09 4.25 6.5 4.25C6.91 4.25 7.25 4.59 7.25 5V19C7.25 19.41 6.91 19.75 6.5 19.75Z"
            fill="#000000"
        />
        <path
            d="M20 8.25H12C11.59 8.25 11.25 7.91 11.25 7.5C11.25 7.09 11.59 6.75 12 6.75H20C20.41 6.75 20.75 7.09 20.75 7.5C20.75 7.91 20.41 8.25 20 8.25Z"
            fill="#000000"
        />
        <path
            d="M16 14.25H12C11.59 14.25 11.25 13.91 11.25 13.5C11.25 13.09 11.59 12.75 12 12.75H16C16.41 12.75 16.75 13.09 16.75 13.5C16.75 13.91 16.41 14.25 16 14.25Z"
            fill="#000000"
        />
        <path
            d="M14 17.25H12C11.59 17.25 11.25 16.91 11.25 16.5C11.25 16.09 11.59 15.75 12 15.75H14C14.41 15.75 14.75 16.09 14.75 16.5C14.75 16.91 14.41 17.25 14 17.25Z"
            fill="#000000"
        />
        <path
            d="M18 11.25H12C11.59 11.25 11.25 10.91 11.25 10.5C11.25 10.09 11.59 9.75 12 9.75H18C18.41 9.75 18.75 10.09 18.75 10.5C18.75 10.91 18.41 11.25 18 11.25Z"
            fill="#000000"
        />
    </svg>,
    "SortDescIcon"
);

const SpeechBubbleIcon = createSvgIcon(
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 0C4.96779 0 0 3.97437 0 9L0.00672654 9.31642C0.0783464 10.9988 0.719808 12.5957 1.83136 13.9657L2 14.166V20.6179L7.49765 17.8687C9.14482 19.8085 11.943 21 15 21L15.4714 20.9901C15.7854 20.977 16.0985 20.9509 16.4107 20.9122L16.548 20.892L22 23.618V18.401L22.0771 18.3283C23.3047 17.1158 24 15.6084 24 14C24 12.3486 23.2666 10.8048 21.9781 9.57667C21.9926 9.38613 22 9.19384 22 9C22 3.97437 17.0322 0 11 0ZM21.3885 11.9777C19.8839 15.5091 15.7755 18 11 18C10.9413 18 10.8827 17.9996 10.8242 17.9988C11.9992 18.631 13.4491 19 15 19C15.3891 19 15.7777 18.9754 16.1658 18.9273L16.5536 18.8713L16.8734 18.8187L20 20.382V17.4982L20.3516 17.1987C21.4205 16.2883 22 15.166 22 14C22 13.2979 21.7895 12.6115 21.3885 11.9777ZM11 2C16.0134 2 20 5.18935 20 9C20 12.8106 16.0134 16 11 16C10.009 16 9.03279 15.8694 8.09102 15.6179L7.72486 15.5201L4 17.381V13.3899L3.72996 13.1015C2.60688 11.9021 2 10.4813 2 9C2 5.18935 5.98655 2 11 2Z"
                fill="#000000"
            />
        </g>
    </svg>,
    "SpeechBubbleIcon"
);

export {
    SpeechBubbleIcon,
    RemoveFilterIcon,
    SortAscIcon,
    SortDescIcon,
    CheckboxCheckedIcon,
    CheckboxIndeterminateIcon,
    CheckboxIcon,
    ChevronThinIcon,
};
