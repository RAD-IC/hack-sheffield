let app = angular.module('sheffield', ['ui.bootstrap', 'ngRoute', 'ngStorage']);

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
    });

    $routeProvider
        .when('/',
            {
                templateUrl: '/components/index/index.html',
                controller: 'indexRedirect',
            })
        .when('/app/:hash',
            {
                templateUrl: '/components/app/app.html',
                controller: 'appCtrl',
            })
        .otherwise(
            {
                templateUrl: '/components/error/error.html',
            });

    /* TODO: Handle default redirection */
    // .otherwise( {redirectTo: '/'} );
});

app.factory('Data', function($localStorage, $filter) {
    return {
        jsonThingy: {}
    }
});

/* Default socket connection/initialisation */
app.controller('ioCtrl', function($scope, socket) {
    socket.on('connect', (data) => {
        // socket.join('default');
        // socket.broadcast('default', 'messages', 'broadcast');
    });
    socket.on('messages', function(data) {
        // console.log('Incoming message:', data);
    });
});
