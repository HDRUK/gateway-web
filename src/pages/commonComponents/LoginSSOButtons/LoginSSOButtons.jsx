/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useEffect, useReducer, Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import '../CommonComponents.scss';
import * as styles from './LoginSSoButtons.styles';
import lastChoiceSVG from '../../../images/lastChoice.svg';

const reducer = (ssoBtnsState, lastChoice) => {
	return ssoBtnsState.map(value => {
		value.active = false;
		if (value.id === lastChoice) {
			value.active = true;
		}
		return value;
	});
};

function LoginSSOButtons({ ssoBtnsConfig, communityLink, clickHandler, lastChoice }) {
	const [ssoBtnsState, dispatch] = useReducer(reducer, ssoBtnsConfig);

	useEffect(() => {
		if (lastChoice) {
			dispatch(lastChoice);
		}
	}, [lastChoice]);

	return (
		<div>
			{chunk(ssoBtnsState, 2).map((arr, index) => (
				<Fragment key={index}>
					<br />
					<Row className='mt-2'>
						<Col sm={0} lg={1} />
						{arr.map((value, i) => (
							<Col sm={6} lg={5} key={value.id + i} className='mt-1'>
								<div className='gray800-14'>
									<button
										data-testid={value.id}
										className='btn btn-outline-secondary btn-block'
										css={styles.btn}
										onClick={() => clickHandler(value.id, value.authURL)}>
										<img src={value.img} css={styles.btnImg} alt={value.id} />
										&nbsp; {value.text}
										{value.active ? (
											<img src={lastChoiceSVG} css={styles.lastChoiceBtnImg} data-testid={value.id + '-lastChoice'} alt='lastChoice' />
										) : null}
									</button>
								</div>
							</Col>
						))}
						<Col sm={0} lg={1} key={'col-1-' + index} />
					</Row>
				</Fragment>
			))}
			<div css={styles.supportLink}>
				<Row className='mt-5 '>
					<Col sm={0} lg={1} />
					<Col sm={6} lg={5}>
						<span>
							{' '}
							<a
								target='_blank'
								href={`${communityLink}/t/how-to-submit-a-feature-request-or-feedback/1`}
								data-testid='communityLink'
								rel='noopener noreferrer'>
								Suggest another Indentity Provider
							</a>
						</span>
					</Col>
					<Col sm={6} lg={5}>
						{lastChoice ? (
							<span>
								<img src={lastChoiceSVG} css={styles.btnImg} data-testid='lastChoiceNote' alt='lastChoice' /> Last time you clicked this
								button
							</span>
						) : null}
					</Col>
					<Col sm={0} lg={1} />
				</Row>
			</div>
		</div>
	);
}

LoginSSOButtons.propTypes = {
	clickHandler: PropTypes.func.isRequired,
	communityLink: PropTypes.string.isRequired,
	lastChoiceSVG: PropTypes.string,
	ssoBtnsConfig: PropTypes.array.isRequired,
};

export default LoginSSOButtons;
