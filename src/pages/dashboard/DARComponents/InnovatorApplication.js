import React, { Fragment } from 'react';
import axios from 'axios';
import { Col, Container } from 'react-bootstrap/';
import Loading from '../../commonComponents/Loading';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import moment from 'moment';

var baseURL = require('../../commonComponents/BaseURL').getURL();

class InnovatorApplication extends React.Component {
    state = {
        data: {},
        dataset: '',
        isLoading: true,
    };

    constructor(props) {
        super(props);
        this.state.data = props.data;
    }

    componentDidMount() {
        this.getDatasetSearch();
    }

    getDatasetSearch = () => {
        this.setState({ isLoading: true });
        axios.get(baseURL + '/api/v1/datasets/' + this.state.data.dataSetId).then(res => {
            this.setState({
                dataset: res.data.data.label,
                isLoading: false,
            });
        });
    };

    getProgress = () => {
        switch (this.props.data.applicationStatus) {
            case 'presubmission':
                return 'Pre-submission';
            case 'submitted':
                return 'In review';
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';

            default:
                return '';
        }
    };

    render() {
        const { isLoading, dataset } = this.state;

        if (isLoading) {
            return (
                <Container>
                    <Loading />
                </Container>
            );
        }
        return (
            <Fragment>
                <Col sm={3} lg={3} className='pt-2 gray800-14'>
                    {moment(this.props.data.updatedAt).format('D MMMM YYYY HH:mm')}
                </Col>
                <Col sm={3} lg={3} className='pt-2 gray800-14'>
                    {dataset}
                </Col>
                <Col sm={4} lg={4} className='pt-2 gray800-14'>
                    {this.getProgress()}
                </Col>
                <Col sm={2} lg={2} className='pt-2 gray800-14'>
                    <DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
                        <Dropdown.Item href=''>View</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Fragment>
        );
    }
}

export default InnovatorApplication;
