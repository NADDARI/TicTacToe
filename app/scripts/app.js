'use strict';

/**
 * @ngdoc overview
 * @name ticTacToeApp
 * @description
 * # ticTacToeApp
 *
 * Main module of the application.
 */
angular
  .module('ticTacToeApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'

      })
      .otherwise({
        redirectTo: '/'
      });
  });
