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

const MetadataOnboardingIcon = createSvgIcon(
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H10L12 6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8H11.175L9.175 6H4V18L6.4 10H23.5L20.925 18.575C20.7917 19.0083 20.5458 19.3542 20.1875 19.6125C19.8292 19.8708 19.4333 20 19 20H4ZM6.1 18H19L20.8 12H7.9L6.1 18Z"
            fill="#475DA7"
        />
    </svg>,
    "MetadataOnboardingIcon"
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

const CohortDiscoveryIcon = createSvgIcon(
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <mask
            id="mask0_6933_306"
            style={{
                maskType: "alpha",
            }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24">
            <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_6933_306)">
            <path
                d="M9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM17 19C17.5667 19 18.0375 18.8333 18.4125 18.5C18.7875 18.1667 18.9833 17.6667 19 17C19.0167 16.4333 18.8292 15.9583 18.4375 15.575C18.0458 15.1917 17.5667 15 17 15C16.4333 15 15.9583 15.1917 15.575 15.575C15.1917 15.9583 15 16.4333 15 17C15 17.5667 15.1917 18.0417 15.575 18.425C15.9583 18.8083 16.4333 19 17 19ZM21.6 23L19.05 20.45C18.75 20.6333 18.4292 20.7708 18.0875 20.8625C17.7458 20.9542 17.3833 21 17 21C15.9 21 14.9583 20.6083 14.175 19.825C13.3917 19.0417 13 18.1 13 17C13 15.9 13.3917 14.9583 14.175 14.175C14.9583 13.3917 15.9 13 17 13C18.1 13 19.0417 13.3917 19.825 14.175C20.6083 14.9583 21 15.9 21 17C21 17.3833 20.9542 17.7458 20.8625 18.0875C20.7708 18.4292 20.6333 18.75 20.45 19.05L23 21.6L21.6 23ZM1 20V17.2C1 16.6333 1.14583 16.1125 1.4375 15.6375C1.72917 15.1625 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6458 5.75 13.3875C6.81667 13.1292 7.9 13 9 13C9.53333 13 10.0708 13.0292 10.6125 13.0875C11.1542 13.1458 11.6917 13.2417 12.225 13.375C11.825 13.9083 11.5208 14.4833 11.3125 15.1C11.1042 15.7167 11 16.35 11 17C11 17.5333 11.0667 18.0542 11.2 18.5625C11.3333 19.0708 11.5333 19.55 11.8 20H1ZM19 8C19 9.1 18.6083 10.0417 17.825 10.825C17.0417 11.6083 16.1 12 15 12C14.8167 12 14.5833 11.9792 14.3 11.9375C14.0167 11.8958 13.7833 11.85 13.6 11.8C14.05 11.2667 14.3958 10.675 14.6375 10.025C14.8792 9.375 15 8.7 15 8C15 7.3 14.8792 6.625 14.6375 5.975C14.3958 5.325 14.05 4.73333 13.6 4.2C13.8333 4.11667 14.0667 4.0625 14.3 4.0375C14.5333 4.0125 14.7667 4 15 4C16.1 4 17.0417 4.39167 17.825 5.175C18.6083 5.95833 19 6.9 19 8Z"
                fill="#475DA7"
            />
        </g>
    </svg>,
    "CohortDiscoveryIcon"
);

const SendIcon = createSvgIcon(
    <svg
        width="49"
        height="48"
        viewBox="0 0 49 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3.30009 21.6L8.45409 25.504L26.4541 17.504L12.5001 28.502V42C12.501 42.8398 13.0264 43.5897 13.8155 43.8771C14.6046 44.1646 15.4892 43.9285 16.0301 43.286L22.2901 35.848L35.3001 45.6C35.8486 46.0125 36.5702 46.1149 37.2118 45.8715C37.8534 45.628 38.3254 45.0725 38.4621 44.4L46.4621 4.40001C46.6064 3.68015 46.3447 2.93909 45.7804 2.46949C45.216 1.99989 44.4397 1.87725 43.7581 2.15001L3.75809 18.15C3.09006 18.4195 2.61857 19.0275 2.52378 19.7415C2.42898 20.4556 2.72552 21.1655 3.30009 21.6Z"
            fill="#475DA7"
        />
    </svg>,
    "SendIcon"
);

const CollectionsIcon = createSvgIcon(
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <mask
            id="mask0_6450_11687"
            style={{
                maskType: "alpha",
            }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24">
            <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_6450_11687)">
            <path
                d="M4 22V8C4 7.45 4.19583 6.97917 4.5875 6.5875C4.97917 6.19583 5.45 6 6 6H14C14.55 6 15.0208 6.19583 15.4125 6.5875C15.8042 6.97917 16 7.45 16 8V22L10 19L4 22ZM6 18.975L10 16.825L14 18.975V8H6V18.975ZM18 18V4H7V2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V18H18Z"
                fill="#475DA7"
            />
        </g>
    </svg>,
    "CollectionsIcon"
);

const TeamIcon = createSvgIcon(
    <svg
        width="49"
        height="48"
        viewBox="0 0 49 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.12797 4.01231L8.5 4C11.6482 4 14.2533 6.43032 14.4877 9.62797L14.5 10C14.5 13.1482 12.0697 15.7533 8.87203 15.9877L8.5 16C5.35182 16 2.74668 13.5697 2.51231 10.372L2.5 10C2.5 6.85182 4.93032 4.24668 8.12797 4.01231ZM8.5 8L8.34841 8.00555C7.31015 8.08209 6.5 8.95052 6.49865 9.92661L6.50555 10.1516C6.58209 11.1898 7.45052 12 8.42661 12.0013L8.65159 11.9944C9.68985 11.9179 10.5 11.0495 10.5013 10.0734L10.4944 9.84841C10.4179 8.81015 9.54948 8 8.5 8Z"
            fill="#475DA7"
        />
        <path
            d="M10.5 18V22H6.5C5.47353 22 4.62887 22.7713 4.51344 23.7666L4.5 24V32H8.5V40H14.5V44H4.5V36H0.5V24C0.5 20.8038 2.99704 18.1926 6.14737 18.0102L6.5 18H10.5Z"
            fill="#475DA7"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M40.5001 4L40.9458 4.01638C44.0698 4.24668 46.5001 6.85182 46.4988 10.0734L46.4837 10.4457C46.2534 13.5697 43.6483 16 40.4267 15.9987L40.0544 15.9836C36.9304 15.7533 34.5001 13.1482 34.5015 9.92661L34.5165 9.55433C34.7468 6.43032 37.3519 4 40.5001 4ZM40.4941 8L40.2614 8.01408C39.3217 8.12555 38.5766 8.88435 38.5097 9.77476L38.5001 10C38.5001 11.0495 39.3103 11.9179 40.2749 11.9904L40.5001 12C41.5496 12 42.418 11.1898 42.4905 10.2252L42.5001 10C42.5001 8.95052 41.69 8.08209 40.7254 8.00962L40.4941 8Z"
            fill="#475DA7"
        />
        <path
            d="M42.5 18C45.6962 18 48.3074 20.497 48.4898 23.6474L48.5 24V36H44.5V44H34.5V40H40.5V32H44.5V24C44.5 22.9735 43.7287 22.1289 42.7334 22.0134L42.5 22H38.5V18H42.5Z"
            fill="#475DA7"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24.0897 0.0110182L24.5 0C28.7438 0 32.242 3.31255 32.489 7.58968L32.5 8C32.5 12.2438 29.1874 15.742 24.9103 15.989L24.5 16C20.2562 16 16.758 12.6874 16.511 8.41032L16.5 8C16.5 3.75617 19.8126 0.257954 24.0897 0.0110182ZM24.5 4L24.2631 4.00684C22.1567 4.12886 20.5 5.8784 20.4992 7.94225L20.5068 8.23691C20.6289 10.3433 22.3784 12 24.4423 12.0008L24.7369 11.9932C26.8433 11.8711 28.5 10.1216 28.5008 8.05775L28.4932 7.76309C28.3711 5.65668 26.6216 4 24.5 4Z"
            fill="#475DA7"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.5 18H30.5C33.8146 18 36.5 20.6854 36.5 24V38H32.5V48H16.5V36H12.5V24C12.5 20.6854 15.1854 18 18.5 18ZM30.7334 22.0134L30.5 22H18.5C17.3946 22 16.5 22.8946 16.5 24V32H20.5V44H28.5V34H32.5V24C32.5 22.9735 31.7287 22.1289 30.7334 22.0134Z"
            fill="#475DA7"
        />
    </svg>,
    "TeamIcon"
);

const DatabaseIcon = createSvgIcon(
    <svg
        width="49"
        height="48"
        viewBox="0 0 49 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.5 8C4.5 2.98649 13.4595 0 24.5 0C35.5405 0 44.5 2.98649 44.5 8V22V24V40C44.5 45.0806 35.6738 48 24.5 48C13.5453 48 4.84703 45.1939 4.51013 40.2964L4.5 40V24V22V8ZM8.5 22V24C8.5 25.6733 15.5342 28 24.5 28C33.2573 28 40.1718 25.7803 40.4887 24.1178L40.5 24V22V13.0554C36.8502 14.952 31.0402 16 24.5 16C17.9598 16 12.1498 14.952 8.5 13.0554V22ZM40.5 29.1046C36.8727 30.9829 31.0953 32 24.5 32C17.9047 32 12.1273 30.9829 8.5 29.1046V40C8.5 41.6733 15.5342 44 24.5 44C33.2573 44 40.1718 41.7803 40.4887 40.1178L40.5 40V29.1046ZM24.5 4C33.3417 4 40.5 6.38609 40.5 8C40.5 9.61391 33.3417 12 24.5 12C15.6583 12 8.5 9.61391 8.5 8C8.5 6.42363 15.3292 4.11056 23.8859 4.00383L24.5 4Z"
            fill="#3C3C3B"
        />
    </svg>,
    "DatabaseIcon"
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
                fill="currentColor"
            />
        </g>
    </svg>,
    "SpeechBubbleIcon"
);

const PublicationIcon = createSvgIcon(
    <svg
        width="12"
        height="13"
        viewBox="0 0 12 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11 0.5V9.20711L7.70711 12.5H1V0.5H11ZM10 1.5H2V11.5H7V8.5H10V1.5ZM6 9.5V8.5H3V9.5H6ZM9 6V7H3V6H9ZM9 4.5V3.5H3V4.5H9Z"
            fill="currentColor"
        />
    </svg>,
    "PublicationIcon"
);

const TheAllianceIcon = createSvgIcon(
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_6450_57249)">
            <path
                d="M19.07 4.93L17.66 6.34C19.1 7.79 20 9.79 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.92 7.05 4.56 11 4.07V6.09C8.16 6.57 6 9.03 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 10.34 17.33 8.84 16.24 7.76L14.83 9.17C15.55 9.9 16 10.9 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 10.14 9.28 8.59 11 8.14V10.28C10.4 10.63 10 11.26 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 11.26 13.6 10.62 13 10.28V2H12C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 9.24 20.88 6.74 19.07 4.93Z"
                fill="#475DA7"
            />
        </g>
        <defs>
            <clipPath id="clip0_6450_57249">
                <rect width="24" height="24" fill="white" />
            </clipPath>
        </defs>
    </svg>,
    "TheAllianceIcon"
);

