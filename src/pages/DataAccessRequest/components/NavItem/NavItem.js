import React from 'react';
import { isEmpty } from 'lodash';
import DarHelper from '../../../../utils/DarHelper.util';
import '../../DataAccessRequest.scss';

const NavItem = ({ parentForm, questionPanels, onFormSwitchPanel, activePanelId, enabled, notForReview, questionSetStatus }) => {
    const onClickItem = (e, panel) => {
        e.preventDefault();
        if (enabled) {
            onFormSwitchPanel(panel);
        }
    };

    const buildNavItem = () => {
        const qPanels = [...questionPanels];
        const baseClasses = 'dar-nav-item text-size-small ';

        if (!isEmpty(qPanels)) {
            const filteredQPanels = qPanels.filter(({ panelId }) => {
                return questionSetStatus[panelId] !== 0;
            });

            return filteredQPanels.map((item, index) => {
                if (parentForm.pageId === item.pageId && item.navHeader) {
                    let classes = item.panelId === activePanelId ? `${baseClasses} nav-item-active ` : baseClasses;
                    classes = notForReview === true ? `${classes} section-not-inreview` : `${classes} gray800-14`;

                    return (
                        <li className={classes} style={{ cursor: 'pointer' }} key={index} onClick={e => onClickItem(e, item)}>
                            <span>{item.navHeader}</span>
                            <span>{item.flag && <i className={DarHelper.flagPanelIcons[item.flag]} />}</span>
                        </li>
                    );
                }
            });
        }
    };

    return <>{buildNavItem()}</>;
};

export default NavItem;
