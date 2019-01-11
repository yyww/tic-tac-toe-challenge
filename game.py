from flask import make_response, abort

ID = 2

# Data to preload for our API
GAMESTATS = {
    "1": {
        "gameId": "1",
        "player1": "Anaconda AI",
        "player2": "John Smith",
        "result": "Playing",
		"status": {
			"status0": ["1", "3", "8"],
			"status1": ["2", "6", "9"],
		},
    },
    "2": {
        "gameId": "2",
        "player1": "Alpha Go",
        "player2": "Anaconda AI",
        "result": "Player1 wins!",
		"status": {
			"status0": ["1", "2", "3"],
			"status1": ["4", "7", "9"],
		},		
    },	
}

def read_all():
    # Preload game data
    return [GAMESTATS[key] for key in sorted(GAMESTATS.keys())]

def read_one(gameId):
    # Check if game exist
    if gameId in GAMESTATS:
        game = GAMESTATS.get(gameId)
    else:
        abort(
            404, "Game with ID {gameId} not found".format(gameId=gameId)
        )

    return [game]

def create(game):
    global ID
    ID = ID + 1
    player1 = game.get("player1", None)
    player2 = game.get("player2", None)
    gameId = ID
    result = "Playing"
    status = {}

    GAMESTATS[str(gameId)] = {
        "gameId": str(gameId),
        "player1": player1,
        "player2": player2,
        "result": result,
        "status": status,
    }

    return GAMESTATS[str(gameId)], 201

def update(gameId, game):
    # Check if game exist
    if gameId in GAMESTATS:
        GAMESTATS[gameId]["player1"] = game.get("player1")
        GAMESTATS[gameId]["player2"] = game.get("player2")
        GAMESTATS[gameId]["result"] = game.get("result")
        GAMESTATS[gameId]["status"]["status0"] = game.get("status0")
        GAMESTATS[gameId]["status"]["status1"] = game.get("status1")

        return GAMESTATS[gameId]

    else:
        abort(
            404, "Game with ID {gameId} not found".format(gameId=gameId)
        )

def delete(gameId):
    # Check if game exist
    if gameId in GAMESTATS:
        del GAMESTATS[gameId]
        return make_response(
            "Game {gameId} successfully deleted".format(gameId=gameId), 200
        )

    else:
        abort(
            404, "Game with ID {gameId} not found".format(gameId=gameId)
        )
