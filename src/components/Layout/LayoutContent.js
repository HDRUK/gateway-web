import { Col, Row } from 'react-bootstrap';

const LayoutContent = ({ children, ...outerProps }) => (
    <Row {...outerProps} className='ui-LayoutContent'>
        <Col xs={1} className='ui-LayoutContent--left' />
        <Col xs={10} className='ui-LayoutContent--content'>
            {children}
        </Col>
        <Col xs={1} className='ui-LayoutContent--right' />
    </Row>
);

export default LayoutContent;
