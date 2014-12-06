'use strict'

angular.module("toDoService", ["ngResource"]).
               factory("ToDo", ['$resource', function ($resource) {
                   return $resource(
                       "/api/ToDoItems/:Id",
                       { Id: "@Id" },
                       { "update": { method: "PUT" } }
                  );
               }]);