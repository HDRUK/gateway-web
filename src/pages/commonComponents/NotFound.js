import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class NotFound extends React.Component {

    constructor(props) {
        super(props)
        this.state.word = props.word;
    }

    state = {
        word: "results"
    };

    render() {
        const { word } = this.state;

        return (
            <Row className="mt-2">
                <Col>
                    <div className="Rectangle">
                        <div className="Gray800-14px" style={{ textAlign: 'center' }}>
                            No {word} found
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default NotFound;