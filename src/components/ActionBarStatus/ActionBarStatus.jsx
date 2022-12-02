import { cx } from '@emotion/css';

import PropTypes from 'prop-types';
import { Box } from 'hdruk-react-core';
import { addCommonPropTypes } from '../../configs/propTypes';
import { dateFormats } from '../../utils/GeneralHelper.util';

const ActionBarStatus = ({ status, dataset, totalQuestions, className, mt, mb, ml, mr, width, minWidth, maxWidth, ...outerProps }) => {
    const {
        timestamps: { published, submitted, rejected, archived },
    } = dataset;

    let content = null;

    switch (status) {
        case 'draft':
            content = totalQuestions;

            break;
        case 'active':
            content = `This version was published on ${dateFormats(published).dateOnly}`;

            break;
        case 'inReview':
            content = `Submitted for review on ${dateFormats(submitted).dateOnly}`;

            break;
        case 'rejected':
            content = `This version was rejected on ${dateFormats(rejected).dateOnly}`;

            break;
        case 'archived':
            content = `This version was published on ${dateFormats(published).dateOnly} and archived on ${dateFormats(archived).dateOnly}`;

            break;
        default:
            break;
    }

    return (
        <Box {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}>
            <div {...outerProps} className={cx('action-bar-status', 'ui-ActionBarStatus', className)}>
                {content}
            </div>
        </Box>
    );
};

ActionBarStatus.propTypes = addCommonPropTypes({
    dataset: PropTypes.shape({
        timestamps: PropTypes.shape({
            published: PropTypes.string,
            submitted: PropTypes.string,
            rejected: PropTypes.string,
            archived: PropTypes.string,
        }),
    }),
    totalQuestions: PropTypes.string,
    status: PropTypes.oneOf(['draft', 'active', 'inReview', 'rejected', 'archived']),
});

ActionBarStatus.defaultProps = {
    className: 'padding-md',
};

export default ActionBarStatus;
