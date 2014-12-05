Building a native app with JavaScript, HTML and WinJS
========================================

In this lab you'll create a native universal application using JavaScript, HTML, CSS and WinJS. Additionally, you will learn how to write a custom WinJS control.

This lab includes instructions for:

1. [Building a native app with JavaScript and HTML](#BuildNativeApp)
2. [Building controls with WinJS](#BuildWinJSControl)

<a name="BuildNativeApp" />
##Building a native app with JavaScript and HTML

You will build a native app using JavaScript, HTML and WinJS controls. The app is a simple To Do List app that allows adding To Do items consisting of a description. It is also possible to delete them and toggle their completed status. 

The first step is to create a new project to contain the code and resources that will make up the app.

1. Start Visual Studio and create a **new JavaScript Blank app** (**Universal Apps**) project named _NativeToDo_.

	![Create New JavaScript Project](images/create-new-javascript-project.png?raw=true)

	_Create new Blank JavaScript project_

	The new project will include:
	* One Windows Store app project, named _NativeToDo.Windows_.
	* One Windows Phone Store app project, named _NativeToDo.WindowsPhone_. 
	* One _NativeToDo.Shared_ folder to store shared code. By default, all JavaScript files for the project are shared. HTML and CSS files can also be shared.

	You will start by adding all shared files.

1. Right-click the **NativeToDo.Shared** project and add a new folder named **html**. 

1. Right-click the **html** folder and add a new HTML file named **list.html**. Copy and paste the code in the code snippet below into your newly created file, replacing the default code.

	<!-- (Code Snippet - _Ex1NativeApp_Listhtml_)-->

	````HTML
	<!DOCTYPE html>
	<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		 <title></title>
		 <script src="/js/data.js"></script>
		 <script src="/js/todolist.js"></script>
		 <link href="/css/list.css" rel="stylesheet" />
	</head>
	<body>
		 <div data-win-control="ToDoList">
			  <div class="addTaskControl">
					<input id="newToDoText" type="text" />
					<button id="addButton">Add</button>
			  </div>
			  
			  <h1>My ToDo's</h1>
			  
			  <!-- Simple template for the ListView instantiation  -->
			  <div id="taskTemplate" data-win-control="WinJS.Binding.Template" style="display: none">
					<div class="taskItem">
						 <div class="itemDetails">
							  <h2 data-win-bind="innerText: text"></h2>
						 </div>
						 <div class="itemStatus" data-win-control="WinJS.UI.ToggleSwitch" data-win-bind="onchange: toggle; winControl.checked: complete" data-win-options="{labelOn: ' ', labelOff: ' '}">
						 </div>
						 <div class="itemActions">
							  <button class="actionButton remove" data-win-bind="onclick: remove;">
									<span class="menuIcon">&#xE106;</span>
							  </button>
						 </div>
					</div>
			  </div>

			  <div id="listView"
					 class="win-selectionstylefilled"
					 data-win-control="WinJS.UI.ListView"
					 data-win-options="{ itemDataSource: Data.itemList.dataSource,
						 itemTemplate: taskTemplate,
						 selectionMode: 'none',
						 tapBehavior: 'invoke',
						 layout: { type: WinJS.UI.ListLayout, orientation: WinJS.UI.Orientation.vertical }
					}"></div>
		 </div>
	</body>
	</html>
	````

1. Right-click the **js** folder and add a new JavaScript file named **data.js**. Copy and paste the code from [NativeToDo.Shared/js/data.js](EndSolution/NativeToDo/NativeToDo/NativeToDo.Shared/js/data.js)  (or from the code snippet below) into your newly created file.

	<!-- (Code Snippet - _Ex1NativeAppDataJs_)-->

	````JavaScript
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
	````

1. Right-click the **js** folder and add a new JavaScript file named **todolist.js**. Copy and paste the code from [NativeToDo.Shared/js/todolist.js](EndSolution/NativeToDo/NativeToDo/NativeToDo.Shared/js/todolist.js) (or from the code snippet below) into your newly created file.

	<!-- (Code Snippet - _Ex1NativeAppToDoListJs_) -->

	````JavaScript
	(function () {
		 "use strict";

		 var page = WinJS.UI.Pages.define("/html/list.html", {
			  ready: function (element, options) {
					var addButton = element.querySelector('#addButton');
					addButton.addEventListener("click", Data.addNewToDo, false);
			  }
		 });
	})();
	````

1. Right-click the **NativeToDo.Shared** project and add a new folder named **css**.

1. Right-click the **css** folder and add a new Css file named **list.css**. Copy and paste the code from [NativeToDo.Shared/css/list.css](EndSolution/NativeToDo/NativeToDo/NativeToDo.Shared/css/list.css) (or from the code snippet below) into your newly created file, replacing the default code.

	<!-- (Code Snippet - _Ex1NativeAppSharedCss_) -->

	````CSS
	/* Task List Shared Styles*/
	.taskItem {
		display:-ms-grid;
	}

	.taskItem > .itemDetails {
		-ms-grid-column: 1;
		-ms-grid-row-align:center;
		overflow:hidden;
	}

	.taskItem > .itemStatus {
		-ms-grid-column: 2;
		-ms-grid-row-align:center;
		-ms-grid-column-align:center;
	 }

	.taskItem > .itemActions {
		-ms-grid-column: 3;
		-ms-grid-row-align:center;
		-ms-grid-column-align:center;
	}

	.actionButton {
		border:none;
	}

	.actionButton:hover {
		background-color:transparent;
	}

	.actionButton:hover:active {
		background-color:transparent;
	}

	.menuIcon {
		font-family: 'Segoe UI Symbol';
	}

	.remove {
		color:red;
	}
	````

	The project should look like this:

	![NativeToDo.Shared Project contents](images/nativetodoshared-project-contents.png?raw=true)

	_NativeToDo.Shared project contents_

	Now you will update the projects for Windows and Windows Phone to reference the shared components, starting with the Windows application.

1. Open **default.html** in the **NativeToDo.Windows** project and replace the content of the body element with the following content:

	<!-- (Code Snippet - _Ex1NativeAppHtmlWindows_)-->
	<!-- mark:2-4 -->
	````HTML
	<body>
		 <div class="mainContent">
			  <div id="todolist" data-win-control="WinJS.UI.HtmlControl" data-win-options="{uri: '/html/list.html'}"></div>
		 </div>
	</body>

	````
1. Open **default.css** in the **NativeToDo.Windows** project and add the following CSS rules:

	<!-- (Code Snippet - _Ex1NativeAppWinCss_)-->

	````CSS
	body {
	}

	.mainContent {
		 height:100%;
		 margin: 50px 80px;
	}

	/* Task List Windows Styles*/
	h1 {
		 display:inline-block;
	}

	.taskItem {
		 -ms-grid-columns: 1fr 150px 50px;
		 -ms-grid-rows: 60px;
	}

	.actionButton {
		 width:50px;
		 height:50px;
	}

	.addTaskControl {
		 margin-right: 30px;
		 margin-top:19px;
		 float:right;
	}

	@media screen and (max-width:800px) {
		.addTaskControl {
			display:-ms-grid;
			-ms-grid-columns: 1fr 90px;
			margin-bottom:10px;
			float:none;
			width:100%;
		}

		.addTaskControl #newToDoText {
				-ms-grid-column:1;
				width:calc(100% - 8px);
		}

		.addTaskControl #addButton {
			-ms-grid-column:2;
			-ms-grid-column-align:center;
			-ms-grid-row-align:center;
			height:20px;
		}
	}
	````

