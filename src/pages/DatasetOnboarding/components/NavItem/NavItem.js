import { Fragment } from 'react';
import { isEmpty } from 'lodash';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { darHelperUtils } from 'utils';
import StatusDisplay from '../../../commonComponents/StatusDisplay';
import '../../DatasetOnboarding.scss';

const NavItem = ({ parentForm, questionPanels, onFormSwitchPanel, activePanelId, enabled, notForReview, completion }) => {
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
            return qPanels.map((item, index) => {
                if (parentForm.pageId === item.pageId && item.navHeader) {
                    let classes = item.panelId === activePanelId ? `${baseClasses} nav-item-active ` : baseClasses;
                    classes = notForReview === true ? `${classes} section-not-inreview` : `${classes} gray800-14`;
                    return (
                        <li className={classes} style={{ cursor: 'pointer' }} key={index} onClick={e => onClickItem(e, item)}>
                            <div>
                                <div className='completionIconHolder'>
                                    <OverlayTrigger
                                        key={item.navHeader}
                                        placement='top'
                                        overlay={
                                            <Tooltip id='tooltip-top'>
                                                {item.navHeader}: {completion[item.panelId]}
                                            </Tooltip>
                                        }>
                                        <div>
                                            <StatusDisplay section={item.navHeader} status={completion[item.panelId]} />
                                        </div>
                                    </OverlayTrigger>
                                </div>
                                <div className='titleHolder'>{item.navHeader}</div>
                                <div>{item.flag && <i className={darHelperUtils.flagPanelIcons[item.flag]} />}</div>
                            </div>
                        </li>
                    );
                }
            });
        }
    };

    return <>{buildNavItem()}</>;
};

export default NavItem;
