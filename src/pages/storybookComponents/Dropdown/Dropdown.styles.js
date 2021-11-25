import { css } from '@emotion/react';

export const root = ({ variant }) => theme => {
	const {
		colors,
		components: {
			Dropdown: { variants },
		},
	} = theme;

	return css`
		.dropdown-toggle {
			position: relative;
			text-align: left;
			width: 100%;

			&:after {
				position: absolute;
				right: 0.5rem;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}

		.dropdown-toggle,
		&.show .dropdown-toggle {
			border-width: 2px;
			border-style: solid;
			background: ${colors[variants[variant].background]};
			border-color: ${colors[variants[variant].borderColor]};
			color: ${colors.grey700};
		}

		.dropdown-toggle:focus {
			box-shadow: none;
			border-color: ${colors.green700};
		}

		.dropdown-menu {
			min-width: 100%;
		}
	`;
};