1. Verify that the **NativeToDo.Windows** project is set as startup project (project name should show **in bold**) and that the debug mode is set to **Simulator** in the toolbar.

	![Set Debug to Simulator](images/set-debug-to-simulator.png?raw=true)

	_Set Debugging mode to Simulator_

1. Press **F5** to build and debug the application. 
	Verify that the app launches in the Simulator. If this does not happen the first time the Simulator is launched, try again.

	The Simulator will first display a splash screen like the one below and then the To Do list. You should be able to add new To Do items and mark them as completed.

	![Windows App Debugging no splash screen](images/windows-app-debugging-no-splashscreen.png?raw=true)

	_Native To Do splash screen_

	![Windows App Debugging](images/windows-app-debugging.png?raw=true)

	_NativeToDo main view_

	As you have noticed, the splash screen displays an empty image. You will fix this as well as other branding issues in the next step.

1. Open **package.appxmanifest** in the **NativeToDo.Windows** project. The Manifest Designer allows setting or modifying properties in the deployment package of the application. 

	![Package.appxmanifest for Windows Project](images/packageappxmanifest-for-windows-project.png?raw=true)

	_Manifest Designer_
	
	Update the properties in the different tabs to the values provided below:

	* Application tab

		* Display name: _To Do_

	* Visual Assets tab:

		* Background color: _black_
		* Store logo: browse to [images/storelogo.scale-100.png](EndSolution/NativeToDo/NativeToDo/NativeToDo.Windows/images/storelogo.scale-100.png)
		* Splash Screen: browse to [images/splashscreen.scale-100.png](EndSolution/NativeToDo/NativeToDo/NativeToDo.Windows/images/splashscreen.scale-100.png)
		* Square30x30 logo: browse to [images/smalllogo.scale-100.png](EndSolution/NativeToDo/NativeToDo/NativeToDo.Windows/images/smalllogo.scale-100.png)
		* Square150x150 logo: browse to [images/logo.scale-100.png](EndSolution/NativeToDo/NativeToDo/NativeToDo.Windows/images/logo.scale-100.png)

	* Packaging tab:
		* Package (display) name: _To Do_

	If you get prompts to replace files like this one when updating the images, click **Yes**.

	![Replace image when updating manifest](images/replace-image-when-updating-manifest.png?raw=true)

	_Replace image when updating the Visual Assets in the manifest_

