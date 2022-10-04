# Fib Trivia
A full stack development project utilising both JavaScript with JQuery alongside MongoDB and Websockets to create a real-time online multiplayer trivia game.

# Dependencies
Node.js

# Usage
- Clone repository
- Open the project in VSCode or similar IDE
- Within the client/Gamepage.html, update the socket io connection string to match the IP of the server.
- Host the webserver for the web client and run "RunNodeServer.bat" for the webserver
- For online hosting forward ports 25565 - 25566 or change ports within client/Gamepage.html and server/Server.js

# Project Aims
The aim was to create a website that updates dynamically, without the need for refreshing the webpage, based on the actions of other users on the site.
To achieve this aim a multiplayer trivia game was chosen as the project, where users complete with each other by scoring points throughout multiple rounds.

Each round is split up into 3 stages:
- 1 Users provide a “fake answer” to the question in an attempt to create a believable answer to trick other players. 
![Example01](https://user-images.githubusercontent.com/38397169/193795567-e715eef0-5b3f-47d9-8d2d-0ec12997c76f.PNG)

- 2 Users must now find the real answer hidden within a list of fake user-provided answers.
![Example02](https://user-images.githubusercontent.com/38397169/193795589-eefd9a1b-20f4-4ae6-8783-475b34f66a55.PNG)

- 3 Users score points by guessing the correct answer as well as points for any users that fell for the "fake answer" they provided in stage 1.

# Architecture
The architecture of the system is a client-to-server design. Multiple web clients communicate with the node.js server which in turn fetches data from the database. The system operates mostly through communication between the client and server. Most functions are started by the client, usually from user input. The client will send these messages to the server which will then send the appropriate message to the other clients.

![Capture02](https://user-images.githubusercontent.com/38397169/193795162-a98ab2b3-48c9-4e3f-a01b-dc9f1223cf29.PNG)

![Capture01](https://user-images.githubusercontent.com/38397169/193794783-35bafd43-70b0-425f-ac16-857c7a129685.PNG)

![Capture03](https://user-images.githubusercontent.com/38397169/193795362-995c304c-12f2-4733-8d69-b8449a150668.PNG)


# Primary Skills Gained
- Understanding and usage of Websockets
- Learning Node.js
- Connecting and reading information from an external database
- Handling logic between clients and a server
- Using OOP within javascript

# Video Demo and Overview
https://www.youtube.com/watch?v=vxujUvcHNEk
