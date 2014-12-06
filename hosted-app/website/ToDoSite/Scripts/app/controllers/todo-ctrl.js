'use strict'

angular.module('site-todo').controller('ToDoCtrl', ['$scope', 'ToDoStorage', function($scope, ToDoStorage) {
    var todos = $scope.todos = ToDoStorage.list();
    $scope.newTodoItem = '';

    $scope.addToDoItem = function () {
        var newTodoTitle = $scope.newTodoItem.trim();
        if (newTodoTitle.length === 0) {
            return;
        }

        var newToDo = ToDoStorage.add(newTodoTitle);
        $scope.todos.push(newToDo);

        $scope.newTodoItem = "";
    };

    $scope.removeTodoItem = function (todo) {
        ToDoStorage.remove(todo);
        todos.splice(todos.indexOf(todo), 1);
    };

    $scope.toggleCompleted = function (todo) {
        ToDoStorage.update(todo);
    };
}]);