1. Press **Ctrl+Shift+F5** or hit the **Restart** button in the toolbar. The application will restart, and the changes just made will be applied.

	![Restart Project](images/restart-project.png?raw=true)

	Notice the splash screen is now showing a uniform background with the right logo. As before, the application should behave as expected.

	![Debug Windows App with splash screen](images/debug-windows-app-with-splashscreen.png?raw=true)

	_Debugging the Windows app with splash screen_


1. Stop debugging.

	As you did for the Windows project, you will now customize and debug the Windows Phone application on an emulator.

1. Open **default.html** in the **NativeToDo.Windows.Phone** project and replace the body element with the following content:

	<!-- (Code Snippet - _Ex1NativeAppHtmlWinPhone_)-->
	<!-- mark:2-4 -->
	````HTML
	<body class="phone">
		 <div class="mainContent">
			  <div id="todolist" data-win-control="WinJS.UI.HtmlControl" data-win-options="{uri: '/html/list.html'}"></div>
		 </div>
	</body>
	````

1. Open **default.css** in the **NativeToDo.WindowsPhone** project and insert the following CSS rules:

	<!-- (Code Snippet - _Ex1NativeAppWinPhoneCss_)-->

	````CSS
	.mainContent {
		 margin: 20px;
	}

	/* Task List Shared Styles*/
	.taskItem {
		 -ms-grid-columns: 1fr 75px 40px;
	}

	.taskItem > .itemDetails > h2 {
		font-size: 16pt;
	}

	.taskItem > .itemStatus {
		padding-bottom:0;
	}

	.actionButton {
		width:30px;
		height:30px;
		min-width:30px;
		min-height:30px;
	}

	.addTaskControl {
		display:-ms-grid;
		-ms-grid-columns: 1fr 100px;
	}

	.addTaskControl #newToDoText {
		-ms-grid-column:1;
	}

	.addTaskControl #addButton {
        -ms-grid-column:2;
        -ms-grid-column-align:center;
        min-width:80px;
    }
	````

1. Open **package.appxmanifest** and update the same properties as before:

	* Application tab

		* Display name: _To Do Phone_

	* Visual Assets tab:

		* Splash Screen Background color: _black_
		* Store logo: browse to [images/WindowsPhone/storelogo.scale-240.png](EndSolution/NativeToDo/NativeToDo/NativeToDo.WindowsPhone/images/StoreLogo.scale-240.png)
		* Splash Screen: browse to [images/WindowsPhone/splashscreen.scale-240.png](EndSolution/NativeToDo/NativeToDo/NativeToDo.WindowsPhone/images/SplashScreen.scale-240.png)
		* Square71x71 logo: browse to [images/WindowsPhone/square71x71Logo.scale-240.png](EndSolution/NativeToDo/NativeToDo/NativeToDo.WindowsPhone/images/Square71x71Logo.scale-240.png)
		* Square150x150 logo: browse to [images\Square150x150Logo.scale-240.png](EndSolution/NativeToDo/NativeToDo/NativeToDo.WindowsPhone/images/Square150x150Logo.scale-240.png) 
		* Wide310x150 logo: browse to [images\Square310x150Logo.scale-240.png](EndSolution/NativeToDo/NativeToDo/NativeToDo.WindowsPhone/images/Square310x150Logo.scale-240.png) 
		* Square44x44 logo: browse to [images/WindowsPhone/square44x44Logo.scale-240.png](EndSolution/NativeToDo/NativeToDo/NativeToDo.WindowsPhone/images/Square44x44Logo.scale-240.png)

	* Packaging tab:
		* Package (display) name: _To Do Phone_

	If you get prompts to replace files like this one when updating the images in the Manifest Designer, click **Yes**.
	![Replace image](images/replace-image.png?raw=true)

	_Replace image when updating the Visual Assets in the manifest_

1. Set the NativeToDo.WindowsPhone project as startup project. 

	![Set WindowsPhone project as startup project](images/set-windowsphone-project-as-startup-project.png?raw=true)

	_Set NativeToDo.WindowsPhone as startup project_

