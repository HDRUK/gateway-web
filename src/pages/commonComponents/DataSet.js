
import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SVGIcon from "../../images/SVGIcon";
import Loading from './Loading'

var baseURL = require('./BaseURL').getURL();

class DataSet extends React.Component {

    state = {
        data: [],
        isLoading: false,
        detailsData: []
    }

    constructor(props) {
        super(props)
        if (props.data) {
            this.state.data = props.data;
            this.state.isLoading = false;
        }
    }

    componentDidMount() {
        this.getDetailsSearchFromMDC();
      }

      getDetailsSearchFromMDC = () => {
        axios.get(baseURL + '/api/v1/datasets/detail/' + this.state.data.id)
            .then((res) => {
                this.setState({
                    detailsData: res.data.data
                });
            })
      };

    render() {
        const { data, detailsData } = this.state;

        return (
            <Row className="mt-2">
                <Col>
                    <div className="Rectangle">
                        <Row>
                            <Col xs={2} lg={1} className="iconHolder">
                                <SVGIcon name="dataseticon" width={22} height={24} fill={'#3db28c'} />
                            </Col>
                            <Col xs={10} lg={11}>
                                <p>
                                    <span ><a className="Black-16px" style={{ cursor: 'pointer' }} href={'/dataset/' + data.id} > {data.title ? data.title.substr(0, 75) + (data.title.length > 75 ? '...' : '') : ''} </a></span>
                                    <br/>
                                    <span className="Gray800-14px">{detailsData ? detailsData.publisher ? detailsData.publisher : '' : ''}
                                    </span>
                                </p>
                                <p>
                                </p>
                                <p className="Gray800-14px">
                                    {data && data.description ? (data.description.substr(0, 125) + (data.description.length > 125 ? '...' : '' )) : (detailsData && detailsData.abstract ? (detailsData.abstract.substr(0,125) + (detailsData.abstract.length > 125 ? '...' : '') ) : "")}    
                                </p>

                            </Col>

                        </Row>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default DataSet;