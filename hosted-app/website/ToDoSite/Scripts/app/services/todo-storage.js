'use strict'

angular.module('site-todo').factory('ToDoStorage', function (ToDo) {
    var serviceInstance = {};

    serviceInstance.list = function () {
        return ToDo.query();
    }

    serviceInstance.add = function (title) {
        var newToDo = new ToDo();
        newToDo.Title = title;
        newToDo.completed = false;

        newToDo.$save();
        return newToDo;
    }

    serviceInstance.update = function (todo) {
        todo.$update();
    }

    serviceInstance.remove = function (todo) {
        todo.$delete();
    }

    return serviceInstance;
});