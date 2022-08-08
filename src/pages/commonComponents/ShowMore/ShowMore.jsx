import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Collapsable } from 'hdruk-react-core';

import { t } from 'i18next';
import { ReactComponent as ArrowDown } from '../../../images/icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from '../../../images/icons/arrow-up.svg';

const ShowMore = ({ children, initialHeight }) => {
    const [showMore, setShowMore] = useState(false);

    const handleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <Collapsable
            open={showMore}
            initialHeight={initialHeight}
            toggle={
                <a onClick={handleShowMore} className='show-more'>
                    <span className='purple-14'>
                        {showMore ? (
                            <>
                                {t('show.less')} <ArrowUp />
                            </>
                        ) : (
                            <>
                                {t('show.more')} <ArrowDown />
                            </>
                        )}
                    </span>
                </a>
            }>
            <div>{children}</div>
        </Collapsable>
    );
};

ShowMore.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    initialHeight: PropTypes.string,
};

ShowMore.defaultProps = {
    initialHeight: '25px',
};

export default ShowMore;
