import React, { Component } from 'react';
import axios from 'axios';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

var baseURL = require('../../commonComponents/BaseURL').getURL();

class PersonTitle extends Component {

    constructor(props) {
      super(props)
      this.state.data = props.data;
    }
  
    // initialize our state
    state = {
      data: [],
      id: this.props.data.id,
      counter: this.props.data.counter
    };
  
    componentDidMount(props) {
      let counter = !this.props.data.counter ? 1 : this.props.data.counter + 1;
      this.UpdateCounter(this.props.data.id, counter);
    }
  
    UpdateCounter = (id, counter) => {
      axios.post(baseURL + '/api/v1/counter/update', { id: id, counter: counter });
    }
  
    // here is our UI
    // it is easy to understand their functions when you
    // see them render into our screen
    render() {
      const { data } = this.state;
  
      return (
        <div>
          <Row className="mt-2">
            <Col sm={1} lg={1} />
            <Col sm={10} lg={10}>
              <div className="Rectangle">
                  <Row>
                    <Col sm={10} className="text-left ">
                      <p className="Black-20px"> {data.firstname} {data.lastname} </p>
                      {!data.bio ? '' : <p className='Gray800-14px'> {data.bio} </p>}
                    </Col>
                    <Col sm={2} className="text-right">
                      <div class="avatar-circle">
                        <span class="initials">{data.firstname.charAt(0).toUpperCase()}{data.lastname.charAt(0).toUpperCase()}</span>
                      </div>
                    </Col>
                  </Row>
  
                  <Row>
                    {!data.orcid ? '' :
                      <Col xs={12} md={12}>
                        <span className='Gray800-14px'> ORCID </span>
                        <span className='Purple-14px'> {data.orcid} </span>
                      </Col>
                    }
                  </Row>
  
                  <Row>
                    {!data.link ? '' :
                      <Col xs={12} md={12}>
                        <span>
                          <a href={data.link} className="Purple-14px">
                            {data.link}
                          </a>
                        </span>
                      </Col>
                    }
                  </Row>
  
                  <Row>
                    <Col className="mt-2">
                      <span className='Gray800-14px'>
                        {data.counter === undefined ? 1 : data.counter + 1}
                        {data.counter === undefined ? ' view' : ' views'}
                      </span>
                    </Col>
                  </Row>
                
              </div>
            </Col>
            <Col sm={1} lg={1} />
          </Row>
        </div>
      );
    }
  }
  
  export default PersonTitle;