
import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SVGIcon from "../../images/SVGIcon";

var baseURL = require('./BaseURL').getURL();

export default class DataSet extends React.Component {

    state = {
        data: [],
        isLoading: false
    }
    // on loading of tool detail page
    componentDidMount() {
        this.getDataSearchFromDb();

    }

    getDataSearchFromDb = () => {
        //need to handle error if no id is found
        this.setState({ isLoading: true });
        if (this.props.id === 9999999999) {
            this.setState({
                data: {
                    'label': 'Open Data - Medical appointment "no shows" - 2016 Brazil',
                    'description': 'Data shared by Joni Hoppen - Data Scientist at Aquarela Advanced Analytics Florianópolis, State of Santa Catarina, Brazil - available under the <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0 Llcense</a></br></br><a href="https://tre.healthresearch.tools" target="_blank">Deploy Matplotlib with this dataset</a>',
                    'id': 999999999,
                    'updatedon': "2020-02-07T12:14:03.134Z"
                },
                isLoading: false
            });

        } else {
            axios.get(baseURL + '/api/v1/datasets/' + this.props.id)
                .then((res) => {
                    this.setState({
                        data: {
                            'label': res.data.data.label,
                            'description': res.data.data.description,
                            'id': res.data.data.id,
                            'updatedon': res.data.data.lastUpdated
                        },
                        isLoading: false
                    })
                });
        }
    }

    render() {
        const { data } = this.state;

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var updatedDate = new Date(data.updatedon);
        var updatedOnDate = monthNames[updatedDate.getMonth()] + " " + updatedDate.getFullYear();

        let description;

        if (data.id === 999999999) {
            description = <p className="Gray800-14px" dangerouslySetInnerHTML={{ __html: data.description }} />

        } else {
            description = <p className="Gray800-14px">{data.description}</p>
        }

        return (
            <Row className="mt-2">
                <Col>
                    <div className="Rectangle">
                        <Row>
                            <Col xs={2} lg={1} className="iconHolder">
                                <SVGIcon name="dataseticon" width={22} height={24} fill={'#3db28c'} />
                            </Col>
                            <Col xs={10} lg={8}>
                                <p>
                                    <span className="Black-16px">{data.label}</span>
                                </p>
                                {description}

                            </Col>
                            <Col xs={{ span: 12, order: 1 }} lg={{ span: 3, order: 0 }} className="dateHolder mt-2">
                                <span className="Gray700-13px pr-1">
                                    Updated
                                    </span>
                                <span className="Gray700-13px pr-1">
                                    {updatedOnDate}
                                </span>
                            </Col>

                        </Row>
                    </div>
                </Col>
            </Row>
        );
    }
}