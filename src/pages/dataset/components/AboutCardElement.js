import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Linkify from 'react-linkify';
import '../Dataset.scss';
import _ from 'lodash';
import { ReactComponent as InfoSVG } from '../../../images/info.svg';

class AboutCardElement extends React.Component {
    state = {
        label: '',
        description: '',
        tooltip: '',
        isHovering: false,
    };

    constructor(props) {
        super(props);
        this.state.label = props.label;
        this.state.description = props.description;
        this.state.tooltip = props.tooltip;
        this.handleMouseHover = this.handleMouseHover.bind(this);
    }

    handleMouseHover() {
        this.setState(this.toggleHoverState);
    }

    toggleHoverState(state) {
        return {
            isHovering: !state.isHovering,
        };
    }

    render() {
        const { label, description, tooltip, isHovering } = this.state;

        return (
            <div>
                <Row className='mt-2'>
                    <Col sm={3} className='gray800-14'>
                        {label}
                    </Col>

                    <Col sm={1}>
                        <span onMouseEnter={this.handleMouseHover} onMouseLeave={this.handleMouseHover}>
                            <InfoSVG id='datasetTooltipSvg' />
                        </span>
                    </Col>

                    {isHovering && (
                        <div className='datasetToolTip'>
                            <span className='white-13-semibold'>{tooltip}</span>
                        </div>
                    )}

                    {!description || (typeof description === 'object' && _.isEmpty(description)) ? (
                        <Col sm={8} className='v2Value'>
                            <span className='gray800-14-opacity'> Not specified </span>
                        </Col>
                    ) : (
                        <Col sm={8} className='gray800-14 v2Value'>
                            {typeof description === 'object' ? (
                                description.map((item, index) => (
                                    <Linkify key={`description-${index}`} properties={{ target: '_blank' }} className='overflowWrap'>
                                        {' '}
                                        {index !== 0 ? ', ' : ''} {item}
                                    </Linkify>
                                ))
                            ) : (
                                <Linkify properties={{ target: '_blank' }} className='overflowWrap'>
                                    {description}
                                </Linkify>
                            )}
                        </Col>
                    )}
                </Row>
            </div>
        );
    }
}

export default AboutCardElement;
