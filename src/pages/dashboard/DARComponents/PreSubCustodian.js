import React from 'react';
import {Row, Col, Container} from 'react-bootstrap/';
import Loading from '../../commonComponents/Loading'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import moment from 'moment';

import { axiosIG } from '../../../utils/axios.util';

class PreSubCustodian extends React.Component {

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
        this.getDataSearchFromDb();
        this.getDatasetSearch();
      }

    getDataSearchFromDb = () => {
        this.setState({ isLoading: true });
        axiosIG.get(`/api/v1/person/${this.state.data.userId}`)
          .then((res) => {
            if (typeof res.data.data[0] === "undefined" ) {
                this.setState({
                    name: ''
                  });
            } 
            else {
                this.setState({
                    name: res.data.data[0].firstname + ' ' + res.data.data[0].lastname
                  });
            }
          })
    };


    getDatasetSearch = () => {
        this.setState({ isLoading: true });
        axiosIG.get(`/api/v1/datasets/${this.state.data.dataSetId}`)
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

    onView = (e) => {
        e.preventDefault();
        console.log(this.props);
        alert('hi');
    } 

    render() {
        const { isLoading, name, dataset } = this.state; 

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
                <Col sm={2} lg={2}>
                    <span>{moment(this.props.data.updatedAt).format('D MMMM YYYY HH:mm')}</span>
                </Col>
                <Col sm={3} lg={3}>
                    <span > {dataset}</span>
                </Col>
                <Col sm={3} lg={3}>
                    <span> {name} </span>
                </Col>
                <Col sm={2} lg={2}>
                    <span >12/56 questions answered</span>
                </Col>
                <Col sm={2} lg={2} className="pr-5">
                    {/* <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                            <Dropdown.Item href="" onClick={e => this.onView(e)}>View</Dropdown.Item>
                    </DropdownButton> */}
                </Col>
            </Row>
            </div>
        );
    }
}

export default PreSubCustodian;