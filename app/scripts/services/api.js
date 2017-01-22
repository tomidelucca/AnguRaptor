define(['AnguRaptor'], function(AnguRaptor) {

    var root = 'http://localhost:10101';

    'use strict';
    AnguRaptor.service('api', ['$http', '$q', '$cookies', '$rootScope', '$window', function($http, $q, $cookies, $rootScope, $window) {

        var token = $cookies.get('token');

        function endpoint(options) {
            options.url = root + options.url;
            options.after = options.after || function(data) {
                return data
            };
            options.afterError = options.afterError || function(data) {
                return data
            };
            options.auth = options.auth || false;
            options.method = options.method || 'GET';

            return function() {
                var headers = {
                    'Content-Type': 'application/json'
                };

                if (options.auth) {
                    // TODO - add headers for authentication
                }

                return $http({
                    url: options.url,
                    method: options.method,
                    params: options.params,
                    data: options.body,
                    'headers': headers
                }).then(function(response) {
                    return options.after(response.data);
                }).catch(function(response) {
                    var error = {
                        'code': response.status,
                        'message': response.statusText
                    };
                    return $q.reject(options.afterError({
                        'error': error,
                        'data': response.data
                    }));
                });
            }
        };

        function buildSession(response) {
            var now = new $window.Date();
            exp = new $window.Date(now.getFullYear(), now.getMonth(), now.getDate() + 30);
            $cookies.put('token', response.token, {
                expires: exp
            });
            token = response.token;
            $rootScope.$broadcast('session.change');
            return response;
        }

        function destroySession(response) {
            $cookies.remove('token');
            token = undefined;
            $rootScope.$broadcast('session.change');
        }

        this.user = {
            get: function() {
                return endpoint({
                    url: '/user',
                    auth: true
                })();
            },
            login: function(username, password) {
                return endpoint({
                    url: '/auth/login',
                    method: 'POST',
                    body: {
                        'username': username,
                        'password': password
                    },
                    after: buildSession
                })();
            },
            logout: function() {
                return endpoint({
                    url: '/auth/logout',
                    method: 'POST',
                    auth: true,
                    after: destroySession,
                    afterError: destroySession
                })();
            },
            create: function(firstName, lastName, useranme, email, password) {
                return endpoint({
                    url: '/signup',
                    method: 'POST',
                    body: {
                        'first_name': firstName,
                        'last_name': lastName,
                        'username': username,
                        'email': email,
                        'password': password
                    }
                })();
            },
            isLoggedIn: function() {
                return !(token == null);
            }
        }

        this.user.feed = {
            get: function(page, limit) {
                return endpoint({
                    url: '/user/feed',
                    params: {
                        'page': page,
                        'limit': limit
                    },
                    auth: true
                })();
            }
        }

        this.user.notifications = {
            get: function(page, limit) {
                return endpoint({
                    url: '/user/notifications',
                    params: {
                        'page': page,
                        'limit': limit
                    },
                    auth: true
                })();
            },
            unreadCount: function() {
                return endpoint({
                    url: '/user/notifications/count',
                    auth: true
                })();
            },
            markRead: function(notification_ids) {
                return endpoint({
                    url: '/user/notifications/read',
                    method: 'POST',
                    body: notification_ids,
                    auth: true
                })();
            }
        }

        this.users = {
            get: function(username) {
                return endpoint({
                    url: '/users/' + username
                })();
            },
            follow: function(username) {
                return endpoint({
                    url: '/users/' + username + '/follow',
                    method: 'POST',
                    auth: true
                })();
            },
            unfollow: function(useranme) {
                return endpoint({
                    url: '/users/' + useranme + '/unfollow',
                    method: 'POST',
                    auth: true
                })();
            }
        }

        this.users.timeline = {
            get: function(username, page, limit) {
                return endpoint({
                    url: '/users/' + username + '/timeline',
                    params: {
                        'page': page,
                        'limit': limit
                    }
                })();
            }
        }

        this.users.mentions = {
            get: function(username, page, limit) {
                return endpoint({
                    url: '/users/' + username + '/mentions',
                    params: {
                        'page': page,
                        'limit': limit
                    }
                })();
            }
        }

        this.users.likes = {
            get: function(username, page, limit) {
                return endpoint({
                    url: '/users/' + username + '/likes',
                    params: {
                        'page': page,
                        'limit': limit
                    }
                })();
            }
        }

        this.feed = {
            get: function(page, limit) {
                return endpoint({
                    url: '/feed',
                    params: {
                        'page': page,
                        'limit': limit
                    }
                })();
            }
        }

        this.trends = {
            get: function() {
                return endpoint({
                    url: '/trending'
                });
            }
        }

        this.search = {
            find: function(term, page, limit) {
                return endpoint({
                    url: '/search',
                    params: {
                        'term': term,
                        'page': page,
                        'limit': limit
                    }
                })();
            }
        }

        this.rawr = {
            get: function(rawr_id) {
                return endpoint({
                    url: '/rawrs/' + rawr_id
                })();
            },
            create: function(status) {
                return endpoint({
                    url: '/rawrs',
                    method: 'POST',
                    body: {
                        'status': status
                    },
                    auth: true
                })();
            },
            like: function(rawr_id) {
                return endpoint({
                    url: '/rawrs/' + rawr_id + '/like',
                    method: 'POST',
                    auth: true
                })();
            },
            unlike: function(rawr_id) {
                return endpoint({
                    url: '/rawrs/' + rawr_id + '/unlike',
                    method: 'POST',
                    auth: true
                })();
            },
            rerawr: function(rawr_id) {
                return endpoint({
                    url: '/rawrs/' + rawr_id + '/rerawr',
                    method: 'POST',
                    auth: true
                })();
            },
            unrerawr: function(rawr_id) {
                return endpoint({
                    url: '/rawrs/' + rawr_id + '/unrerawr',
                    method: 'POST',
                    auth: true
                })();
            }
        }

    }]);

});