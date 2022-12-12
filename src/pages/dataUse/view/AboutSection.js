import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import SVGIcon from '../../../images/SVGIcon';
import Guidance from '../../commonComponents/Guidance';

const AboutSection = props => {
    const { toolTipText, heading, id, showMoreButton, onClickHandler, showLess } = props;

    return (
        <>
            <Row className='soft-black-14 datause-view-grid '>
                <Col md={4}>
                    <span data-testid='section-heading'>{heading}</span>
                    {showMoreButton ? (
                        <button className='datause-arrow' onClick={onClickHandler} data-testid={`${id}-sm-button`}>
                            <SVGIcon
                                width='15px'
                                height='15px'
                                name='chevronbottom'
                                fill={'#475da7'}
                                className={showLess ? '' : 'flip180'}
                            />
                        </button>
                    ) : (
                        ''
                    )}
                </Col>
                <Guidance text={toolTipText} id={`${id}-ToolTip`} />
                <Col md={7}>{props.children}</Col>
            </Row>
        </>
    );
};

AboutSection.propTypes = {
    toolTipText: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    showMoreButton: PropTypes.bool,
    onClickHandler: PropTypes.func,
};

AboutSection.defaultProps = {
    onClickHandler: () => {},
    toolTipText: '',
    heading: '',
    showMoreButton: false,
    showLess: false,
};

export default AboutSection;
