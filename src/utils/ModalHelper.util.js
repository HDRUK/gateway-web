const toggleDrawer = parentComponent => {
    parentComponent.setState(prevState => {
        if (prevState.showDrawer === true) {
            parentComponent.searchBar.current.getNumberOfUnreadMessages();
        }
        return { showDrawer: !prevState.showDrawer };
    });
};

const toggleModal = (parentComponent, showEnquiry = false, context = {}) => {
    parentComponent.setState(prevState => {
        return {
            showModal: !prevState.showModal,
            context,
        };
    });

    if (showEnquiry) {
        toggleDrawer(parentComponent);
    }
};

const toggleMrcModal = parentComponent => {
    parentComponent.setState(prevState => {
        return { showMrcModal: !prevState.showMrcModal };
    });
};

export default {
    toggleDrawer,
    toggleModal,
    toggleMrcModal,
};
