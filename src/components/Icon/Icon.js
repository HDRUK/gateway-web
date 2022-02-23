/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { addCommonPropTypes } from '../../configs/propTypes';
import useCommonStyles from '../../hooks/useCommonStyles';
import SVGIcon from '../../images/SVGIcon';
import * as styles from './Icon.styles.js';

const svgFragments = {
	dataseticon: '0 0 24 24',
	projecticon: '0 0 24 24',
	searchicon: '0 0 18 18',
	cohorticon: '1 1 10 10',
	newnotificationicon: '9 5 6 6',
	toolicon: '0 0 18 18',
	emptystar: '0 0 24 24',
	clear: '0 0 24 24',
	stock: '0 0 24 24',
	newprojecticon: '0 0 24 24',
	newtoolicon: '0 0 24 24',
	reviewsicon: '0 0 24 24',
	accounticon: '0 0 24 24',
	dataaccessicon: '0 0 24 24',
	rolesicon: '0 0 24 24',
	bell: '0 0 24 24',
	newestprojecticon: '0 0 24 24',
	personicon: '2 4 20 20',
	closeicon: '3 3 18 18',
	collections: '0 0 24 24',
	chevronbottom: '4 4 17 17',
	chevronright: '3 3 18 18',
	dashboard: '0 0 24 24',
	info: '0 0 24 24',
	infofill: '0 0 24 24',
	chat: '0 0 24 24',
	check: '0 0 24 24',
	workflow: '0 0 24 24',
	attention: '0 0 16 16',
	eye: '0 0 24 24',
	eyeCrossed: '0 0 24 24',
	educationicon: '0 -1 26 26',
	members: '6 8 16 16',
	shield: '3 3 18 18',
	externallink: '0 0 24 24',
	checkicon: '0 0 24 24',
	loading: '0 0 24 24',
	cycle: '0 0 24 24',
	flag: '0 0 24 24',
	'metadata-complete': '0 0 16 16',
	'metadata-half-done': '0 0 16 16',
	'metadata-empty': '0 0 16 16',
	plusChunky: '6 6 24 24',
	tick: '6 6 12 12',
};

let source = axios.CancelToken.source();

const Icon = ({ name, size, color, fill, stroke, className, ml, mr, mb, mt, width, minWidth, maxWidth, inline, ...outerProps }) => {
	const [svg, setSvg] = useState();
	const commonStyles = useCommonStyles({ mt, mb, ml, mr, width, minWidth, maxWidth });

	useEffect(() => {
		const importIcon = async () => {
			await source.cancel('Cancelled icon');

			source = axios.CancelToken.source();

			import(`../../images/${name}.svg`).then(async ({ default: namedImport }) => {
				try {
					const { data } = await axios.get(namedImport, {
						cancelToken: source.token,
					});
					setSvg(data);
				} catch (e) {}
			});
		};

		if (name && !inline) importIcon();
	}, [name]);

	const iconProps = {
		css: styles.root({ size, color, fill, stroke }),
		className: cx('ui-Icon', className, commonStyles),
		...outerProps,
	};

	if (inline) {
		return (
			<span {...iconProps}>
				<SVGIcon name={name} fill='inherit' color='inherit' stroke='inherit' viewBox={svgFragments[name]} />
			</span>
		);
	} else if (!inline && svg) {
		return <span {...iconProps} dangerouslySetInnerHTML={{ __html: svg }} />;
	}

	return null;
};

Icon.propTypes = addCommonPropTypes({
	name: PropTypes.string.isRequired,
	size: PropTypes.oneOf(['xxs', 'xs', 'sm', 'md', 'default', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']),
	color: PropTypes.string,
	fill: PropTypes.string,
	stroke: PropTypes.string,
	inline: PropTypes.bool,
});

Icon.defaultProps = {
	size: 'default',
	color: 'inherit',
	fill: 'inherit',
	stroke: 'none',
	inline: false,
};

export default Icon;