const DataUseIcon = createSvgIcon(
    <svg
        width="12"
        height="13"
        viewBox="0 0 12 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 0.5C4.61929 0.5 3.5 1.61929 3.5 3C3.5 4.20948 4.35888 5.21836 5.5 5.44999V6.7475L3.90005 7.9285C3.5006 7.658 3.01875 7.5 2.5 7.5C1.11929 7.5 0 8.61929 0 10C0 11.3807 1.11929 12.5 2.5 12.5C3.88071 12.5 5 11.3807 5 10C5 9.50315 4.85506 9.04015 4.60515 8.65098L6 7.62145L7.39485 8.65098C7.14494 9.04015 7 9.50315 7 10C7 11.3807 8.11929 12.5 9.5 12.5C10.8807 12.5 12 11.3807 12 10C12 8.61929 10.8807 7.5 9.5 7.5C8.98124 7.5 8.49939 7.658 8.09994 7.92851L6.5 6.7476V5.44999C7.64112 5.21836 8.5 4.20948 8.5 3C8.5 1.61929 7.38071 0.5 6 0.5ZM6 1.5C6.82843 1.5 7.5 2.17157 7.5 3C7.5 3.82843 6.82843 4.5 6 4.5C5.17157 4.5 4.5 3.82843 4.5 3C4.5 2.17157 5.17157 1.5 6 1.5ZM4 10C4 9.17157 3.32843 8.5 2.5 8.5C1.67157 8.5 1 9.17157 1 10C1 10.8284 1.67157 11.5 2.5 11.5C3.32843 11.5 4 10.8284 4 10ZM9.5 8.5C10.3284 8.5 11 9.17157 11 10C11 10.8284 10.3284 11.5 9.5 11.5C8.67157 11.5 8 10.8284 8 10C8 9.17157 8.67157 8.5 9.5 8.5Z"
            fill="currentcolor"
        />
    </svg>,
    "DataUseIcon"
);

