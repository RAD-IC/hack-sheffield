/* Redirects upon entry to the correct screen */
app.controller('indexRedirect', function($http, $location, $scope) {

    $scope.foo = 'noice';

    /* Def routing */
    $location.url('/app/home');
});