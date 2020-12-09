// /ShowObjects/Title.js
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ReactComponent as PersonPlaceholderSvg } from '../../../images/person-placeholder.svg';
import SVGIcon from '../../../images/SVGIcon';
import '../Dashboard.scss';

class DashboardKPI extends Component {
	render() {
		const kpiText = this.props.kpiText;
		const kpiValue = this.props.kpiValue;
		const percentageFlag = this.props.percentageFlag;

		return (
			<span>
				<Row className='kpiCard'>
					<Col sm={12} lg={12}>
						<Row className='text-left ml-2'>
							<span className='black-28 text-left' data-testid='kpiValue'>
								{' '}
								{percentageFlag === true ? kpiValue + '%' : kpiValue}{' '}
							</span>
						</Row>
						<Row className='text-left ml-2'>
							<span className='gray700-12' data-testid='kpiText'>
								{' '}
								{kpiText}{' '}
							</span>
						</Row>
					</Col>
				</Row>
			</span>
		);
	}
}

export default DashboardKPI;
