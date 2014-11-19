var serviceUrl = 'http://localhost:3000';

var services = angular.module('services', ['ngResource']);

services.factory('User', ['$resource',
    function($resource){
        return $resource(serviceUrl+'/users.json', {}, {
            users: {method:'GET',isArray: true}
        });
    }]
);
