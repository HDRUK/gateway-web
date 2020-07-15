import React from 'react';
import {Row, Col, Container} from 'react-bootstrap/';
import Loading from '../../commonComponents/Loading'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import moment from 'moment';

import { axiosIG } from '../../../utils/axios.util';

class InnovatorApplication extends React.Component {

    state = {
        data: {},
        name: '',
        dataset: '',
        isLoading: true
    }

    constructor(props) {
        super(props)
        this.state.data = props.data;
    }

    componentDidMount() {
        this.getDatasetSearch();
      }

    getDatasetSearch = () => {
        this.setState({ isLoading: true });
        axiosIG.get('/api/v1/datasets/' + this.state.data.dataSetId)
          .then((res) => {
            this.setState({
              dataset: res.data.data.label,
              isLoading: false
            });
          })
      };

    getProgress = () =>{
        switch(this.props.data.applicationStatus){
            case "presubmission":
                return "Pre-submission";
            case "submitted":
                return "In review";
            case "approved":
                return "Approved";
            case "rejected":
                return "Rejected";

            default:
                return "";
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
            <div className="DARDiv" >

                <Row className="pl-3">
                    <Col sm={3} lg={3}>
                        <span>{moment(this.props.data.updatedAt).format('D MMMM YYYY HH:mm')}</span>
                    </Col>
                    <Col sm={3} lg={3}>
                        <span > {dataset}</span>
                    </Col>
                    <Col sm={4} lg={4}>
                        <span>{this.getProgress()}</span>
                    </Col>
                    <Col sm={2} lg={2} className="pr-5">
                        <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                <Dropdown.Item href="">View</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
             </div>
        );
    }
}

export default InnovatorApplication;