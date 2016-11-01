angular.module ('apf.appModule', [
  'ngResource',
  'ngRoute',
  'ui.bootstrap',
  'pascalprecht.translate',
  'patternfly',
  'patternfly.toolbars',
  'patternfly.charts',
  'apf.util',
  'apf.charts',
  'apf.card',
  'apf.dashboardModule',
  'apf.cloudsModule',
  'apf.containersModule',
  'apf.infrastructureModule',
  'apf.applicationsModule',
  'apf.reportsModule',
  'apf.adminModule',
  'ui.dashboard',
  'ui.sortable',
  'gridstack-angular',
  'kendo.directives',
]).config(['$routeProvider', '$translateProvider',
  function ($routeProvider, $translateProvider) {
    'use strict';

    $routeProvider
      .when('/', {
        redirectTo: '/dashboard'
      })
      .when('/dashboard', {
        templateUrl: 'src/dashboard/dashboard.html'
      })

      // Default
      .otherwise({
      });

    $translateProvider.translations('default', 'en');
    $translateProvider.preferredLanguage('default');
  }
]);
