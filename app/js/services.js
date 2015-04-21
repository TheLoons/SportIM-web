var serviceUrl = 'https://sportim.herokuapp.com/rest/';
var soccerUrl = 'https://sportim.herokuapp.com/soccer/';
var ultimateUrl = 'https://sportim.herokuapp.com/ultimate/';

var serviceDateFormat = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

var services = angular.module('services', ['ngResource', 'ngCookies']);
var ignoreUrl = [];

services.factory('sessionRecoverer', ['$q', '$injector', '$cookies', function($q, $injector, $cookies) {
    var sessionRecoverer = {
        request: function(request) {
            if(request.params && request.params.showError === false)
                ignoreUrl.push(request.url);

            request.headers['token'] = $cookies.session;
            request.headers['session'] = $cookies.soccersession;
            return request;
        },
        response: function(response) {
            // Session has expired
            if (response.data.status && response.data.status.code != 200){
                if(response.data.status.code == 401)
                    window.location.href = '../views/login.html#/?error=NotAuthorized';
                else if(ignoreUrl.indexOf(response.config.url) < 0) {
                    $("#errorHeader").show().find("#errorMessage").text(response.data.status.message);
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

services.factory('Color', ['$resource',
    function($resource){
        return $resource(serviceUrl+'team/:id/colors', {id:'@id'}, {
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
services.factory('TeamAddPlayer', ['$resource',
    function($resource){
        return $resource(serviceUrl+'team/:id/add?login=:login', {id:'@id', login:'@login'}, {
            "update":{method:"PUT"}
        });
    }]
);
services.factory('TeamRemovePlayer', ['$resource',
    function($resource){
        return $resource(serviceUrl+'team?teamId=:id&login=:login', {id:'@id', login:'@login'}, {
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
services.factory('LeagueTables', ['$resource',
    function($resource){
        return $resource(serviceUrl+'league/:id/table', {id: '@id'}, {
            "update":{method:"PUT"}
        });
    }]
);
services.factory('LeagueTableResult', ['$resource',
    function($resource){
        return $resource(serviceUrl+'league/:id/table/:tableID', {id:'@id', tableID: '@tableID'}, {});
    }]
);
services.factory('League', ['$resource',
    function($resource){
        return $resource(serviceUrl+'league/:id', {id:'@id'}, {
            "update":{method:"PUT"}
        });
    }]
);
services.factory('LeagueTeamAdd', ['$resource',
    function($resource){
        return $resource(serviceUrl+'league/:id/add?teamId=:teamId', {id:'@id', teamId:'@teamId'}, {
            "update":{method:"PUT"}
        });
    }]
);
services.factory('LeagueTeamRemove', ['$resource',
    function($resource){
        return $resource(serviceUrl+'league?leagueId=:id&teamId=:teamId', {id:'@id', teamId:'@teamId'}, {
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

services.factory('PlayerPassing', ['$resource',
    function($resource){
        return $resource(serviceUrl+'pass?player=:login', {login: '@login'}, {});
    }]
);

services.factory('TeamPassing', ['$resource',
    function($resource){
        return $resource(serviceUrl+'pass?teamID=:id', {login: '@id'}, {});
    }]
);

services.factory('EventPassing', ['$resource',
    function($resource){
        return $resource(serviceUrl+'pass?eventID=:id', {login: '@id'}, {});
    }]
);

services.factory('EventStats', ['$resource',
    function($resource){
        return $resource(serviceUrl+'stats/event/:id', {id:'@id'}, {});
    }]
);

services.factory('TeamStats', ['$resource',
    function($resource){
        return $resource(serviceUrl+'stats/team/:id', {id:'@id'}, {});
    }]
);

services.factory('PlayerStats', ['$resource',
    function($resource){
        return $resource(serviceUrl+'stats/player?login=:login', {login:'@login'}, {});
    }]
);

// Sports API
services.factory('Sports', ['$resource',
    function($resource){
            return $resource(serviceUrl + 'sports', {});
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

services.factory('Shot', ['$resource',
    function($resource){
        return $resource(soccerUrl+'shot/:id', {id:'@id'}, {});
    }]
);

services.factory('Goal', ['$resource',
    function($resource){
        return $resource(soccerUrl+'goal/:id', {id:'@id'}, {});
    }]
);

services.factory('Pass', ['$resource',
    function($resource){
        return $resource(soccerUrl+'pass/:id', {id:'@id'}, {});
    }]
);

services.factory('TimeStart', ['$resource',
    function($resource){
        return $resource(soccerUrl+'time/start/:id', {id: '@id'}, {});
    }]
);

services.factory('HalfEnd', ['$resource',
    function($resource){
        return $resource(soccerUrl+'time/halfend/:id', {id: '@id'}, {});
    }]
);

services.factory('HalfStart', ['$resource',
    function($resource){
        return $resource(soccerUrl+'time/halfstart/:id', {id: '@id'}, {});
    }]
);

services.factory('TimeEnd', ['$resource',
    function($resource){
        return $resource(soccerUrl+'time/end/:id', {id: '@id'}, {});
    }]
);

services.factory('PlayerSub', ['$resource',
    function($resource){
        return $resource(soccerUrl+'time/sub/:id', {id: '@id'}, {});
    }]
);

// Ultimate Frisbee API
services.factory('Finalize', ['$resource',
    function($resource){
        return $resource(ultimateUrl+'finalize/:id', {id: '@id'}, {});
    }]
);

services.factory('UltimateFoul', ['$resource',
    function($resource){
        return $resource(ultimateUrl+'foul/:id', {id:'@id'}, {});
    }]
);

services.factory('UltimatePoint', ['$resource',
    function($resource){
        return $resource(ultimateUrl+'point/:id', {id:'@id'}, {});
    }]
);
