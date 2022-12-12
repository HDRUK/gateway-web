// /ShowObjects/Title.js
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../Dashboard.scss';
import CountUp from 'react-countup';
import _ from 'lodash';

class DashboardKPI extends Component {
    render() {
        const { kpiText, kpiValue, percentageFlag, testId } = this.props;

        let overallStats = ['total datasets', 'datasets with technical metadata', 'unique registered users', 'uptime in current month'];

        return (
            <span>
                <Row className='kpiCard'>
                    <Col sm={12} lg={12}>
                        <Row className='text-left ml-2'>
                            <span className='black-28 text-left' data-test-id={testId}>
                                {_.isEmpty(kpiText) ? (
                                    ''
                                ) : overallStats.includes(kpiText) ? (
                                    kpiValue
                                ) : kpiText === 'uptime this month' ? (
                                    <CountUp end={kpiValue} decimals={2} />
                                ) : (
                                    <CountUp end={kpiValue} />
                                )}

                                {percentageFlag === true ? '%' : ''}
                            </span>
                        </Row>

                        <Row className='text-left ml-2'>
                            <span className='gray700-12' data-test-id='kpiText'>
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
