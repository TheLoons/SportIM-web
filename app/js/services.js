var serviceUrl = 'http://cs4400-02.eng.utah.edu:9999/sportim/rest/';

var serviceDateFormat = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

var services = angular.module('services', ['ngResource']);

services.factory('User', ['$resource',
    function($resource){
        return $resource(serviceUrl+'/users.json', {}, {
            users: {method: 'GET', isArray: true}
        });
    }]
);

services.factory('Dir', ['$resource',
    function($resource){
        return $resource(serviceUrl+'directory', {}, {
            files: {method: 'GET', isArray: false}
        });
    }]
);

services.factory('Event', ['$resource',
    function($resource){
        return $resource(serviceUrl+'event/:id', {id:'@id'}, {
            "update":{method:"PUT"}
        });
    }]
);

services.factory('Events', ['$resource',
    function($resource){
        return $resource(serviceUrl+'events', {});
    }]
);
