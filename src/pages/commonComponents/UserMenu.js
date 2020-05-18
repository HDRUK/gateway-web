import React, { Component, useState } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';


import LoginModal from '../commonComponents/LoginModal';

import { ReactComponent as ArrowDownSvg } from '../../images/stock.svg';
import { ReactComponent as ArrowDownSvgWhite } from '../../images/arrowDownWhite.svg';

var baseURL = require('./BaseURL').getURL();

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a href="" ref={ref} onClick={e => { e.preventDefault(); onClick(e); }} >
      {children}
  </a>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value] = useState('');

      return (
          <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
              <ul className="list-unstyled">
                  {React.Children.toArray(children).filter(
                      child =>
                          !value || child.props.children.toLowerCase().startsWith(value),
                  )}
              </ul>
          </div>
      );
  },
);

class UserMenu extends Component {

  state = {
    data: [],
    textValue: '',
    userState: [{
        loggedIn: false,
        role: "Reader",
        id: null,
        name: null
    }],
    isLanding: false,
    requestDetails: null
  }

  constructor(props) {
    super(props);
    this.state.userState = props.userState;
    this.state.isLanding = props.isLanding;
    this.state.requestDetails = props.requestDetails;
  }

  logout = (e) => {
    axios.get(baseURL + '/api/v1/auth/logout')
        .then((res) => {
            window.location.href = "/";
        });
  }

  render() {
    const { data, userState, isLanding, requestDetails } = this.state;
    
    return (
      <>
        {(() => {
            if (userState[0].loggedIn === true) {
                return (
                    <Dropdown>
                        {isLanding ? 
                         <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                              <span className="landingPageAccountText">{userState[0].name}</span>
                              <span className="accountDropDownGap"></span>< ArrowDownSvgWhite />
                          </Dropdown.Toggle>
                          :
                          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                              <span className="pageAccountText">{userState[0].name}</span>
                              <span className="accountDropDownGap"></span>< ArrowDownSvg />
                          </Dropdown.Toggle>
                        }

                        <Dropdown.Menu as={CustomMenu}>
                            <Dropdown.Item href="/account?tab=youraccount">Your Account</Dropdown.Item>
                            <Dropdown.Item href="/account?tab=messages">Notifications</Dropdown.Item>
                            <Dropdown.Item href="/account?tab=projects">Project</Dropdown.Item>
                            <Dropdown.Item href="/account?tab=tools">Tools</Dropdown.Item>
                            <Dropdown.Item href="/account?tab=reviews">Reviews</Dropdown.Item>
                            <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )
            }
            else {
                return (<>
                      <LoginModal data={data} userState={userState} isLanding={isLanding} requestDetails={requestDetails}/>
                    </>
                )
            }
        })()}
      </>
    );
    }
}

export default UserMenu;