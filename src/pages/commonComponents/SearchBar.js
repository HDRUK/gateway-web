import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

import SVGIcon from "../../images/SVGIcon";
import { ReactComponent as ColourLogoSvg } from '../../images/colour.svg';
import { ReactComponent as ClearButtonSvg } from '../../images/clear.svg';

import UserMenu from './UserMenu';

var baseURL = require('./BaseURL').getURL();
var cmsURL = require('./BaseURL').getCMSURL();

class SearchBar extends React.Component {

    state = {
        textValue: '',
        displayClearButton: true,
        userState: [{
            loggedIn: false,
            role: "Reader",
            id: null,
            name: null
        }]
    }

    constructor(props) {
        super(props);
        this.state.userState = props.userState;
    }

    changeText = (e) => {
        this.setState({ textValue: e.target.value, displayClearButton: e.target.value != '' });
        this.props.doUpdateSearchString(e.target.value);
    }

    render() {
        const { userState } = this.state;
        
        return (
            <>
                <div className="searchBarBackground">
                    <Row className="WhiteBackground">
                        <Col xs={{ span: 6, order: 1 }} lg={{ span: 2, order: 1 }}>
                            <div>
                                <a style={{ cursor: 'pointer' }} href={cmsURL} >
                                    <ColourLogoSvg className="ml-4 mt-3" />
                                </a>
                            </div>
                        </Col>
                        <Col xs={{ span: 12, order: 3 }} lg={{ span: 8, order: 2 }}>
                            <div>
                                <Container>
                                    <Row>
                                        <Col>
                                            <span className="SearchBarInputGrey">
                                                <span className="SearchInputIconGrey">
                                                    <SVGIcon name="searchicon" width={20} height={20} fill={'#2c8267'} stroke='none' type="submit" />
                                                </span>
                                                <span>
                                                    <input type="text" placeholder="Search" id="SearchInputSpanGrey" onChange={this.changeText} onKeyDown={this.props.doSearchMethod} value={this.props.searchString} />
                                                </span>
                                                {this.state.displayClearButton ?
                                                    <span className="SearchInputClearGrey">
                                                        <a style={{ cursor: 'pointer' }} href={'/search?search=&type=all&toolcategory=&programminglanguage=&features=&topics='} >
                                                            <ClearButtonSvg />
                                                        </a>
                                                    </span> : null}
                                            </span>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </Col>
                        <Col xs={{ span: 6, order: 2 }} lg={{ span: 2, order: 3 }}>
                            <div className="signLink">
                                <UserMenu userState={userState} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default SearchBar;