import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

const RenderMarkdown = ({ source, ...props }) => {
    return <ReactMarkdown {...props}>{source}</ReactMarkdown>;
};

RenderMarkdown.propTypes = {
    source: PropTypes.string.isRequired,
};

export default RenderMarkdown;
