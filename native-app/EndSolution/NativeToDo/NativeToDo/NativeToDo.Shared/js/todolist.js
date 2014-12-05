(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/html/list.html", {
        ready: function (element, options) {
            var addButton = element.querySelector('#addButton');
            addButton.addEventListener("click", Data.addNewToDo, false);
        }
    });
})();
