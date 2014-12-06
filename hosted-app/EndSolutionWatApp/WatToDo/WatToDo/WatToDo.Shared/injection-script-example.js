(function () {
    // This script will be executed in the context of the webview
    function addReminderToTasks() {
        console.log("addReminderToTasks");
        if (document.getElementById("todo-view")) {
            //We are in the To Do Main page
            var toDoItems = document.querySelectorAll("#todo-view #main div.todo-item");
            for (var i = 0; i < toDoItems.length; i++) {
                var textElement = toDoItems[i].getElementsByTagName("span")[0];
                if (textElement) {
                    var toDoScope = angular.element(textElement).scope();
                    if (toDoScope && toDoScope.todo && toDoScope.todo) {
                        var toDoTitle = toDoScope.todo.Title;

                        if (toDoItems[i].getElementsByClassName('reminder').length === 0) {
                            var reminder = document.createElement("button");
                            reminder.setAttribute("class", "reminder");
                            reminder.appendChild(document.createTextNode("Add Reminder"));
                            reminder.addEventListener("click", function () {
                                window.external.notify('ADD-REMINDER~~' + toDoTitle);
                            });
                            toDoItems[i].appendChild(reminder);
                        }
                    }
                }
            };
        }
    }

    var toDoCtrlCtrlScope = angular.element('#todoapp').scope();

    toDoCtrlCtrlScope.$watchCollection('todos', function () {
        addReminderToTasks();
    });

    addReminderToTasks();
})();