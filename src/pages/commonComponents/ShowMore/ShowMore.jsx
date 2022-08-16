import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Collapsable, Icon } from 'hdruk-react-core';

import { t } from 'i18next';
import { Button } from 'react-bootstrap';
import { ReactComponent as ArrowDown } from '../../../images/icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from '../../../images/icons/arrow-up.svg';
import './ShowMore.scss';

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
                <Button onClick={handleShowMore} variant='link' className='show-more'>
                    <span className='purple-14'>
                        {showMore ? (
                            <>
                                {t('hide')}
                                <Icon svg={<ArrowUp fill='inherit' />} size='xxs' ml={1} />
                            </>
                        ) : (
                            <>
                                {t('show')}
                                <Icon svg={<ArrowDown fill='inherit' />} size='xxs' ml={1} />
                            </>
                        )}
                    </span>
                </Button>
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
