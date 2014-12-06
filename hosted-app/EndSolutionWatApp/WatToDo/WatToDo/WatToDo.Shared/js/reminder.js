(function (WAT) {
    "use strict";

    var logger;

    // Public API
    var self = {
        start: function () {
            if (WAT.getModule("log")) {
                logger = WAT.getModule("log");
            }

            WAT.options.webView.addEventListener("MSWebViewScriptNotify", function (e) {
                var toDoTitle = getTitleParameter(e, "ADD-REMINDER");
                if (!toDoTitle) {
                    // oops, this isn't ours
                    return;
                }

                logger.log("Adding reminder for: ", toDoTitle);

                scheduleToast(toDoTitle)
            });
        },
    };

    // Private functions
    function scheduleToast(taskDescription) {
        logger.log("scheduleToast");
        // Scheduled toasts use the same toast templates as all other kinds of toasts.
        var template = Windows.UI.Notifications.ToastTemplateType.toastText02;
        var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode("To Do: " + taskDescription));

        var currentTime = new Date();
        var startTime = new Date(currentTime.getTime() + 1000);
        var scheduledToast = new Windows.UI.Notifications.ScheduledToastNotification(toastXml, startTime);

        Windows.UI.Notifications.ToastNotificationManager.createToastNotifier().addToSchedule(scheduledToast);
        logger.log("Scheduled a toast for task: " + taskDescription);
    };

    function getTitleParameter(e, parameter) {
        if (e.type === "MSWebViewScriptNotify") {
            var content = e.value.split(/~~/);
            if (content.length === 2 && content[0] === parameter) {
                return content[1];
            }
        }
        
        return null;
    };

    // Module Registration
    WAT.registerModule("reminder", self);

})(window.WAT);