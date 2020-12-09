import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import Loading from './Loading';
import './CommonComponents.scss';

var baseURL = require('./BaseURL').getURL();

class Login extends React.Component {
	showWayFinder = e => {
		document.getElementById('loginWayFinder').style.display = 'block';
		document.getElementById('loginButtons').style.display = 'none';
	};

	hideWayFinder = e => {
		document.getElementById('loginButtons').style.display = 'block';
		document.getElementById('loginWayFinder').style.display = 'none';
	};

	render() {
		return (
			<div className='mb-1'>
				<div id='loginButtons'>
					<Row className='mt-2'>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10}>
							<span className='gray800-14'>
								You can sign in or create a new account using your existing Linkedin, Google or institution account.
							</span>
						</Col>
						<Col sm={1} lg={1} />
					</Row>
					<Row className='mt-5'>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10}>
							<div className='gray800-14' style={{ textAlign: 'center' }}>
								<a href={baseURL + '/auth/linkedin'} className='loginButtonHolder'>
									<Image className='loginImageOn' src={require('../../images/Linkedin-default.png')} />
									<Image className='loginImageOff' src={require('../../images/Linkedin-hover.png')} />
								</a>
							</div>
						</Col>
						<Col sm={1} lg={1} />
					</Row>

					<Row className='mt-3'>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10}>
							<div className='gray800-14' style={{ textAlign: 'center' }}>
								<a href={baseURL + '/auth/google'} className='loginButtonHolder'>
									<Image className='loginImageOn' src={require('../../images/Google-default.png')} />
									<Image className='loginImageOff' src={require('../../images/Google-hover.png')} />
								</a>
							</div>
						</Col>
						<Col sm={1} lg={1} />
					</Row>

					<Row className='mt-3'>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10}>
							<div className='gray800-14' style={{ textAlign: 'center' }}>
								<a href='#' onClick={this.showWayFinder} className='loginButtonHolder'>
									<Image className='loginImageOn' src={require('../../images/open-athens-default.png')} />
									<Image className='loginImageOff' src={require('../../images/open-athens-hover.png')} />
								</a>
							</div>
						</Col>
						<Col sm={1} lg={1} />
					</Row>
				</div>

				<div id='loginWayFinder' style={{ display: 'none' }}>
					<Row className='mt-3 text-center'>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10}>
							<a href='#' onClick={this.hideWayFinder} className='purple-14'>
								Show all login options
							</a>
						</Col>
						<Col sm={1} lg={1} />
					</Row>

					<Row className='mt-4'>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10}>
							<div id='wayfinder'>
								<div className='gray800-14' style={{ textAlign: 'center' }}>
									<Image src={require('../../images/Loader.gif')} />
								</div>
								<div className='gray800-14' style={{ textAlign: 'center' }}>
									Loading...
									<br />
									<br />
									<a href={baseURL + '/auth/oidc'} className='purple-14'>
										Click here if login screen does not load
									</a>
								</div>
							</div>
						</Col>
						<Col sm={1} lg={1} />
					</Row>
				</div>
			</div>
		);
	}
}

export default Login;
