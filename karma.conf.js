module.exports = function(config){
  config.set({

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-cookies/angular-cookies.min.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/jquery/dist/jquery.min.js',
      'app/bower_components/jquery-ui/ui/minified/jquery-ui.min.js',
      'app/bower_components/fullcalendar/fullcalendar.js',
      'app/bower_components/angular-ui-calendar/src/calendar.js',
      'app/js/**/*.js',
      'test/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
