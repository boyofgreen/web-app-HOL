(function () {
    "use strict";

    var controlClass = WinJS.Class.define(
            // Define the constructor of the control
            function Control_ctor(element, options) {
                this.element = element || document.createElement("div");
                this.element.winControl = this;

                // Set defaults for options
                this.isChecked = false;
                this.labelOn = "On";
                this.labelOff = "Off";

                // Set the user-defined options
                WinJS.UI.setOptions(this, options);

                // Set the visual content of the control
                this.checkbox = document.createElement("input");
                this.checkbox.setAttribute("type", "checkbox");
                this.checkbox.checked = this.isChecked;
                this.checkbox.textContent = (this.isChecked ? this.labelOn : this.labelOff);
                this.element.appendChild(this.checkbox);
            },
            {
                // Define get and set functions for the 'checked' property
                checked: {
                    get: function () {
                        return this.isChecked;
                    },
                    set: function (value) {
                        this.isChecked = value;
                        this.checkbox.checked = this.isChecked;
                        this.dispatchEvent("onchange", {
                            checked: this.isChecked
                        });
                    }
                }
            }
            );
    // Define a namespace for the control
    WinJS.Namespace.define("MyApp.UI", {
        Checkbox: controlClass
    });
})();

// Set up event handlers for the control
WinJS.Class.mix(MyApp.UI.Checkbox,
      WinJS.Utilities.createEventProperties("onchange"),
      WinJS.UI.DOMEventMixin);