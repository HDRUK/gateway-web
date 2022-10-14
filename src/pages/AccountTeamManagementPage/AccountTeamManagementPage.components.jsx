import React from 'react';
import { isEmpty } from 'lodash';
import { Alert } from 'components';
import { Row, Col } from 'react-bootstrap';
import Loading from '../commonComponents/Loading';

const LoaderRow = () => (
    <Row>
        <Col xs={1} />
        <Col xs={10}>
            <Loading data-testid='isLoading' />
        </Col>
        <Col xs={1} />
    </Row>
);

const GeneratedAlerts = ({ alerts }) => {
    if (!isEmpty(alerts)) {
        return (
            <>
                {alerts.map(alert => {
                    const { type = '', message = '' } = alert;
                    return (
                        <Alert variant={type} key={`alert-${message}`} mt={2}>
                            {message}
                        </Alert>
                    );
                })}
            </>
        );
    }
    return null;
};

export { GeneratedAlerts, LoaderRow };
