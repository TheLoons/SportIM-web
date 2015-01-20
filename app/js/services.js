var serviceUrl = 'https://sportim.herokuapp.com/rest/';

var serviceDateFormat = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

var services = angular.module('services', ['ngResource']);

services.factory('User', ['$resource',
    function($resource){
        return $resource(serviceUrl+'user/:email', {email: '@email'}, {
            "update":{method:"PUT"}
        });
    }]
);

services.factory('Team', ['$resource',
    function($resource){
        return $resource(serviceUrl+'team/:id', {id:'@id'}, {
            "update":{method:"PUT"}
        });
    }]
);

services.factory('Tournament', ['$resource',
    function($resource){
        return $resource(serviceUrl+'tournament/:id', {id:'@id'}, {
            "update":{method:"PUT"}
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

services.factory('Login', ['$resource',
    function($resource){
        return $resource(serviceUrl + 'login', {});
    }]
);
