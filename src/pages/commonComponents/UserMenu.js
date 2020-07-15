import React, { Component, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import { axiosIG } from '../../utils/axios.util';
import LoginModal from '../commonComponents/LoginModal';

import { ReactComponent as ArrowDownSvg } from '../../images/stock.svg';

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
    axiosIG.get('/api/v1/auth/logout')
        .then((res) => {
          window.location.reload();
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
                        
                          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                              <span className="black-14">{userState[0].name}{userState[0].name}</span>
                              <span className="accountDropDownGap"></span>< ArrowDownSvg />
                          </Dropdown.Toggle>
                        

                        <Dropdown.Menu as={CustomMenu}>
                            <Dropdown.Item href="/account?tab=youraccount" className="black-14">Your Account</Dropdown.Item>
                            <Dropdown.Item href="/account?tab=tools" className="black-14">Tools</Dropdown.Item>
                            <Dropdown.Item href="/account?tab=reviews" className="black-14">Reviews</Dropdown.Item>
                            <Dropdown.Item href="/account?tab=projects" className="black-14">Projects</Dropdown.Item>
                            <Dropdown.Item href="/account?tab=dataaccessrequests" className="black-14">Data access requests</Dropdown.Item>
                            <Dropdown.Item href="/account?tab=usersroles" className="black-14">Users and roles</Dropdown.Item>
                            <Dropdown.Item onClick={this.logout} className="black-14">Logout</Dropdown.Item>
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