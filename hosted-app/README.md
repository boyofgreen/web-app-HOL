Building a hosted app
===============================

In this lab you will learn how to write a hosted application for an existing website using the WebView control and the [Web Application Template](https://wat-docs.azurewebsites.net/) (WAT). Additionally, you will learn how to add support for offline detection and SuperCache as well. 

This lab includes instructions for:

1. [Setting up a website](#WebsiteSetup)
1. [Building a Hosted app using the WebView Control](#BuildHostedAppWebView)
1. [Building a Hosted app using WAT](#BuildHosteAppWAT)
1. [Adding offline functionality to hosted app](#HostedAppOffline)

<a name="#WebsiteSetup" />
##Setting up a website
To be able to execute the instructions in the upcoming sections you will need a running website. 

The website that will be used in this lab is a simple To Do List website that supports user registration and login, and maintains a list for each user. The user logged in can add and delete To Do items consisting of a description, and toggle their completed status. 

To setup the website locally follow these steps: 

1. Start Visual Studio and open the **ToDoSite** solution in the [website](website) folder of this repository.

1. Press **F5** to build and debug the application.

	The website will open in a new tab in Internet Explorer.

	Take note of the URL of the website, as we will use it in the remaining tasks of this lab whenever **%WebsiteURL%** is mentioned. It should have the form: **http://localhost:\<port\>**.

	![Take note of the url of the site](images/taking-note-of-the-url-of-the-site.png?raw=true "Take note of the url of the site")

	_Take note of the url of the site_

1. Click **Register as a new user** in the **Login Page**. 
	
	When the **Register** page is displayed, enter values in all fields and click **Register**.

	_Note: the email address does not need to exist, as it will be used as a local identifier._

	![Register a new account](images/registering-a-new-account.png?raw=true "Register a new account")

	_Register a new account_

Keep the site running while executing all sections of this lab.

<a name="#BuildHostedAppWebView" />
##Building a hosted app using the WebView Control
The WebView control hosts HTML content in an application and allows navigation to a URL. You can find more information about the properties, methods and events it provides [here](http://msdn.microsoft.com/en-us/library/windows/apps/dn301831.aspx).
In this section we will show you how to build a hosted app that uses a WebView control to display the existing website, and how to add an event handler to it. 

1. Start Visual Studio and create a **new JavaScript Blank app** (**Universal Apps**) project named _HostedToDo_.

	![Create New JavaScript project](images/create-new-javascript-project.png?raw=true)

	_Create new Blank JavaScript project_

	The new project will include:
	* One Windows Store app project, named _HostedToDo.Windows_.
	* One Windows Phone Store app project, named _HostedToDo.WindowsPhone_. 
	* One _HostedToDo.Shared_ folder to store shared code. By default, all JavaScript files for the project are shared. HTML and CSS files can also be shared.

1. Open **default.html** in the **HostedToDo.Windows** project and replace the content of the body element with the following content. Replace the variable **%WebsiteURL%** obtained while setting up the website in the setup section of this lab.

	<!-- mark:2-3 -->
	````HTML
	<body>
		 <x-ms-webview id="webview" src="%WebsiteURL%">
		 </x-ms-webview>
	</body>
	````

1. Open **default.css** in the **css** folder of the **HostedToDo.Windows** project and add the following CSS rules:

	````CSS
	#webview {
		 width: 100%;
		 height: 100%;
	}
	````

1. Verify that the **HostedToDo.Windows** project is set as startup project (project name should show **in bold**) and that the debug mode is set to **Simulator** in the toolbar.

1. Press **F5** to build and debug the application. 

	Verify that the app launches in the Simulator.	The Simulator will first display a splash screen like the one below and then the Login page of the website. After logging in with the user created in the setup steps, you should be able to view your existing To Do items (if any), add new To Do items and mark them as completed.

	![Windows App Debugging no splash screen](images/windows-app-debugging-no-splashscreen.png?raw=true)

	_HostedToDo splash screen_

	![Windows App Debugging](images/windows-app-debugging.png?raw=true)

	_HostedToDo Login Page_

	![windows-app-debugging-main page](images/windows-app-debugging-main-page.png?raw=true)

	_HostedToDo Main View_

	As you have noticed, the splash screen displays an empty image. To fix this, as well as other branding issues, edit the **package.appxmanifest** file as explained in the [Native App lab](../native-app). The images that you can use can be found in the [Windows images folder](/EndSolutionHostedApp/HostedToDo/HostedToDo/HostedToDo.Windows/images) of the end solution for this lab.
	Then you can press **Ctrl+Shift+F5** or hit the **Restart** button in the toolbar to relaunch the app with the changes just made applied.

1. Stop debugging.

	As we did for the Windows project, we will customize and debug the Windows Phone application on an emulator.

1. Open **default.html** in the **HostedToDo.Windows.Phone** project and replace the body element with the following content. Again, replace **%WebsiteURL%** by the value obtained while setting up the website in the setup section of this lab.

	<!-- mark:2-3 -->
	````HTML
	<body class="phone">
		 <x-ms-webview id="webview" src="%WebsiteURL%">
		 </x-ms-webview>
	</body>
	````

1. Open **default.css** in the **css** folder of the  **HostedToDo.Windows.Phone** project and insert the following CSS rules:

	````CSS
	#webview {
		 width: 100%;
		 height: 100%;
	}
	````
	
	As before, follow the instructions in the [Native App lab](../native-app) to edit the **package.appxmanifest** in the **HostedToDo.Windows.Phone** project and update the images, background color and other properties there. The images that you can use can be found in the [WindowsPhone images folder](/EndSolutionHostedApp/HostedToDo/HostedToDo/HostedToDo.WindowsPhone/images) of the end solution for this lab.

1. Set the **HostedToDo.WindowsPhone** project as startup project and select a Windows Phone emulator from the toolbar. 

1. Press **F5** to build and debug the application. 

	The selected Windows Phone Emulator will launch. Once the app launches, it will first display the splash screen and then the Login Page for the To Do app. As before, after logging in with the user created in the setup steps, you should be able to view your existing To Do items (if any), add new To Do items and mark them as completed.

	![Windows Phone splash screen](images/windowsphone-splashscreen.png?raw=true)

	_Hosted To Do splash screen on Windows Phone Emulator_

	![WindowsPhone ToDo Application](images/windowsphone-todo-application.png?raw=true)

	_HostedToDo application in Windows Phone_

1. Switch back to Visual Studio and stop debugging. 

	Now you will add an event listener to the WebView control, so that when it finishes loading it displays a welcome message to the user. You will need to add a new JavaScript file for the code and new elements for the message to the html page.

1. Right-click the **js** folder in the **HostedToDo.Shared** project and add a new JavaScript file named **eventhandlers.js**. Copy and paste the code from [HostedToDo.Shared/js/eventhandlers.js](/EndSolution/HostedToDo.Shared/js/eventhandlers.js) (or from the code snippet below) into your newly created file.

	````JavaScript
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
	````
	
	The code above defines and registers an anonymous function as an event handler for the **MSWebViewNavigationCompleted** event of the webView. This function, called when the WebView control finishes navigating to each page, is responsible for showing the welcome message if it has not been shown before. The function also registers an event handler for the **click** event of the _close_ button displayed as a red x in the welcome message. This event handler also saves to local storage that you have seen the welcome message, so next time it won't be displayed.

	There is also a call to _console.log_. You will learn where to view this message when debugging the application in the next steps.

	Other events for which handlers could be registered are:

	* MSVwebViewNavigationStart
	* MSVwebViewContentLoading
	* MSVwebViewDOMContentLoaded

	You can find the complete list of events and more information [here](http://msdn.microsoft.com/en-us/library/windows/apps/dn301831.aspx#events).

1. Open **default.html** in the **HostedToDo.Windows** project and update the _body_ element, so it looks like below. Again, replace **%WebsiteURL%** by the value obtained while setting up the website in the setup section of this lab.

	````HTML
	<body>
		 <div class="welcome-message">
			  <div id="welcome">
					<span id="close">x</span>
					<div class="message">
						 <h2>Welcome to the To Do application!</h2>
						 <div class="features">
							  <p>Add new tasks to your list, just type a description and click Add.</p>
							  <p>Delete tasks by clicking the red <span style="color:red">x</span> next to it.</p>
							  <p>Toggle the completion status of a task by checking/unchecking the checkbox.</p>
						 </div>
						 <p>Thanks for using To Do!</p> 
					</div>
			  </div>
		 </div>
		 <x-ms-webview id="webview" src="%WebsiteURL%">
		 </x-ms-webview>
		 <script src="/js/eventhandlers.js"></script>
	</body>
	````

	With these updates you have added the elements that make up the welcome message and included the **eventhandlers.js** file that was added as well, at the bottom of the file. Now you will add some styles required for the welcome message.

1. Open **default.css** in the **css** folder of the **HostedToDo.Windows** project and add the following rules after the existing ones:

	````CSS
	.welcome-message {
		 position: absolute;
		 width: 50%;
		 height: 40%;
		 top: 30%;
		 left: 20%;
		 z-index: 1000;
		 font-size: 20px;
		 font-weight: bold;
		 background: rgba(0, 0, 0, 0.9);
		 border: 4px solid #CCC;
		 display: none;
		 padding: 40px;
	}

	.features {
		 list-style: none;
		 text-align: left;
		 font-weight: bold;
	}
	.message {
		 text-align: center;
		 color: #EEE;
		 vertical-align: middle;
	}

	#close {
		 float: right;
		 color: red;
		 text-align:center;
		 border: 1px solid #CCC;
		 width: 34px;
		 height: 34px;
	}

	@media all and (max-width : 800px) {
		 .welcome-message {
			  left:0;
			  right:0;
			  top: 30%;
			  width: auto;
			  height: 40%;
		 }
	}
	````

1. Set the **HostedToDo.Windows** project as startup project. 

1. Press **F5** to start debugging.
	
	The app will launch in the Simulator. After the splash screen disappears you should see a welcome message like the one below, displaying instructions on how to use the app. This welcome message can be dismissed by clicking the red x at the top right of the message.

	![HostedToDo App displaying the welcome message](images/hostedtodo-app-displaying-the-welcome-message.png?raw=true)

	_Welcome message displayed when the application finishes loading the content_

1. Switch to Visual Studio while debugging, and find the **JavaScript Console** window. If not displayed, open it by clicking **Debug > Windows > JavaScript Console**.

	![JavaScript Console Window](images/javascript-console-window.png?raw=true)
	_JavaScript Console window_

	The **JavaScript Console** window displays messages sent to the console by the application, and allows you to interact with any application objects in scope. As you saw before, the code contained a call to the console.log method. You can see that the message was printed. You could add other messages or log the value of objects at the time they are in scope. This is one way of verifying your app behaves as expected.

	You can find more information about the **JavaScript Console** window and the console object [here](http://msdn.microsoft.com/en-us/library/windows/apps/hh696634.aspx).

1. Stop debugging.

	You will now make the same changes to the Windows Phone app. 

1. Open **default.html** in the **HostedToDo.WindowsPhone** project and update the _body_ element, so it looks like below. Again, replace **%WebsiteURL%** by the value obtained while setting up the website in the setup section of this lab.

	````HTML
	<body class="phone">
		 <div class="welcome-message">
			  <div id="welcome">
					<span id="close">x</span>
					<div class="message">
						 <h2>Welcome to the To Do application!</h2>
						 <div class="features">
							  <p>Add new tasks to your list, just type a description and click Add.</p>
							  <p>Delete tasks by clicking the red <span style="color:red">x</span> next to it.</p>
							  <p>Toggle the completion status of a task by checking/unchecking the checkbox.</p>
						 </div>
						 <p>Thanks for using To Do!</p>
					</div>
			  </div>
		 </div>
		 <x-ms-webview id="webview" src="%WebsiteURL%">
		 </x-ms-webview>
		 <script src="/js/eventhandlers.js"></script>
	</body>
	````

1. Open **default.css** in the **css** folder of the **HostedToDo.WindowsPhone** project and add the following rules after the existing ones:

	````CSS
	.welcome-message {
		 position: absolute;
		 width: auto;
		 height: 60%;
		 top: 20%;
		 left:0;
		 right:0;
		 z-index: 1000;
		 font-size: 20px;
		 font-weight: bold;
		 background: rgba(0, 0, 0, 0.9);
		 border: 4px solid #CCC;
		 display: none;
		 padding: 40px;
	}

	.features {
		 list-style: none;
		 text-align: left;
		 font-weight: bold;
	}
	.message {
		 text-align: center;
		 color: #EEE;
		 vertical-align: middle;
	}

	#close {
		 float: right;
		 color: red;
		 text-align:center;
		 border: 1px solid #CCC;
		 width: 34px;
		 height: 34px;
	}
	````

1. Set the **HostedToDo.WindowsProject** project as startup project. 

1. Press **F5** to start debugging.

	The app will launch in the emulator. As it happens for the Windows app, after the splash screen disappears you should see the welcome message and dismiss it by clicking the red x at the top right.

	![HostedToDo App displaying the welcome message](images/hostedtodo-wpapp-displaying-the-welcome-message.png?raw=true)

	_Welcome message displayed in Windows Phone app_

As you have seen, creating an application that uses a WebView control makes it quite easy to host web-based content in an application. Some advantages of using the WebView control are:

- Support for most HTML5 functionality,
- Improved navigation support, as the control has its own separate history that is navigable,
- Support for sites that don't work inside frame o iframe elements.

However, you will need to manually implement other features common to Windows or Windows Phone applications, like:

- navigating back when the back button is hit,
- displaying an appbar or navigation bar,
- detecting when the device is offline and displaying a message.

In the next section you will build an app using the Universal Template, which already contains code to handle those features by enabling the configuration options in a config file. 

<a name="#BuildHosteAppWAT" />
##Building a hosted app using WAT
The Web App Template for Universal Apps (WAT) is a Visual Studio 2013 template that lets developers create Windows and Windows Phone apps based on existing web content. You can find more information about it [here](http://wat-docs.azurewebsites.net/).
In this section you will learn how to build a hosted app for the website set up in the first section using the WAT and how to configure it to take advantage of other features that it provides out of the box. 

1. Start Visual Studio and open the **WatToDo** solution in the [BeginSolutionWatApp/WatToDo](BeginSolutionWatApp/WatToDo) folder of this repository.

	_Note:_ the WAT template currently does not support Visual Studio 2015. The solution opened in this step is an empty solution created with the WAT template using Visual Studio 2013, resulting from doing **File > New Project**, selecting **Web App Template for Universal Apps** under JavaScript and naming the project _WatToDo_.

	The solution includes:
	* a WatToDo folder containing: 
		* One Windows Store app project, named _WatToDo (Windows 8.1)_ 
		* One Windows Phone app named _WatToDo.WindowsPhone_,
		* One _WatToDo.Shared_ project to hold shared code,
	* a C# project named HtmlAgilityPack
	* a C# project named WatExtensions.

	The **Readme.html** file, located in the **WatToDo.Shared** project, contains brief information on the latest changes in this version of the template as well as information on the minimum configuration for the app. 

	The **config.json** file, located in the **config** folder in the **WatToDo.Shared** project, holds all the application configuration.

1. Click the **config.json** tab update the value of the following variables:

	* **"start_url"**: set it to **%WebsiteURL%** (as obtained in the setup section)
	* **"name"**: set it to _To Do_

	Save the file.
	<!-- mark:3-4 -->
	````JavaScript
	{
		 "$schema": "/schema/schema-manifest.json",
		 "start_url": "%WebsiteURL%",
		 "name" :  "To Do",

		 "wat_customScript": {
			  "scriptFiles._comment": "An array of custom script files stored within the app package that are injected into the DOM",
			  "scriptFiles": [
					"injection-script-example.js"
			  ]
		 },

		 "wat_styles": {
			  "customCssFile._comment": "This enables you to embed CSS styles which get inserted over the existing styles on your website. This is great for adjusting the style of the site when it is presented as an application. This can be used as an alterntive to the injected-styles.css.",
			  "customCssFile": "/css/injected-styles.css"
		 }
	}
	````

	With just these changes you have an app that is roughly equivalent to the one built in the previous section. What is needed for a truly equivalent app is to set the logos, branding and other properties in the app manifest for both projects, as explained in the Native App lab. The images that you can use can be found in the [Windows images folder](/EndSolutionWatApp/WatToDo/WatToDo/WatToDo.Windows/images) and [Windows Phone images folder](/EndSolutionWatApp/WatToDo/WatToDo/WatToDo.WindowsPhone/images) of the end solution for this lab.

1. Set the **WatToDo.Windows** project as startup project, and then the debug mode is set to **Simulator**.

1. Press **F5** to build and debug the application. 
	Verify that the app launches in the Simulator. If you have set the images and background color in the app manifest, the Simulator will display a splash screen and then the Login Page for the To Do app. After logging in with the user created in the setup steps, you should be able to view your existing To Do items (if any), add new To Do items and mark them as completed.

	![Windows WAT App Debugging](images/windows-wat-app-debugging.png?raw=true)

	_WatToDo main view_

1. Switch back to Visual Studio and stop debugging.

1. Set the **WatToDo.WindowsPhone** project as startup project and select a Windows Phone emulator.

1. Press **F5** to build and debug the application. 
	The selected WindowsPhone Emulator will launch. 
	Once the app launches, it will first display a splash screen and then the Login Page for the To Do app. Login in to see the list of To Do items and use other functionality.

	![Windows Phone Splash screen](images/windowsphone-splashscreen.png?raw=true)

	_Wat To Do splash screen on Windows Phone Emulator_

	![WindowsPhone ToDo Application](images/windowsphone-todo-application.png?raw=true)

	_WatToDo application in Windows Phone_

1. Switch back to Visual Studio and stop debugging. 

<a name="#HostedAppOffline" />
##Adding offline functionality to hosted app

### Coming soon...

<!--
1. Offline

a. Configure Offline page

b. Build and test

1. Configure app to use SuperCache

a. Configure app

b. Build and test
-->

###Summary
In this lab you have learned how to write a hosted application for an existing website using the WebView control and the Visual Studio Web Application Template(WAT). 