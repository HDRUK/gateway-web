
// /ShowObjects/Title.js
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ReactComponent as PersonPlaceholderSvg } from '../../images/person-placeholder.svg';
import './CommonComponents.scss';  

class  Creators extends Component {
  render() {
    const { author } = this.props;
    return (
      <span>
        <a data-testid="href" href={'/person/' + author.id} >
            <div className="authorCardHolder">
            <Row className="authorCard">  
                <Col sm={2}>
                    <PersonPlaceholderSvg />
                </Col>
                <Col sm={10} className="text-left ">
                    <span className="black-16" data-testid="name"> {author.firstname} {author.lastname} </span>
                    <br /> 
                    <span className="gray700-13" data-testid="bio"> {author.bio} </span>
                </Col>
                <Col sm={2} />
            </Row>
            </div>
        </a>
      </span>
    );
  }
}

export default Creators; 