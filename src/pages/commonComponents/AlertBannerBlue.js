import React from 'react';
import Alert from 'react-bootstrap/Alert';
import './AlertBannerBlue.scss';
import { isEmpty } from 'lodash';

const AlertBannerBlue = props => {
    return (
        <Alert.Link
            target='_blank'
            className={props.className + ' ' + (!isEmpty(props.href) ? 'blue-banner blue-banner-hover' : 'blue-banner')}
            href={props.href}
            data-test-id={props.dataTestId}
        >
            {props.message}
        </Alert.Link>
    );
};

export default AlertBannerBlue;
