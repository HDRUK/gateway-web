import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Col, Container } from 'react-bootstrap/';
import Loading from '../../commonComponents/Loading';
import DropdownButton from 'react-bootstrap/DropdownButton';
import moment from 'moment';
import { baseURL } from '../../../configs/url.config';

const PreSubInnovator = ({ data }) => {
    useEffect(() => {
        getDatasetSearch();
    }, []);

    const [screenData, setScreenData] = useState(
        {
            data,
            name: '',
            dataset: '',
            publisher: '',
        },
        {}
    );

    const [isLoading, setLoading] = useState(false);

    const getDatasetSearch = () => {
        setLoading(true);
        axios
            .get(`${baseURL}/api/v1/datasets/${screenData.data.dataSetId}`)
            .then(res => {
                // state: {title, dataSetId: id, custodianEmail: contactPoint, publisher: publisher }}}
                let {
                    data: {
                        data: {
                            label,
                            quality: { publisher },
                        },
                    },
                } = res;
                setScreenData({ ...screenData, dataset: label, publisher });
                setLoading(false);
            })
            .catch(err => {
                console.error(err.message);
            });
    };

    if (isLoading) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

    return (
        <Fragment>
            <Col sm={2} lg={3} className='pt-2 gray800-14'>
                {moment(screenData.data.updatedAt).format('D MMMM YYYY HH:mm')}
            </Col>
            <Col sm={3} lg={3} className='pt-2 gray800-14'>
                {screenData.dataset}
            </Col>
            <Col sm={3} lg={4} className='pt-2 gray800-14'>
                7/56 questions answered
            </Col>
            <Col sm={2} lg={2} className='pt-2 gray800-14'>
                <DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
                    <Link
                        className={'black-14 dropdown-item'}
                        to={{
                            pathname: `/data-access-request/dataset/${screenData.data.dataSetId}`,
                            state: {
                                title: screenData.dataset,
                                dataSetId: screenData.data.dataSetId,
                                custodianEmail: '',
                                publisher: screenData.publisher,
                            },
                        }}
                    >
                        View
                    </Link>
                </DropdownButton>
            </Col>
        </Fragment>
    );
};

export default PreSubInnovator;
