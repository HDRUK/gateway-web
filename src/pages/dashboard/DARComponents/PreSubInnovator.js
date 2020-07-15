import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {Row, Col, Container} from 'react-bootstrap/';
import Loading from '../../commonComponents/Loading'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import moment from 'moment';

import { axiosIG } from '../../../utils/axios.util';

const PreSubInnovator = ({ data }) => {

    useEffect(() => {
        getDatasetSearch();
    }, []);

    const [screenData, setScreenData] = useState({
        data,
        name: '',
        dataset: '',
        publisher: ''
    }, {});

    const [isLoading, setLoading] = useState(false);

    const getDatasetSearch = () => {
        setLoading(true);
        axiosIG.get(`/api/v1/datasets/${screenData.data.dataSetId}`)
            .then((res) => {
                // state: {title, dataSetId: id, custodianEmail: contactPoint, publisher: publisher }}}
                let {data: {data: { label, quality: { publisher} }}} = res;
                setScreenData({...screenData, dataset: label, publisher});
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    if (isLoading) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

    return (
        <div>
            <Row className="pl-3">
                <Col sm={3} lg={3}>
                    <span>{moment(screenData.data.updatedAt).format('D MMMM YYYY HH:mm')}</span>
                </Col>
                <Col sm={3} lg={3}>
                    <span >{screenData.dataset}</span>
                </Col>
                <Col sm={4} lg={4}>
                    <span>7/56 questions answered</span>
                </Col>
                <Col sm={2} lg={2} className="pr-5">
                    <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                        <Link className={'black-14 dropdown-item'} to={{
                            pathname: `/data-access-request/dataset/${screenData.data.dataSetId}`, 
                            state: { title: screenData.dataset, dataSetId: screenData.data.dataSetId, custodianEmail: '', publisher: screenData.publisher }}}>View</Link>
                    </DropdownButton>
                </Col>
            </Row>
        </div>
    );
}


export default PreSubInnovator;