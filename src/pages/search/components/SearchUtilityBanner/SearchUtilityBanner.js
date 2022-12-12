import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import googleAnalytics from '../../../../tracking';

const SearchUtilityBanner = ({ onClick, step }) => {
    const handleOnClick = React.useCallback(() => {
        googleAnalytics.recordVirtualPageView('Data utility wizard');
        googleAnalytics.recordEvent('Datasets', 'Clicked edit data utility wizard', 'Reopened data utility wizard modal');
        onClick(step);
    }, [onClick, step]);

    return (
        <Alert variant='primary' className='blue-banner saved-preference-banner'>
            <Row>
                <Col>
                    <h5 className='indigo-bold-14'>Data utility wizard applied: Customer filters</h5>
                </Col>
            </Row>
            <Row>
                <Col md={9}>
                    You can continue to customise your filters below or edit alongside the search term in the data utility wizard.
                </Col>
                <Col md={3} className='data-utility-banner'>
                    <p className='data-utility-link' onClick={handleOnClick} role='button'>
                        Edit in data utility wizard
                    </p>
                </Col>
            </Row>
        </Alert>
    );
};

export default SearchUtilityBanner;
