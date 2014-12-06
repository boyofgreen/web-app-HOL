Building a cross-platform app with Cordova
==========================================

You can build cross-platform apps for iOS, Android, and Windows devices by using Visual Studio Tools for Apache Cordova. This Visual Studio extension enables cross-platform development using Cordova and standard web technologies such as HTML, CSS, and JavaScript.

You can use the extension to build apps for the following devices and platforms:

- Android 2.3.3 and later (4.4 provides the best developer experience)
- iOS 6, 7, and 8
- Windows 8 and 8.1
- Windows Phone 8 and 8.1

<!-- In this lab you will: create a native mobile cross-platform application using Apache Cordova. You will also learn how to use Visual Studio Tooling for Cordova to build and debug cross-platform applications. -->
This hands-on lab includes the following tasks:

1. [Building a cross-platform packaged app with Cordova](#BuildCordovaApp)
2. [Using Visual Studio to debug the application in multiple platforms](#DebuggingAppInMultiplePlatforms)

<a name="BuildCordovaApp" />
##Building a cross-platform packaged app with Cordova

In this task you will learn how to build a cross-platform app using JavaScript, HTML and AngularJS. The app is a simple To Do List app that allows you to add To Do items along with a description. It is also possible to delete them and toggle their completed status. 

The focus will be on the creation of the project using Visual Studio. However, it is possible to use **Apache Cordova command-line interface (CLI)** to create the application. For instructions on how to create the application using the CLI follow the instructions at [Building the application using Apache Cordova CLI](#CreateSolutionUsingCLI)

The first step is to create a new project to contain the code and resources that will make up the app.

1. Start Visual Studio and create a new **Blank App (Apache Cordova)** project named _CordovaToDo_.

	> **Note:** You can find this template under the **JavaScript** node.

	![create new Cordova project](images/create-new-cordova-project.png?raw=true)

	_Create new Blank Cordova project_

	The new project will contain just one JS project named **CordovaToDo (Tools for Apache Cordova)**.

	Since the app uses Angular controls, you will install the AngularJS libraries (though any other framework like backbound or WinJS could have been used). After that, you will add all other required files.

	<a name="BuildCordovaAppStep2" />
1. Open the **Package Manager console** (from the **Tools** menu, click **NuGet Package Manager** and then **Package Manager Console**). 

	![Open Package Manager Console](images/open-package-manager-console.png?raw=true)

	_Open Package Manager Console from the Tools menu_

1. Type the following command:

	````PowerShell
	Install-Package AngularJS.Core
	````
	Wait for the AngularJS package to download and install.

	![Install AngularJS Package](images/install-angularjs-package.png?raw=true)

	_Install AngularJS Package from the Package Manager Console_

1. Open **index.html** and insert a _script_ tag to include AngularJS as shown below in the _body_ element. Make sure that it is added after the Cordova reference.

	<!-- mark:5 -->
	````HTML
    <!-- Cordova reference, this is added to your app when it's built. -->
    <script src="cordova.js"></script>
    <script src="scripts/platformOverrides.js"></script>

    <script src="scripts/angular.js"></script>

    <script src="scripts/index.js"></script>
	````

1. Right-click the **scripts** folder and add a new JavaScript file named **app.js**. Copy and paste the code from [CordovaToDo/scripts/app.js](EndSolution/CordovaToDo/CordovaToDo/scripts/app.js)  (or from the code snippet below) into your newly created file.

	````JavaScript
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
	````

1. Open **index.css** in the **css** folder. Copy and paste the code from [CordovaToDo.Shared/css/index.css](EndSolution/CordovaToDo/css/index.css) (or from the code snippet below) into your **index.css**, replacing the default code.

	````CSS
	html,
	body {
		 padding: 0;
		 background: #F7f7f7;
		 color: #4d4d4d;
		 margin: 0 auto;
		 font: 18px 'Helvetica Neue', Helvetica, Arial, sans-serif;
		 line-height: 1.4em;
		 width: 100%;
	}

	/* no outline for buttons & checkboxes*/
	button,
	input[type="checkbox"] {
		 outline: none;
	}

	textarea {
		 overflow: hidden;
	}

	button.destroy {
		 margin: 0;
		 padding: 0;
		 border: 0;
		 background: none;
		 font-size: 24px;
		 font-weight: bolder;
		 color: darkred;
	}

	.todo-item span {
		 font-size: 18px;
	}

	#main .completed span {
		 text-decoration: line-through;
	}

	#todoapp {
		 background: rgba(255, 255, 255, 0.9);
		 border: 1px solid #ccc;
		 position: relative;
		 border-top-left-radius: 2px;
		 border-top-right-radius: 2px;
		 box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.15);
		 height: 99vh;
		 min-height: 99vh;
		 margin: 0;
		 overflow-y: auto;
	}

	/* section styles*/
	@media (min-width: 550px) {
		 #todoapp {
			  width: 74vw;
			  left: 13vw;
			  top: 50px;
			  height: 85vh;
			  min-height: 85vh;
		 }
	}

	#todoapp:before {
		 content: '';
		 border-left: 1px dotted #888;
		 z-index: 2;
		 width: 0;
		 position: absolute;
		 top: 0;
		 left: 40px;
		 height: 100%;
	}


	/* dark band on the header*/
	#headerBand {
		 position: relative;
		 height: 4vh;
		 max-height: 20px;
		 border-bottom: 1px solid #6c615c;
		 background: rgba(52, 59, 69, 1);
		 border-top-left-radius: 1px;
		 border-top-right-radius: 1px;
	}

	.header-content {
		 background: rgba(237, 237, 237, 0.9);
		 position: relative;
	}

	#new-todo {
		 background: rgba(237, 237, 237, 0.9);
		 position: relative;
		 height: 10vh;
		 max-height: 70px;
		 font-size: 21px;
		 font-family: "Arial";
		 outline: none;
		 color: rgb(114, 115, 115);
		 padding: 20px 0 0 50px;
		 border: 0;
		 margin: 0;
		 width: calc(100% - 100px);
	}

	#add-todo-button {
		 top: 0;
		 width: 50px;
		 height: auto;
		 right: 0;
		 bottom: 0;
		 position: absolute;
		 max-height: none;
		 background: #ccc;
		 display: inline-block;
		 font-size: 32px;
		 font-weight: bold;
		 font-family: "Arial";
		 border: 0;
		 margin: 0;
		 padding: 0;
		 outline: none;
	}

	#todoapp h1 {
		 font-size: 28px;
		 font-weight: bold;
		 color: #555;
		 color: rgba(255, 255, 255, 0.3);
		 text-shadow: -1px -1px rgba(0, 0, 0, 0.2);
		 padding: 0 50px;
	}

	/* the main section that hosts the listview*/
	#main {
		 padding: 20px 54px;
		 z-index: 1;
		 border-top: 1px dotted #adadad;
	}
	````

	Now you will include the code for the application and update the main page (**index.html**) to display the elements that make up the application user interface.

