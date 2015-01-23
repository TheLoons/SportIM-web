var logout = angular.module('logout',['ngCookies']);

logout.controller('logout', function($scope, $cookies) {
    $cookies.session = '';
    window.location.href = '../views/home.html';
});
