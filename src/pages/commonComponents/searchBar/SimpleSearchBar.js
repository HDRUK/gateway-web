import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

import SVGIcon from '../../../images/SVGIcon';
import { ReactComponent as ColourLogoSvg } from '../../../images/colour.svg';
import { ReactComponent as ClearButtonSvg } from '../../../images/clear.svg';
import './SearchBar.scss';

var baseURL = require('../BaseURL').getURL();
var cmsURL = require('../BaseURL').getCMSURL();

class SimpleSearchBar extends React.Component {
	state = {
		textValue: '',
		userState: [
			{
				loggedIn: false,
				role: 'Reader',
				id: null,
				name: null,
			},
		],
	};

	constructor(props) {
		super(props);
		this.state.userState = props.userState;
	}

	changeText = e => {
		this.setState({ textValue: e.target.value });
		this.props.doUpdateSearchString(e.target.value);
	};

	render() {
		const { userState } = this.state;

		return (
			<div className='searchBarBackground'>
				<div>
					<span className='searchBarInputGrey'>
						<span className='searchInputIconGrey'>
							<SVGIcon name='searchicon' width={20} height={20} fill={'#2c8267'} stroke='none' type='submit' />
						</span>
						<span>
							<input
								type='text'
								placeholder='Search'
								id='searchInputSpanGrey'
								onChange={this.changeText}
								onKeyDown={this.props.doSearchMethod}
								value={this.props.searchString}
							/>
						</span>
						{/* {(this.props.searchString != '' && this.props.searchString != undefined) ?
                            <span className="searchInputClearGrey">
                                <a style={{ cursor: 'pointer' }} href={'/search?search='} >
                                    <ClearButtonSvg />
                                </a>
                            </span> : null} */}
					</span>
				</div>
			</div>
		);
	}
}

export default SimpleSearchBar;
