# Automated Home Demo

## Demo
https://zhoujames.github.io/automate-home-demo/src/main/webapp/

## Description
This is a POC for Adobe AEM assessment. It is to simulate house automation of lights, curtains and heatings.
The core JS is built from scratch while the GUI is borrowed from an online example https://github.com/marybeshaw/Just-Another-Automated-Home.

### Features
* Requires jQuery only
* Event-driven architecture
* 3 build-in components: Heating, Lights & Curtains
* A demo to emulate automatic device control based on the hours of the day. 
* Easy to extend with new component or interact with the existing components
* Json based config files

## Build and Run
Run `mvn clean package`
Grab the dist package and unzip to anywhere that your web server can point to.

## Solution Approach
### Definition of components
All the smart devices are abstracted as a component that can be plugged into one house. The definition of the house and the components are persisted into a JSON format file. There are two major items in the configuration file.

#### Components
One component represents one active smart device in the house. Components are assembled by their category. The category is linked with a plugin that needs to be loaded in the application. 
Each component has got a unique identifier. The ‘type’ attribute is to distinguish the sub-category of devices. The ‘data’ attribute holds the running time data that a component will persist. Here is a live example of a light component.

#### Floor plan
This section in the configuration holds the location of smart devices in the house. The component array includes all the unique componentIds. The svgId is used by visual effect. It is the same as the section id in the floor plan SVG file.

### Component Plugin
Each type of smart devices is implemented in a separate plugin file. Each plugin file needs to register itself in the Home JavaScript in order to initialize properly. In the implementation of Plugin, there are two main types of functions. Repaint functions is to interact with GUI. Meanwhile, Add/Change/OnReady function is related with Publish/Subscribe particular event. It is easy to create your own plugin by referring the implementation of Light component.

### Event driven approach
As AH is an extensible solution, the solution is using an event-driven architecture. A Pub/Sub framework is implemented based on JavaScript. Each component will be reacted with a few standard events like “refresh” and “change”. The customized event subscriber could also be added into the plugin file.

#### Refresh 
Refresh event is triggered at application initialization as well as the behaviour changing. Refresh event could not just be triggered directly but also be triggered by another event.
#### Change 
Change event is triggered when the user change the behaviour of the component. It could be triggered from GUI or another timer event. 
#### Customized 
Customized event example can be found in Light component.  There is an out-of-box feature that emulates the automatic device control using customized event.

### Server communication
AH is currently mocking all dynamic requests to the server. The status of the whole house is representing in a JSON file. It could be replaced by a REST API which retrieves the data from a database or other storage.
 
### Interaction Log
The History component on the GUI is to record all the changes made by either the customer or triggered by internal events. It could be used to troubleshoot the event publish/subscribe in runtime. 