const ToolIcon = createSvgIcon(
    <svg
        width="12"
        height="11"
        viewBox="0 0 12 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.27814 0.00840603L8.17172 0.0202936C6.61331 0.154153 5.41893 1.44937 5.39966 3.00165L5.40224 3.24033C5.40812 3.37098 5.42557 3.50334 5.45431 3.63464L5.4716 3.70437L5.06845 4.05964L4.00277 2.99397L4.32359 2.03151L2.51594 0.223862L0.584511 2.15529L2.39216 3.96294L3.35462 3.64212L4.37937 4.66687L1.17946 7.48669C0.768419 7.85319 0.524651 8.36805 0.501768 8.91556C0.480691 9.41988 0.648699 9.9135 0.972137 10.2999L1.04635 10.3835C1.44706 10.8031 1.99338 11.0236 2.55706 11.0007L2.66926 10.993C3.19019 10.9419 3.67108 10.6846 4.00291 10.2758L7.80534 6.00144L7.848 6.01063C8.23727 6.08517 8.63711 6.094 9.03081 6.03595C10.1695 5.80148 11.0637 4.97467 11.38 3.88325C11.5576 3.30192 11.5379 2.67141 11.3221 2.09607L11.0728 1.43123L9.48185 3.01507L8.4841 2.02236L10.0484 0.465863L9.42859 0.197138C9.06596 0.0399084 8.67064 -0.0246111 8.27814 0.00840603ZM8.15271 0.944166L8.2829 0.929731L7.18491 2.02293L9.48248 4.30835L10.5763 3.21855L10.5702 3.29398C10.5572 3.40451 10.5343 3.51422 10.5014 3.6218C10.2779 4.39309 9.65117 4.97257 8.87123 5.1337C8.52192 5.18444 8.1392 5.15782 7.77529 5.05108L7.49677 4.96939L3.30461 9.68232C3.10155 9.93177 2.82059 10.0726 2.51989 10.0848C2.21918 10.097 1.92773 9.97941 1.71976 9.76187L1.66574 9.70084C1.49803 9.50012 1.40606 9.22989 1.4176 8.95383C1.43012 8.65412 1.56356 8.37228 1.78746 8.17264L6.54561 3.98036L6.4241 3.67943C6.35057 3.49732 6.31406 3.30238 6.31669 3.106C6.2918 2.00634 7.0886 1.0848 8.15271 0.944166ZM3.27446 2.27901L2.51595 1.5205L1.88118 2.15527L2.63969 2.91378L3.11588 2.7552L3.27446 2.27901ZM9.66564 6.22778L9.01748 6.87593L10.2353 8.09372L10.2992 8.16158C10.4821 8.37164 10.5825 8.63828 10.5825 8.91543C10.5825 9.22336 10.4585 9.51833 10.2386 9.73384C10.0165 9.96041 9.7215 10.0844 9.41356 10.0844C9.10563 10.0844 8.81066 9.96041 8.59515 9.74046L6.91575 8.06103L6.2676 8.70918L7.9437 10.3853L8.02254 10.4615C8.39923 10.8066 8.89623 11.001 9.41356 11.001C9.96785 11.001 10.4988 10.7779 10.8867 10.382C11.276 10.0007 11.4991 9.46971 11.4991 8.91543C11.4991 8.36114 11.276 7.83019 10.8801 7.44227L9.66564 6.22778Z"
            fill="currentColor"
        />
    </svg>,
    "ToolIcon"
);

