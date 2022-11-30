import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

const RenderMarkdown = ({ source, ...props }) => {
    return <ReactMarkdown source={source} {...props} />;
};

RenderMarkdown.propTypes = {
    source: PropTypes.string.isRequired,
};

export default RenderMarkdown;
