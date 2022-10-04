# Fib Trivia
A full stack development project project utilising both JavaScript with JQuery alongside MongoDB and Websockets to create a real-time online multiplayer trivia game.

# Dependencies
Node.js

# Usage
- Clone repository
- Open the project in VSCode or chosen IDE
- Within the client/Gamepage.html, update the socket io connection string to match the IP of the server.
- Host webserver for the web client and run "RunNodeServer.bat" for the web server
- For online hosting foward ports 25565 - 25566 or change ports within client/Gamepage.html and server/Server.js

# Project Aims
To create a multiplayer trivia quiz game in where players complete with each other by scoring points throughout multiple rounds. These rounds feature several key stages. 
The first stage is players provide a “fake answer” to a provided question, taken from the database, in an attempt to create a believable answer to trick other players. 
![Example01](https://user-images.githubusercontent.com/38397169/193795567-e715eef0-5b3f-47d9-8d2d-0ec12997c76f.PNG)

The second stage is players finding the real answer added to the list of fake user-provided answers.
![Example02](https://user-images.githubusercontent.com/38397169/193795589-eefd9a1b-20f4-4ae6-8783-475b34f66a55.PNG)

# Design
![Capture01](https://user-images.githubusercontent.com/38397169/193794783-35bafd43-70b0-425f-ac16-857c7a129685.PNG)
![Capture02](https://user-images.githubusercontent.com/38397169/193795162-a98ab2b3-48c9-4e3f-a01b-dc9f1223cf29.PNG)
![Capture03](https://user-images.githubusercontent.com/38397169/193795362-995c304c-12f2-4733-8d69-b8449a150668.PNG)


# Primary Skills Gained
- Understanding and usage of Websockets
- Learning Node.js
- Connecting and reading information from an external database
- Handleing logic between clients and a server
- Using OOP within javascript
