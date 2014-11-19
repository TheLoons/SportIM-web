'use strict'

describe("Services: ", function() {
    beforeEach(module('services'));

    describe("Users", function() {
        beforeEach(inject(function($httpBackend) {
            this.httpBackend = $httpBackend;
        }));

        afterEach(function() {
            this.httpBackend.verifyNoOutstandingExpectation();
            this.httpBackend.verifyNoOutstandingRequest();
        });

        it("Should pull user data correctly", inject(function(User) {
            this.httpBackend.expect('GET', serviceUrl+'/users.json').respond(
                [{"id":1,"name":"John Terry","age":34,"password":"test123",
                "url":"http://localhost:3000/users/1.json"},
                {"id":2,"name":"Jessica Oswald","age":26,"password":"fuwhfouw",
                "url":"http://localhost:3000/users/2.json"}]
            );
            var users = User.users();
            this.httpBackend.flush();

            expect(User).toBeDefined();
            expect(users).toBeDefined();
            expect(users.length).toBe(2);
            expect(users[0].name).toBe("John Terry");
            expect(users[1].age).toBe(26);
        }));
    });
});
