var serviceUrl = 'http://localhost:3000';

var service = angular.module('service', ['ngResource']);

service.factory('User', ['$resource',
    function($resource){
        return $resource(serviceUrl+'/users.json', {}, {
            users: {method:'GET',isArray: true}
        });
    }]
);
