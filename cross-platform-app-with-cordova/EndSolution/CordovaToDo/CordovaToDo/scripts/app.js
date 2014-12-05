'use strict'

angular.module('cordova-todo', [])
     .factory('todoStorage', function () {
         var STORAGE_ID = 'cordova-ToDo';

         return {
             get: function () {
                 return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
             },

             put: function (todos) {
                 localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
             }
         };
     })
     .controller('ToDoCtrl', function ToDoCtrl($scope, todoStorage) {
         var todos = $scope.todos = todoStorage.get();

         $scope.newTodoItem = '';

         $scope.addToDoItem = function () {
             var newTodo = $scope.newTodoItem.trim();
             if (newTodo.length === 0) {
                 return;
             }

             todos.push({
                 title: newTodo,
                 completed: false
             });

             todoStorage.put(todos);

             $scope.newTodoItem = '';
         };

         $scope.removeTodoItem = function (todo) {
             todos.splice(todos.indexOf(todo), 1);
             todoStorage.put(todos);
         };

         $scope.toggleCompleted = function (todo) {
             todoStorage.put(todos);
         };
     });
