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

    describe("Events", function() {
        beforeEach(inject(function($httpBackend) {
            this.httpBackend = $httpBackend;
        }));

        afterEach(function() {
            this.httpBackend.verifyNoOutstandingExpectation();
            this.httpBackend.verifyNoOutstandingRequest();
        });

        it("Should get events from date range correctly", inject(function(Events) {
            this.httpBackend.expect('GET', serviceUrl+'events').respond(
                {"status":{"message":"","code":200},"events":[{"id":1,"title":"Iron Man vs Captain America","start":"2014-12-31T12:00:00.000Z","end":"2014-12-31T14:00:00.000Z"},{"title":"Super Action Movie","start":"2015-03-14T12:45:00.000Z","end":"2015-03-14T14:00:00.000Z"},{"title":"Cool Movie","start":"2014-12-20T12:00:00.000Z","end":"2014-12-21T14:00:00.000Z"}]} 
            );
            var response = Events.get();
            this.httpBackend.flush();

            var events = response.events;
            expect(Events).toBeDefined();
            expect(events).toBeDefined();
            expect(events.length).toBe(3);
            expect(events[0].id).toBe(1);
            expect(events[0].title).toBe("Iron Man vs Captain America");
            expect(events[1].start).toBe("2015-03-14T12:45:00.000Z");
            expect(events[2].end).toBe("2014-12-21T14:00:00.000Z");
        }));
    });

    describe("Event", function() {
        beforeEach(inject(function($httpBackend) {
            this.httpBackend = $httpBackend;
        }));

        afterEach(function() {
            this.httpBackend.verifyNoOutstandingExpectation();
            this.httpBackend.verifyNoOutstandingRequest();
        });

        it("Should get a single event with event, player and team info", inject(function(Event) {
            this.httpBackend.expect('GET', serviceUrl+'event/1').respond(
                {"teams":[{"teamName":"Captain America","teamId":1,"teamOwner":"fake@test.com"},{"teamName":"Iron Man","teamId":2,"teamOwner":"ironman@stark.com"}],"status":{"message":"","code":200},"events":[{"title":"Iron Man vs Captain America","start":"2014-12-31T12:00:00.000Z","end":"2014-12-31T14:00:00.000Z"}],"players":[{"lastName":"Jones","login":"fake@test.com","firstName":"Faux"},{"lastName":"Stark","login":"ironman@stark.com","firstName":"Tony"}]}
            );
            var oneEvent = Event.get({id: 1});
            this.httpBackend.flush();

            expect(Event).toBeDefined();
            expect(oneEvent).toBeDefined();
            expect(oneEvent.teams).toBeDefined();
            expect(oneEvent.events).toBeDefined();
            expect(oneEvent.players).toBeDefined();
            expect(oneEvent.teams[0].teamName).toBe("Captain America");
            expect(oneEvent.events[0].title).toBe("Iron Man vs Captain America");
            expect(oneEvent.players[1].lastName).toBe("Stark");
        }));
    });
});
