# Anaconda: Tic-Tac-Toe Coding Challenge
This application implements tic-tac-toe game. It provides REST API to communicate with Server, and a web page through which users can play the game. Data is stored in memory.

## Files included

1. README.txt
	this file
2. server.py
	Configure the endpoints and start application instance
3. game.py
	Implement endpoints and store data
4. swagger.yml
	Specify endpoints
5. /templates/home.html
	Provides template for the web page
6. /static/js/home.js
	Used MVC pattern to define how users can interact at the web page
7. /static/css/home.css
	Designs how the style for web page

## Python3 and Flask

This application uses Python3 and Flask to start the App Server and host APIs

## How to start the application

1. py server.py
	it will start the application
2. Navigate to http://localhost:5000/ using your browser, to bring up the web page
3. To play the game, users can double click the preloaded game from the Game Stats table, which will show up in the Game Board
4. Users can start a new game, by entering players name and click the create button. 
5. After the game is loaded, it will show the current status into the board. If the game is still playable (not a draw or no winner yet), users can click on the blank squares to make a move. The system will decide whose move it is and show it accordingly. If there is a winner or game is tied, it will display a message.
6. At any point when playing the game, users can click the Update button to save the game. If players name are modified, they will be updated as well.
7. While playing the game, users can delete the game as they wish. It will clear out the game board and remove the game from Game Stats
	
## Swagger UI

After the application is started, swagger file can be accessed at http://localhost:5000/api/ui/#/game. It will show the supported API calls from this application.
