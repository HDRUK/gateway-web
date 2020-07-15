import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';

import { axiosIG } from '../../../utils/axios.util';

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
      axiosIG.post('/api/v1/counter/update', { id: id, counter: counter });
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
              <div className="rectangle">
                  <Row>
                    <Col sm={10} className="text-left ">
                      <p className="black-20"> {data.firstname} {data.lastname} </p>
                      {!data.bio ? '' : <p className='gray800-14'> {data.bio} </p>}
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
                        <span className='gray800-14'> ORCID </span>
                        <span className='purple-14'> {data.orcid} </span>
                      </Col>
                    }
                  </Row>
  
                  <Row>
                    {!data.link ? '' :
                      <Col xs={12} md={12}>
                        <span>
                          <a href={data.link} className="purple-14">
                            {data.link}
                          </a>
                        </span>
                      </Col>
                    }
                  </Row>
  
                  <Row>
                    <Col className="mt-2">
                      <span className='gray800-14'>
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