import React, { Fragment } from 'react';
import {Col, Row } from 'react-bootstrap';
import './Dashboard.scss'; 

class TopSearches extends React.Component {

    state = {
        data: '',
     };

    constructor(props) {
        super(props)
        //binding the method to be able to use state
        this.state.data = props.data;
    }
 
    componentDidMount(){
        this.setState({state:this.state})
    }

    render() {
        const {data} = this.state;
        return (
            <Fragment>
                <Row className="entryBox"> 
                        <Col sm={5} lg={6} className="gray800-14" style={{"float":"left", "paddingLeft":"0px"}}>
                            <span style={{"float":"left", "paddingLeft":"15px"}} className="truncate">
                                {!data || !data._id ? 'search term' : <a href={"/search?search="+data._id} className="searchTermLink truncate" > {data._id} </a>}
                            </span>                
                        </Col>
                        <Col sm={2} lg={2} className="gray800-14">
                            <span style={{"float":"left"}}>
                                {!data || !data.count ? 'number of searches' : data.count}
                            </span>
                        </Col> 
                        <Col sm={5} lg={4} className="gray800-14">
                            <span style={{"paddingRight":"0px"}}>
                            {(data.datasets || 0) + ' datasets, ' + (data.tools || 0) + ' tools, ' + (data.projects || 0) + ' projects, ' + (data.papers || 0) + ' papers'}
                            </span>
                        </Col>
                </Row>
            </Fragment>
        )
    }
}

export default TopSearches;