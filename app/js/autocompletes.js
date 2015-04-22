function teamAutocomplete(element, endpoint) {
    $(element).selectize({
        create: false,
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        maxItems: 1,
        maxOptions: 15,
        preload: true,
        render: {
            option: function(item, escape) {
                return '<div>' +
                    '<span class="name">' + escape(item.name) + '</span>' +
                    '<span class="owner">Owner: ' + escape(item.owner || 'No Owner.') + '</span>' +
                    '</div>';
            }
        },
        load: function(query, callback) {
            endpoint.get({showSpinner: false}).$promise.then(function(resp) {
                if(resp.status.code == 200)
                    callback(resp.teams);
            });
        }
    });
}

function playerAutocomplete(element, endpoint) {
    $(element).selectize({
        create: false,
        valueField: 'login',
        labelField: 'login',
        searchField: ['firstName','lastName','login'],
        maxItems: 1,
        maxOptions: 15,
        preload: true,
        render: {
            option: function(item, escape) {
                return '<div>' +
                    '<span class="name">' + escape(item.firstName + ' ' + item.lastName) + '</span>' +
                    '<span class="login">Email: ' + escape(item.login) + '</span>' +
                    '</div>';
            }
        },
        load: function(query, callback) {
            endpoint.get({showSpinner: false}).$promise.then(function(resp) {
                if(resp.status.code == 200)
                    callback(resp.users);
            });
        }
    });
}
