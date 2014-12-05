var webView = document.getElementById("webview");
// when navigation is complete, display the welcome message
webView.addEventListener("MSWebViewNavigationCompleted", function (e) {
    console.log("navigation complete");

    var welcomeMsg = document.querySelector(".welcome-message");

    if (welcomeMsg && !localStorage["welcome-message"]) {
        welcomeMsg.style.display = "block";

        var overlayClose = document.querySelector('#close');
        if (overlayClose) {
            overlayClose.addEventListener("click", function () {
                welcomeMsg.style.display = "none";
                localStorage["welcome-message"] = true;
            });
        }
    }
});

