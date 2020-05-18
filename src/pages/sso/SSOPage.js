import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { ReactComponent as WhiteLogoSvg } from '../../../src/images/white.svg';
import Login from '../commonComponents/Login';
import axios from 'axios';

const baseURL = require('../commonComponents/BaseURL').getURL();

class SSOPage extends Component {
  state = {
    userState: [
      {
        loggedIn: false,
        role: 'Reader',
        id: null,
        name: null,
      },
    ],
    isLoading: false,
    renderPage: false,
  };

  constructor(props) {
    super(props);
    if (props.userState) {
      this.state.userState = props.userState;
    }
  }

  componentDidMount() {
    const url = `${window.location.search}`;
    axios
    .get(`${baseURL}/api/v1/auth/soo/discourse${url}`)
    .then((res) => {
      if (res.status === 200 && res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else {
        this.setState({renderPage: true});
      }
    })
    .catch(err => {
        this.setState({renderPage: true});
    })
  }

  render() {
    const { renderPage } = this.state;
    return (
      renderPage && (
        <div className='LandingBackground'>
          <Row className='pt-5 pl-5'>
            <Col xs={{ span: 6, order: 1 }} lg={{ span: 6, order: 1 }}>
              {' '}
              <WhiteLogoSvg />{' '}
            </Col>
          </Row>
          <Container>
            <div className='login-content mt-4'>
              <div className='login-body mb-4'>
                <Row className='mt-3'>
                  <Col xs={1} md={1} />
                  <Col xs={10} md={10}>
                    <span className='Black-20px'>
                      Sign in or create a new account
                    </span>
                  </Col>
                  <Col xs={1} md={1}></Col>
                </Row>
                <Login />
              </div>
            </div>
          </Container>
        </div>
      )
    );
  }
}

export default SSOPage;