1. Press **F5** to build and debug the application. 
	The selected Windows Phone Emulator will launch. If this is the first time you open the emulator, or if it is not open already, it might take a while until the OS loads and the app is deployed and launched.
	Once the app launches, it will first display a splash screen and then the To Do list. You should be able to add new To Do items and mark them as completed.

	![Windows Phone splash screen](images/windowsphone-splashscreen.png?raw=true)

	_Native To Do splash screen on Windows Phone Emulator_

	![Windows Phone To Do Application](images/windowsphone-todo-application.png?raw=true)

	_Native To Do application in Windows Phone_

1. Switch back to Visual Studio and stop debugging. 

<a name="BuildWinJSControl" />
##Building controls with WinJS

Now you will learn how to write a custom WinJS control that represents a checkbox and replace the WinJS ToggleSwitch control by it.

1. Right-click the **js** folder in **NativeToDo.Shared** project and add a new JavaScript file named **checkbox.js**. Copy and paste the code from [NativeToDo.Shared/js/checkbox.js](EndSolution/NativeToDo/NativeToDo/NativeToDo.Shared/js/checkbox.js) (or from the code snippet below) into your newly created file.

	<!-- (Code Snippet - _Ex2NativeAppCheckboxJS_)-->

	````JavaScript
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
	````

1. Open **list.html** in the **NativeToDo.Shared** project and make the changes shown below:

	a. Include **checkbox.js**, the file that contains the code for the newly added control, in the head of the html file.

	<!-- (Code Snippet - _Ex2NativeAppIncludeCustomControl_)-->

	<!-- mark:5 -->
	````HTML
	<head>
		 <title></title>
		 <script src="/js/data.js"></script>
		 <script src="/js/todolist.js"></script>
		 <script src="/js/checkbox.js"></script>
		 <link href="/css/list.css" rel="stylesheet" />
	</head>
	````

	b. Update the task template to use the new _Checkbox_ control. This requires updating the _div_ with _class=itemStatus_ to match the one below.

	<!-- (Code Snippet - _Ex2NativeAppUseCustomControl_)-->
	<!-- mark:7 -->
	````HTML
	        <!-- Simple template for the ListView instantiation  -->
        <div id="taskTemplate" data-win-control="WinJS.Binding.Template" style="display: none">
            <div class="taskItem">
                <div class="itemDetails">
                    <h2 data-win-bind="innerText: text"></h2>
                </div>
                <div class="itemStatus" data-win-control="MyApp.UI.Checkbox" data-win-bind="onchange: toggle; winControl.checked: complete" data-win-options="{labelOn: ' ', labelOff: ' '}">
                </div>
                <div class="itemActions">
                    <button class="actionButton remove" data-win-bind="onclick: remove;">
                        <span class="menuIcon">&#xE106;</span>
                    </button>
                </div>
            </div>
        </div>
	````

	What you are doing in the previous steps is:
	* creating a new WinJS.Class for the control and:
		* defining a constructor function, named **Control_ctor**, called whenever WinJS finds a new control, to initialize the objects that make up the custom control. In this example that includes:
			* creating the visual elements and adding them to the main control element (that should be a _div_), 
			* setting up default values for all internal members,  
			* calling the utility function _setOptions_ to apply any options defined by the user in the **data-win-options** property. In this example the values of **labelOn** and **labelOff** are being reset as well.
		* defining instance members. In this example the **checked** property is defined, with _get_ and _set_ functions. Notice that the _set_ property throws the onchange event when called.
	* defining a namespace **MyApp.UI** and including the **Checkbox** class in it. This publishes the control class and exposes it to be accessed by any code in our app. It also allows us to potentially group a set of custom controls in the same namespace.
	* setting up the event handlers for the control. The call to _WinJS.Class.mix_ adds _addEventListener_, _removeEventListener_ and _dispatchEvent_ functions to the control, for the **onchange** event.

	* In the html file, the updates are to include the reference to the new control and to update the template to use the newly included **MyApp.UI.Checkbox** control (the **data-win-control** property). The following properties were not changed, but some clarification would help understand how the control works:
		* the **data-win-bind** property, called when data is bound to the control, binds the **onchange** event dispatched by the control to the **toggle** function defined in **data.js**, and also the **checked** property to the **complete** property in the data model. 
		* the **data-win-options** property redefines the values of some properties, namely **labelOn** and **labelOff**, to new values. 

1. Press **F5** to build and debug the application. The app will launch in the emulator. The interface should have updated to display checkboxes instead of the slider-type control displayed by **WinJS.ToggleSwitch** control.
As before, it should be possible to add new tasks, mark others as completed and the task list should be persisted in between executions of the application.

	![Debugging the To Do app with new Checkbox control](images/debugging-the-to-do-app-with-new-checkbox-con.png?raw=true)

	_Debugging the Windows Phone app with the Custom WinJS control_


##Summary

In this lab you have learned how to create a simple native app that works on Windows and Windows Phone using Html, JavaScript and WinJS, and how to create a custom WinJS control and integrate it into it. 
