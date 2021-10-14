/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import SVGIcon from '../../../../images/SVGIcon';
import * as styles from './RemoveButton.styles';
import '../../CommonComponents.scss';
import '../RelatedObject.scss';

const RemoveButton = ({ removeButtonHandler }) => {
	return (
		<Button variant='medium' className='soft-black-14' onClick={removeButtonHandler} data-testid='remove-button'>
			<SVGIcon name='closeicon' fill={'#979797'} className='mr-2' css={styles.buttonSvg} />
			Remove
		</Button>
	);
};

RemoveButton.propTypes = {
	removeButtonHandler: PropTypes.func.isRequired,
};

export default RemoveButton;
