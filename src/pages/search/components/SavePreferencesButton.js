import React from 'react';
import SVGIcon from '../../../images/SVGIcon';
import { Button } from 'react-bootstrap';


const SavePreferencesButton = (props) => {
    return (<Button
                variant='tertiary'
                className='arrow'
                aria-haspopup='true'
                onClick={
                    this.state.userState[0].loggedIn === false
                        ? () => this.showLoginModal()
                        : () => this.showSavedPreferencesModal()
                }>
                Save
                <SVGIcon
                    width='35px'
                    height='35px'
                    name='arrow-down'
                    fill='#3C3C3B'
                    className={this.state.closed ? '' : 'flip180'}
                />{props.children}
            </Button>
)}
                            
export default SavePreferencesButton