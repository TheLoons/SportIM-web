describe("Home: ", function() {
    beforeEach(module('home'));

    describe("Colors", function() {
        beforeEach(inject(function($controller) {
            this.scope = {},
            ctrl = $controller('colors', {$scope:this.scope});
        }));

        it("Should be 3 colors", function() {
            expect(this.scope.colors).toBeDefined();
            expect(this.scope.colors.length).toBe(3);
        });
    });

    describe("Users", function() {
        beforeEach(inject(function($controller, $httpBackend) {
            this.httpBackend = $httpBackend,
            this.scope = {},
            ctrl = $controller('users', {$scope:this.scope});
        }));

        afterEach(function() {
            this.httpBackend.verifyNoOutstandingExpectation();
            this.httpBackend.verifyNoOutstandingRequest();
        });

        it("Users should have names", inject(function(User) {
            expect(this.scope).toBeDefined();
            this.httpBackend.expect('GET', serviceUrl+'/users.json').respond(
                [{"id":1,"name":"John Terry","age":34,"password":"test123",
                "url":"http://localhost:3000/users/1.json"},
                {"id":2,"name":"Jessica Oswald","age":26,"password":"fuwhfouw",
                "url":"http://localhost:3000/users/2.json"}]
            );
            this.httpBackend.flush();
            expect(this.scope.users).toBeDefined();
            expect(this.scope.users.length).toBe(2);
            expect(this.scope.users[0].name).toBe("John Terry");
            expect(this.scope.users[1].age).toBe(26);
        }));

    });
});
