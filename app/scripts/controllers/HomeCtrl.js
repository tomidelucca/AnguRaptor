'use strict';
define(['AnguRaptor', 'services/api', 'directives/trending-box', 'directives/rawr-list'], function(AnguRaptor) {

    AnguRaptor.controller('HomeCtrl', ['$scope', 'api', '$translate', function($scope, api, $translate) {

        var home = {};

        var rawrList = {};

        rawrList.items = [];

        var feed = {
            title: 'Feed',
            nextPage: api.user.feed.get,
            interval: 10000
        };

        var globalFeed = {
            title: 'Global',
            nextPage: api.feed.get,
            interval: 15000
        };

        $translate(['FEED_TITLE', 'GLOBAL_TITLE']).then(function(translations) {
            feed.title = translations.FEED_TITLE;
            globalFeed.title = translations.GLOBAL_TITLE;
        });

        if (api.user.isLoggedIn()) {
            rawrList.items.push(feed);
        }

        rawrList.items.push(globalFeed);

        home.rawrList = rawrList;

        $scope.home = home;

    }]);

});
