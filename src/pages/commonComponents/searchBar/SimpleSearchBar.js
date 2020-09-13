import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SVGIcon from "../../../images/SVGIcon";
import './SearchBar.scss'; 

class SimpleSearchBar extends React.Component {

    state = {
        textValue: '',
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
        this.setState({ textValue: e.target.value });
        this.props.doUpdateSearchString(e.target.value);
    }

    render() {
        return (
            <>
                <div className="searchBarBackground">
                    <Row >
                        <Col xs={12} lg={12}>
                            <div>
                                <span className="searchBarInputGrey">
                                    <span className="searchInputIconGrey">
                                        <SVGIcon name="searchicon" width={20} height={20} fill={'#2c8267'} stroke='none' type="submit" />
                                    </span>
                                    <span>
                                        <input type="text" placeholder="Search" id="searchInputSpanGrey" 
                                        onChange={this.changeText} 
                                        onKeyDown={this.props.doSearchMethod} value={this.props.searchString} />
                                    </span>
                                    {/* {(this.props.searchString != '' && this.props.searchString != undefined) ?
                                        <span className="searchInputClearGrey">
                                            <a style={{ cursor: 'pointer' }} href={'/search?search='} >
                                                <ClearButtonSvg />
                                            </a>
                                        </span> : null} */}
                                </span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default SimpleSearchBar;