1. Open **index.html** and insert the _script_ tag targeting the app.js file in the _body_ element, between the _AngularJS_ and _index.js_ reference.
	
	<!-- mark:6 -->
	````HTML
    <!-- Cordova reference, this is added to your app when it's built. -->
    <script src="cordova.js"></script>
    <script src="scripts/platformOverrides.js"></script>

    <script src="scripts/angular.js"></script>
    <script src="scripts/app.js"></script>

    <script src="scripts/index.js"></script>
	````	

1. Still in **index.html**, add the **ng-app** attribute to the _body_ element with the value **cordova-todo** as shown below.

	````HTML
	<body ng-app="cordova-todo">
	````

	Additionally, replace the **p** element right at the beginning of the _body_ element with the **section** element shown below.
	<!-- mark:2-24 -->
	````HTML
	<body ng-app="cordova-todo">
		 <section id="todoapp" ng-controller="ToDoCtrl">
			  <header id="header">
					<div id="headerBand"></div>

					<div class="header-content">
						 <textarea id="new-todo" rows="1" placeholder="what needs to be done?" ng-model="newTodoItem"></textarea>
						 <button id="add-todo-button" ng-click="addToDoItem()">+</button>
					</div>
			  </header>

			  <h1>My ToDo's</h1>

			  <section id="main" ng-show="todos.length">
					<div ng-repeat="todo in todos track by $index" ng-class="{completed: todo.completed}">
						 <div class="todo-item">
							  <input class="toggle" type="checkbox" ng-model="todo.completed" ng-change="toggleCompleted(todo)">
							  <span>{{todo.title}}</span>
							  <button class="destroy" ng-click="removeTodoItem(todo)">x</button>
						 </div>
					</div>
			  </section>
		 </section>

		 <!-- Cordova reference, this is added to your app when it's built. -->
		 <script src="cordova.js"></script>
		 <script src="scripts/platformOverrides.js"></script>


		 <script src="scripts/angular.js"></script>

		 <script src="scripts/app.js"></script>

		 <script src="scripts/index.js"></script>
	</body>
	````