const DataAccessRequestIcon = createSvgIcon(
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_6857_179379)">
            <path
                d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"
                fill="#475DA7"
            />
        </g>
        <defs>
            <clipPath id="clip0_6857_179379">
                <rect width="24" height="24" fill="white" />
            </clipPath>
        </defs>
    </svg>,
    "DataAccessRequestIcon"
);

const CohortIcon = createSvgIcon(
    <svg
        width="12"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM17 19C17.5667 19 18.0375 18.8333 18.4125 18.5C18.7875 18.1667 18.9833 17.6667 19 17C19.0167 16.4333 18.8292 15.9583 18.4375 15.575C18.0458 15.1917 17.5667 15 17 15C16.4333 15 15.9583 15.1917 15.575 15.575C15.1917 15.9583 15 16.4333 15 17C15 17.5667 15.1917 18.0417 15.575 18.425C15.9583 18.8083 16.4333 19 17 19ZM21.6 23L19.05 20.45C18.75 20.6333 18.4292 20.7708 18.0875 20.8625C17.7458 20.9542 17.3833 21 17 21C15.9 21 14.9583 20.6083 14.175 19.825C13.3917 19.0417 13 18.1 13 17C13 15.9 13.3917 14.9583 14.175 14.175C14.9583 13.3917 15.9 13 17 13C18.1 13 19.0417 13.3917 19.825 14.175C20.6083 14.9583 21 15.9 21 17C21 17.3833 20.9542 17.7458 20.8625 18.0875C20.7708 18.4292 20.6333 18.75 20.45 19.05L23 21.6L21.6 23ZM1 20V17.2C1 16.6333 1.14583 16.1125 1.4375 15.6375C1.72917 15.1625 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6458 5.75 13.3875C6.81667 13.1292 7.9 13 9 13C9.53333 13 10.0708 13.0292 10.6125 13.0875C11.1542 13.1458 11.6917 13.2417 12.225 13.375C11.825 13.9083 11.5208 14.4833 11.3125 15.1C11.1042 15.7167 11 16.35 11 17C11 17.5333 11.0667 18.0542 11.2 18.5625C11.3333 19.0708 11.5333 19.55 11.8 20H1ZM19 8C19 9.1 18.6083 10.0417 17.825 10.825C17.0417 11.6083 16.1 12 15 12C14.8167 12 14.5833 11.9792 14.3 11.9375C14.0167 11.8958 13.7833 11.85 13.6 11.8C14.05 11.2667 14.3958 10.675 14.6375 10.025C14.8792 9.375 15 8.7 15 8C15 7.3 14.8792 6.625 14.6375 5.975C14.3958 5.325 14.05 4.73333 13.6 4.2C13.8333 4.11667 14.0667 4.0625 14.3 4.0375C14.5333 4.0125 14.7667 4 15 4C16.1 4 17.0417 4.39167 17.825 5.175C18.6083 5.95833 19 6.9 19 8Z"
            fill="currentColor"
        />
    </svg>,
    "CohortIcon"
);

