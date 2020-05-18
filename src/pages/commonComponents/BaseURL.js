
var thisBaseURL = window.location.href;

module.exports = {
    getURL: function() {
        if (thisBaseURL.includes('appspot.com')) {
            return window.location.origin;

        } else if (!thisBaseURL.includes('localhost')) {
        var rx = /^([http|https]+:\/\/[a-z]+)([^/]*)/;
        var arr = rx.exec(thisBaseURL);
        if (arr.length > 0) {
            //add -api to the sub domain for API requests
            return 'https://api'+arr[2]
        }
        } else {
        return 'http://localhost:3001'
        }
    },

    getCMSURL: function() {
        if (thisBaseURL.includes('appspot.com')) {
            return window.location.origin;

        } else if (!thisBaseURL.includes('localhost')) {
        var rx = /^([http|https]+:\/\/[a-z]+)\.([^/]*)/;
        var arr = rx.exec(thisBaseURL);
        if (arr.length > 0) {
            //add -api to the sub domain for API requests
            return 'https://' + arr[2]
        }
        } else {
        return 'http://localhost:3001'
        }
    }
} 