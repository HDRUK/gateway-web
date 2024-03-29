import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../../CommonComponents.scss';
import '../RelatedObject.scss';

const Description = ({ type, description }) => {
    return (
        <Col sm={12} lg={12} className='pad-top-24 pad-bottom-16'>
            <span className='gray800-14' data-testid={`${type}-description`}>
                {description}
            </span>
        </Col>
    );
};

Description.propTypes = {
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default Description;