1. Double-click **config.xml** to open the file in the Designer. In the **Windows** tab, select **Windows 8.1** in the **Windows Target Version** dropdown.

	![Set Windows Target Version](images/set-windows-target-version.png?raw=true)

	_Set Windows Target Version to Windows 8.1_

	You can set other properties in the config.xml, like the application Display Name, Id, Version, etc. for each platform.

	Now you will set all the logos and splash screens, so they are displayed when opening the application or showing them in a list. The icons are located under **res\icons** and the splash screens are under **res\screens**, both separated by platform. You will update them directly on the file system.

	![Icons for all platforms](images/icons-for-all-platforms.png?raw=true)

	_Icons for all platforms are under res/icons_

1. Open a file explorer and browse to the folder **res\icons** of your **CordovaToDo** project. Replace the files under each platform folder with the ones in this repository.
	
	* windows: [res\icons\windows](EndSolution/CordovaToDo/CordovaToDo/res/icons/windows)
	* windows phone: [res\icons\wp8](EndSolution/CordovaToDo/CordovaToDo/res/icons/wp8)
	* android: [res\icons\android](EndSolution/CordovaToDo/CordovaToDo/res/icons/android)
	* iOS: [res\icons\iOS](EndSolution/CordovaToDo/CordovaToDo/res/icons/iOS)

1. Still in the file explorer, go to the **res\screens** folder of your **CordovaToDo** project. Replace the files under each platform folder with the ones in this repository.
	
	* windows: [res\screens\windows](EndSolution/CordovaToDo/CordovaToDo/res/screens/windows)
	* windows phone: [res\screens\wp8](EndSolution/CordovaToDo/CordovaToDo/res/screens/wp8)
	* android: [res\screens\android](EndSolution/CordovaToDo/CordovaToDo/res/screens/android)
	* iOS: [res\screens\iOS](EndSolution/CordovaToDo/CordovaToDo/res/screens/iOS)

1. Switch back to Visual Studio and close the **config.xml** tab. 

	In the next step you will open it again in "code" mode instead of using the Designer, so we can set the background color. 

1. In the Solution Explorer windows, right-click **config.xml** and click **View Code**.

	![Open config.xml in Code Mode](images/open-configxml-in-code-mode.png?raw=true)

	_Click View Code for file config.xml_

1. You should see the xml view of the file. Insert the BackgroundColor line as shown below:

	<!-- mark:5 -->
	````XML
	  <preference name="SplashScreen" value="screen" />
	  <preference name="windows-target-version" value="8.1" />
	  <preference name="windows-phone-target-version" value="8.1" />
	  <preference name="Fullscreen" value="false" />
	  <preference name="BackgroundColor" value="#000000" />
	  <vs:platformSpecificValues />
	````

