var serviceUrl = 'http://localhost:3000';

var services = angular.module('services', ['ngResource']);

services.factory('User', ['$resource',
    function($resource){
        return $resource(serviceUrl+'/users.json', {}, {
            users: {method:'GET',isArray: true}
        });
    }]
);

services.factory('Dir', ['$resource',
    function($resource){
        return $resource('http://cs4400-02.eng.utah.edu:9999/sportim/rest/'+'directory', {}, {
            files: {method:'GET',isArray: false}
        });
    }]
);
