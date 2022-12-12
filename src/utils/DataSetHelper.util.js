import _ from 'lodash';

let showLoginPanel = (window, title, contactPoint) => {
    document.getElementById('myModal').style.display = 'block';
    document.getElementById('loginWayFinder').style.display = 'none';
    document.getElementById('loginButtons').style.display = 'block';
    document.getElementById('loginModalTitle').innerHTML = 'You must be signed in to request access';
    document.getElementById('modalRequestDetails').innerHTML = title;
    document.getElementById('modalRequestSection').style.display = 'block';

    window.onclick = function (event) {
        if (event.target === document.getElementById('myModal')) {
            document.getElementById('myModal').style.display = 'none';
        }
    };
};

const isNotActive = dataset => {
    return dataset.activeflag !== 'active' && dataset.activeflag !== 'draft';
};

const isDraft = dataset => {
    return dataset.activeflag === 'draft';
};

const isInReview = dataset => {
    return dataset.activeflag === 'inReview';
};

const isRejected = dataset => {
    return dataset.activeflag === 'rejected';
};

const isArchived = dataset => {
    return dataset.activeflag === 'archive';
};

const getPublisherID = (userState, team) => {
    let { teams } = userState;
    let foundAdmin = teams.filter(x => x.type === team);

    if (!_.isEmpty(foundAdmin)) {
        return 'admin';
    }

    let foundTeam = teams.filter(x => x._id === team);
    if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
        return ['applicant'];
    }

    return foundTeam[0]._id;
};

export default {
    showLoginPanel: showLoginPanel,
    isNotActive,
    isInReview,
    isRejected,
    isArchived,
    getPublisherID,
    isDraft,
};
