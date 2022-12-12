import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

class MessageNotFound extends React.Component {
    handleClick = () => {
        window.location.reload();
    };

    render() {
        return (
            <Row className='entryBox noMargin margin-bottom-16'>
                <Col>
                    <div className='gray800-14' style={{ textAlign: 'center' }} data-testid='MessageNotFound'>
                        {this.props.text ? this.props.text : `No ${this.props.word || 'results'} found`}
                        {this.props.retry && (
                            <div>
                                <Button variant='link' onClick={this.handleClick}>
                                    Retry request
                                </Button>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        );
    }
}

export default MessageNotFound;