1. Save and close the file.

	The next steps have been added as a temporary workaround for a certificate when running on Windows. You can find more information about this issue [here](http://cordova.apache.org/news/2014/11/11/windows-cert.html).

1. Expand the **res\native** folder and if there is not a **windows** folder, add one. Once the windows folder exists, right-click it and select **Add existing item**. When the file dialog opens, browse to the file **CordovaApp_TemporaryKey.pfx**. You can download this file from the link provided above or from this repository ([here](EndSolution/CordovaToDo/CordovaToDo/res/native/windows))

	Your project should look like this:

	![Cordova Solution contents](images/cordova-solution-contents.png?raw=true)

	_Contents of the project_
	
	To build and run the application you will select a target platform from the **Solution Platforms** dropdown in the toolbar. If the **Solutions Platform** dropdown list is not showing, you can display it by clicking the Add or Remove buttons in the toolbar and then selecting **Solution Platforms**.

	![Show Solution Platforms list in toolbar](images/show-solution-platforms-list-in-toolbar.png?raw=true)

	_Show Solution Platforms list in the toolbar_

1. In the **Solution Platforms** list, select **Windows Phone (Universal)**.

	![Select Windows Phone in Solution Platforms list](images/select-windows-phone-in-solution-platforms-li.png?raw=true)

	_Select Windows Phone (Universal) in Solution Platforms list_

1. Set the Debugging mode to the desired emulator, or connect a device to run the application in a real device.

	> **Note:** it is not possible to debug the application in Windows Phone, but the application will be built and deployed to the emulator.

	![Select Windows Phone emulator](images/select-windows-phone-emulator.png?raw=true)

	_Select the desired Windows Phone emulator_

1. Press **F5** to build and launch the application in the selected emulator. 
	
	After being built, the selected emulator will be started. The app will be deployed and launched. You should see the splash screen and then the interface of the app, where the list of tasks should be visible. It should be possible to add new To Do items, remove existing ones or update the status for one.

	![Launch app in selected wp emulator](images/launch-app-in-selected-wp-emulator.png?raw=true)

	_Launch the application in the selected emulator_

<a name="DebuggingAppInMultiplePlatforms" />
##Debugging the application in Multiple Platforms

In this part of the lab you will learn you how you can run or debug your application in different platforms like Android, Windows 8 and Windows Phone. 
You can find more information about debugging applications that use Apache Cordova [here](http://msdn.microsoft.com/en-us/library/dn757061.aspx).

###Debugging in Windows simulator
Follow these steps to debug your application in a Windows simulator. The same Visual Studio debugging tools that you would use for any Windows Store app built using HTML and JavaScript are available.

1. In the **Solution Platforms** list, select **Windows-AnyCPU**.

1. Set the debug mode to **Simulator** in the toolbar.

	![Select Windows in Solution Platforms](images/select-windows-in-solution-platforms.png?raw=true)

	_Set Debugging mode to Simulator_

1. Press **F5** to build and debug the application. 
	The app should launch in the Simulator. If this does not happen the first time the Simulator is launched, try again.

	The Simulator will first display a splash screen like the one below and then the To Do list. You should be able to use all functionalities of the application.

	![Splash screen for the app in Simulator](images/splashscreen-for-the-app-in-simulator.png?raw=true)

	_Splash screen for the app_

	![App running in Simulator](images/app-running-in-simulator.png?raw=true)

	_The application, running in the Simulator_

1. Switch back to Visual Studio and open **app.js**.

1. Toggle a breakpoint on the line that defines the _addToDoItem_ function by clicking the gray margin to the left. Alternatively, with the cursor on the line, you can press **F9** or use the **Toggle Breakpoint** option in the **Debug** menu.

1. While making sure you are still debugging the application, switch to the Simulator and add a new task.

	Right after clicking the _Add_ button, Visual Studio should be brought to focus, displaying the current execution line at the point where the breakpoint was set.  

	![Breakpoint hit in JavaScript Windows](images/breakpoint-hit-in-javascript-windows.png?raw=true)

	_Breakpoint has been hit_

	At this point you can examine variables, continue the execution step by step or click Continue in the toolbar to let the application run. More options are available [here](http://msdn.microsoft.com/en-us/library/windows/apps/hh924759.aspx).

	It is also possible to view the page that the application is currently displaying by switching to the **DOM Explorer** tab, which is normally opened when debugging. If it is not visible, you can open it by clicking **Show All** in **Debug** > **Windows** > **DOM Explorer**.

	In the **DOM Explorer** view you can see exactly what is being displayed by the application as well as the styles applied to the visual elements. It is also possible to tweak them and see the updates in the app running in the Simulator. This is useful for tweaking the user interface.

	![DOM Explorer View Windows](images/dom-explorer-view-windows.png?raw=true)

	_DOM Explorer view_

1. Stop debugging.
 
	The app in the Simulator should close, but the Simulator won't close. You can launch the application again in the Simulator by searching for it. Alternatively, you can start debugging again from Visual Studio. 

###Debug in the Android emulator
Follow these steps to debug your application in an Android emulator. The Apache Ripple emulator is a web-based mobile environment simulator designed to enable development of mobile web applications for various frameworks, such as Cordova.

1. In the **Solution Platforms** list, select **Android**.

1. Set the debug mode to your desired emulator in the toolbar, e.g. Ripple - Nexus (Galaxy)

	![Select Android in Solution Platforms list](images/select-android-in-solution-platforms-list.png?raw=true)

	_Select Android in the Solution Platforms list_

1. Press **F5**.

	The Ripple emulator will be launched in a browser, and the application will be displayed. You won't see the splash screen, just the main application view.

	![Debug app in Android with Ripple](images/debug-app-in-android-with-rpple.png?raw=true)
	
	_Debug the Android version in Ripple_

	At this point, you can set breakpoints in your code in Visual Studio as explained in the previous section and they will be hit. As before, when the breakpoint is hit, you should be able to inspect variable values, view the call stack and debug the code by executing it line by line.

	The DOM Explorer is also available.

1. Stop debugging.
 
	The emulator will close.

###Debug in the iOS emulator
Follow these steps to debug your application in an iOS emulator. 

1. In the **Solution Platforms** list, select **iOS**.

1. Set the debug mode to your desired emulator in the toolbar, e.g. Ripple - iPhone 5.

	![Select iOS in Solutions Platform and select emulator](images/select-ios-in-solutions-platform-and-select-e.png?raw=true)

	_Select iOS in the Solution Platforms list and emulator_

1. Press **F5**.

	The Ripple emulator will be launched in a browser, and the application will be displayed. You won't see the splash screen, just the main application view.

	![Debug app in iOS with Ripple](images/debug-app-in-ios-with-ripple.png?raw=true)

	_Debug the app in iOS with Ripple_

	At this point, you can set breakpoints in your code in Visual Studio as explained in the previous section and they will be hit. As before, when the breakpoint is hit you should be able to inspect variable values, view the call stack and debug the code by executing it line by line.

	The DOM Explorer is also available.

##Summary
In this lab you have created a cross-platform application using the Apache Cordova tools from Visual Studio and debugged it in the different platforms.


##Appendix
<a name="CreateSolutionUsingCLI" />
##Building the application using the Cordova command-line interface (CLI)

The **Cordova command-line interface (CLI)** is a tool that allows you to build cross-platform projects, abstracting away much of the functionality of lower-level shell scripts. In this section you will briefly describe how to create an application using the CLI. 
For more information about installation of the Cordova CLI and what it has to offer, you can browse the Apache Cordova Documentation pages available [here] (http://cordova.apache.org/docs/en/4.0.0/guide_overview_index.md.html).

###Prerequisites:

* Cordova CLI Tool must be installed (instructions can be found [here]( http://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html#The%20Command-Line%20Interface))

* SDKs for any platform to be targeted should be installed (instructions can be found [here](http://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides)).
	
	For Windows 8.0, Windows 8.1 and Windows Phone 8.1, having Visual Studio 2015 Preview or Visual Studio 2013 Update 4 is sufficient.

###Steps:
1.	Open a command line prompt.
1.	Go to the directory where the application code will reside (e.g. MyProjects).
1.	Run the following command:

	````PowerShell
	cordova create CordovaToDoCLI com.CordovaToDo.CordovaToDoCLI CordovaToDoCLI
	````

	![Create Cordova project from CLI](images/create-cordova-project-from-cli.png?raw=true)

	_Create Cordova project from CLI_

	This will create a **CordovaToDoCLI** directory (1st argument, so it should not exist) where the application assets will be stored and where the Cordova library is downloaded. The 2nd argument provides your project with a reverse domain-style identifier, and the 3rd one provides the application a display title (in this case, **CordovaToDo**). 
 
1.	Go to the newly created folder, CordovaToDo, as all commands need to be run from there.

	````PowerShell
	cd CordovaToDoCLI
	````

1.	Specify the set of target platforms by running the following commands (provided your machine supports the SDK and it is installed in the machine)

	````PowerShell
	cordova platform add android
	cordova platform add wp8
	cordova platform add windows
	````

	If you want to verify the set of platforms, run:

	````PowerShell
	cordova platforms ls
	````

	![Add platforms using CLI](images/add-platforms-using-cli.png?raw=true)

	_Add platforms to the project using the CLI_


	For each platform added, a new folder is created under **CordovaToDoCLI/platforms**. These folders will contain a replica of the project’s **www** folder and should not be modified directly as they are periodically overwritten.

	![Platform folders in CLI project](images/platform-folders-in-cli-project.png?raw=true)

	_Platform folder created by the CLI_

1.	To build the project for all platforms run:

	````PowerShell
	cordova build
	````

	![Contents of the Windows folder created by CLI](images/contents-of-the-windows-folder-created-by-cli.png?raw=true)

	_Contents of the Windows folder created by the CLI after building_

1. To run the project, execute the following command replacing the _[platform]_ placeholder with one of the installed platforms (e.g.: wp8, windows, etc.).

	````PowerShell
	cordova emulate [platform]
	````

	![Running the new project in Windows Phone](images/cli-running-wp.png?raw=true)

	_Running the new project in Windows Phone_
