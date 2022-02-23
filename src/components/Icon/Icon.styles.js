import { css } from '@emotion/react';

export const root = ({ size, color, stroke, fill }) => theme => {
	const {
		colors,
		components: {
			Icon: { sizes },
		},
	} = theme;

	return css`
		display: inline-flex;
		stroke: ${stroke};
		color: ${colors[color]};
		fill: ${colors[fill]};
		height: ${sizes[size]};
		width: ${sizes[size]};
		justify-content: center;
		align-items: center;

		svg,
		img {
			width: 100%;
			height: 100%;
		}
	`;
};
