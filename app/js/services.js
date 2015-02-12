var serviceUrl = 'https://sportim.herokuapp.com/rest/';
var soccerUrl = 'https://sportim.herokuapp.com/soccer/';

var serviceDateFormat = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

var services = angular.module('services', ['ngResource', 'ngCookies']);

services.run(function($cookies, $http){
    // add the session token to all requests
    $http.defaults.headers.common['token'] = $cookies.session;
    //$http.defaults.headers.common['session'] = $cookies.soccersession;
});

services.factory('sessionRecoverer', ['$q', '$injector', function($q, $injector) {  
    var sessionRecoverer = {
        response: function(response) {
            // Session has expired
            if (response.data.status && response.data.status.code != 200){
                if(response.data.status.code == 401)
                    window.location.href = '../views/login.html#/?error=NotAuthorized';
                else {
                    $("#errorHeader").show().find("#errorMessage").text("Saved Team Changes");
                }
            }
            return response;
        }
    };
    return sessionRecoverer;
}]);

services.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('sessionRecoverer');
}]);

// Main API
services.factory('User', ['$resource',
    function($resource){
        return $resource(serviceUrl+'user/:email', {email: '@email'}, {
            "update":{method:"PUT"}
        });
    }]
);

services.factory('UserView', ['$resource',
    function($resource){
        return $resource(serviceUrl+'user/view', {});
    }]
);

services.factory('UserAlert', ['$resource',
    function($resource){
        return $resource(serviceUrl+'user/alert', {}, {
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

services.factory('TeamView', ['$resource',
    function($resource){
        return $resource(serviceUrl+'team/view', {});
    }]
);

services.factory('TeamEdit', ['$resource',
    function($resource){
        return $resource(serviceUrl+'team/edit', {});
    }]
);

services.factory('League', ['$resource',
    function($resource){
        return $resource(serviceUrl+'league/:id', {id:'@id'}, {
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

services.factory('Register', ['$resource',
    function($resource){
            return $resource(serviceUrl + 'user', {});
    }]
);

// Soccer API
services.factory('Session', ['$resource',
    function($resource){
        return $resource(soccerUrl+'session/:id', {id:'@id'}, {});
    }]
);

services.factory('SessionReset', ['$resource',
    function($resource){
        return $resource(soccerUrl+'session/reset/:id', {id:'@id'}, {});
    }]
);

services.factory('Foul', ['$resource',
    function($resource){
        return $resource(soccerUrl+'foul/:id', {id:'@id'}, {});
    }]
);
