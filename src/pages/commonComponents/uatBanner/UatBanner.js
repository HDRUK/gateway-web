import React, { useState } from 'react';
import './UatBanner.scss';

export const UatBanner = props => {
    const [currentEnv] = useState(props.currentEnv);

    return (
        <div class='uatBanner uatBannerText'>
            <span>
                {currentEnv} / This is a copy of the live website for the purposes of testing. Some features may not work as expected, such
                as institutional login.
            </span>
            <a
                class='floatRight uatBannerText'
                href='https://discourse.healthdatagateway.org/t/using-the-uat-environment/451'
                target='_blank'
                rel='noopener noreferrer'
            >
                Read more
            </a>
        </div>
    );
};

export default UatBanner;
