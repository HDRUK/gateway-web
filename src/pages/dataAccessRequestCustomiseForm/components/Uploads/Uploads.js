import React from 'react';
import { FileSelector } from 'components';

const Uploads = ({ maxFileSize, fileTypes }) => {
    return <FileSelector disabled maxFileSize={maxFileSize} fileTypes={fileTypes} />;
};

Uploads.defaultProps = {
    maxFileSize: 10000000,
    fileTypes: ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.key', '.pages', '.numbers', '.png', '.jpg', '.jpeg', '.csv', '.txt'],
};

export default Uploads;