const DataCustodiansIcon = createSvgIcon(
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.81399 2.00616L4 2C5.57409 2 6.87666 3.21516 6.99384 4.81399L7 5C7 6.57409 5.78484 7.87666 4.18601 7.99384L4 8C2.42591 8 1.12334 6.78484 1.00616 5.18601L1 5C1 3.42591 2.21516 2.12334 3.81399 2.00616ZM4 4L3.9242 4.00278C3.40508 4.04105 3 4.47526 2.99933 4.9633L3.00278 5.0758C3.04105 5.59492 3.47526 6 3.9633 6.00067L4.0758 5.99722C4.59492 5.95895 5 5.52474 5.00067 5.0367L4.99722 4.9242C4.95895 4.40508 4.52474 4 4 4Z"
            fill="#475DA7"
        />
        <path
            d="M5 9V11H3C2.48676 11 2.06444 11.3857 2.00672 11.8833L2 12V16H4V20H7V22H2V18H0V12C0 10.4019 1.24852 9.09631 2.82368 9.00509L3 9H5Z"
            fill="#475DA7"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20 2L20.2228 2.00819C21.7848 2.12334 23 3.42591 22.9993 5.0367L22.9918 5.22284C22.8767 6.78484 21.5741 8 19.9633 7.99933L19.7772 7.99181C18.2152 7.87666 17 6.57409 17.0007 4.9633L17.0082 4.77716C17.1233 3.21516 18.4259 2 20 2ZM19.997 4L19.8807 4.00704C19.4108 4.06278 19.0383 4.44218 19.0048 4.88738L19 5C19 5.52474 19.4051 5.95895 19.8874 5.99519L20 6C20.5247 6 20.959 5.59492 20.9952 5.11262L21 5C21 4.47526 20.5949 4.04105 20.1126 4.00481L19.997 4Z"
            fill="#475DA7"
        />
        <path
            d="M21 9C22.5981 9 23.9037 10.2485 23.9949 11.8237L24 12V18H22V22H17V20H20V16H22V12C22 11.4868 21.6143 11.0644 21.1167 11.0067L21 11H19V9H21Z"
            fill="#475DA7"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.7948 0.00550908L12 0C14.1219 0 15.871 1.65628 15.9945 3.79484L16 4C16 6.12191 14.3437 7.87102 12.2052 7.99449L12 8C9.87809 8 8.12898 6.34372 8.00551 4.20516L8 4C8 1.87809 9.65628 0.128977 11.7948 0.00550908ZM12 2L11.8815 2.00342C10.8283 2.06443 10 2.9392 9.99958 3.97113L10.0034 4.11845C10.0644 5.17166 10.9392 6 11.9711 6.00042L12.1185 5.99658C13.1717 5.93557 14 5.0608 14.0004 4.02887L13.9966 3.88155C13.9356 2.82834 13.0608 2 12 2Z"
            fill="#475DA7"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 9H15C16.6573 9 18 10.3427 18 12V19H16V24H8V18H6V12C6 10.3427 7.34272 9 9 9ZM15.1167 11.0067L15 11H9C8.44728 11 8 11.4473 8 12V16H10V22H14V17H16V12C16 11.4868 15.6143 11.0644 15.1167 11.0067Z"
            fill="#475DA7"
        />
    </svg>,
    "DataCustodiansIcon"
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
    CohortDiscoveryIcon,
    SendIcon,
    TeamIcon,
    DatabaseIcon,
    PublicationIcon,
    DataUseIcon,
    ToolIcon,
    CohortIcon,
    TheAllianceIcon,
    MetadataOnboardingIcon,
    DataCustodiansIcon,
    CollectionsIcon,
    DataAccessRequestIcon,
};
