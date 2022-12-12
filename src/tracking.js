const recordVirtualPageView = pageTitle => {
    if (window.dataLayer) {
        window.dataLayer.push({ 'gtm.newHistoryState': pageTitle, event: 'virtual-page-view' });
    }
};

const recordEvent = (category, action, label) => {
    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'ga-event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
        });
    }
};

export default {
    recordVirtualPageView,
    recordEvent,
};
