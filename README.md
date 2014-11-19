SportIM-web
===========

Frontend for the SportIM sports management app.

Node and npm are required for development, global npm installs are shown below but you may install locally as well.

To install bower and bower dependencies, run:
```
npm install -g bower
bower install
```

Run with any static file server, for example to use http-server:
```
npm install -g http-server
http-server app -c-1 --cors
```

Unit tests are run with jasmine and karma: 
```
npm install -g karma jasmine karma-jasmine phantomjs karma-phantomjs-launcher
karma start
```
These tests are configured to run within PhantomJS, however you may also use chrome or any other browser with a karma launcher for that browser.
