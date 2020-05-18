import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';

var baseURL = require('./BaseURL').getURL();

class Login extends React.Component {
  render() {
    return (
      <div>
        <Row className='mt-2'>
          <Col sm={1} lg={1} />
          <Col sm={10} lg={10}>
            <span className='Gray800-14px'>
              You can sign in or create a new account using your existing
              Linkedin, Google or OpenAthens account.
            </span>
          </Col>
          <Col sm={1} lg={1} />
        </Row>

        <Row className='mt-3'>
          <Col sm={1} lg={1} />
          <Col sm={10} lg={10}>
            <div className='Gray800-14px' style={{ textAlign: 'center' }}>
              <a href={baseURL + '/auth/linkedin'}>
                <Image
                  style={{ width: '200px' }}
                  src={require('../../images/Linkedin-default.png')}
                />
              </a>
            </div>
          </Col>
          <Col sm={1} lg={1} />
        </Row>

        <Row className='mt-2'>
          <Col sm={1} lg={1} />
          <Col sm={10} lg={10}>
            <div className='Gray800-14px' style={{ textAlign: 'center' }}>
              <a href={baseURL + '/auth/google'}>
                <Image
                  style={{ width: '200px' }}
                  src={require('../../images/Google-default.png')}
                />
              </a>
            </div>
          </Col>
          <Col sm={1} lg={1} />
        </Row>

        <Row className='mt-3'>
          <Col sm={1} lg={1} />
          <Col sm={10} lg={10}>
            <div className='Gray800-14px' style={{ textAlign: 'center' }}>
              <a href={baseURL + '/auth/oidc'} className='openAthensButton'>
                Sign in with OpenAthens
              </a>
            </div>
          </Col>
          <Col sm={1} lg={1} />
        </Row>
      </div>
    );
  }
}

export default Login;
