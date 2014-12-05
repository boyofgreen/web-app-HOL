(function () {
    "use strict";

    var demoData = [{ id: 1, text: "Buy milk", complete: false }, { id: 2, text: "Call Bob", complete: true }];
    var itemList = new WinJS.Binding.List();

    function loadDataFromLocalStorage() {
        var data = localStorage["toDoApp"];

        if (data) {
            return JSON.parse(data);
        } else {
            localStorage["toDoApp"] = JSON.stringify(demoData);
            return demoData;
        }
    };

    function saveDataToLocalStorage() {
        localStorage["toDoApp"] = JSON.stringify(itemList.map(function (a) { return a.backingData; }));
    };

    function generateNewId() {
        var data = localStorage["toDoApppLastId"];
        var todoAppLastId = (data) ? JSON.parse(data) : demoData.length;
        todoAppLastId++;
        localStorage["toDoAppLastId"] = JSON.stringify(todoAppLastId);

        return todoAppLastId;
    }

    function createToDoItem(args) {
        var todoItem = WinJS.Binding.as({
            id: args.id || generateNewId(),
            text: args.text || '',
            complete: !!args.complete
        });

        function toggleItem() {
            todoItem.complete = !todoItem.complete;
            saveDataToLocalStorage();
        };

        function removeItem() {
            var index = itemList.indexOf(todoItem);
            itemList.splice(index, 1);
            saveDataToLocalStorage();
        };

        WinJS.UI.eventHandler(removeItem);
        WinJS.UI.eventHandler(toggleItem);

        todoItem.remove = removeItem;
        todoItem.toggle = toggleItem;

        return todoItem;
    }

    function addNewToDo() {
        var newToDoName = document.getElementById("newToDoText");

        if (newToDoName && newToDoName.value) {
            itemList.push(createToDoItem({ text: newToDoName.value }));
            saveDataToLocalStorage();
            newToDoName.value = '';
            newToDoName.setActive();
        }

        return false;
    };

    var dataArray = loadDataFromLocalStorage();

    for (var i = 0; i < dataArray.length; i++) {
        itemList.push(createToDoItem(dataArray[i]));
    }

    // Create a namespace to make the data publicly
    // accessible. 
    var publicMembers = {
        itemList: itemList,
        addNewToDo: addNewToDo
    };

    WinJS.Namespace.define("Data", publicMembers);

})();
