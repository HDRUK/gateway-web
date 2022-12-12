let toggleDrawer = parentComponent => {
    parentComponent.setState(prevState => {
        if (prevState.showDrawer === true) {
            parentComponent.searchBar.current.getNumberOfUnreadMessages();
        }
        return { showDrawer: !prevState.showDrawer };
    });
};

let toggleModal = (parentComponent, showEnquiry = false, context = {}) => {
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

let toggleMrcModal = parentComponent => {
    parentComponent.setState(prevState => {
        return { showMrcModal: !prevState.showMrcModal };
    });
};

export default {
    toggleDrawer: toggleDrawer,
    toggleModal: toggleModal,
    toggleMrcModal: toggleMrcModal,
};
