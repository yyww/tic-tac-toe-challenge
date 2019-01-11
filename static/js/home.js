/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

var play = true;

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/games',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },		
        create: function(player1, player2) {
            let ajax_options = {
                type: 'POST',
                url: 'api/games',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'player1': player1,
                    'player2': player2
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(gameId, player1, player2, result, status0, status1) {
            let ajax_options = {
                type: 'POST',
                url: 'api/games/' + gameId,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'player1': player1,
                    'player2': player2,
                    'result': result,
                    'status0': status0,
                    'status1': status1
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(player2) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/games/' + player2,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $player1 = $('#player1'),
        $player2 = $('#player2');

    // return the API
    return {
        reset: function() {
            $player2.val('');
            $player1.val('').focus();
        },
        build_table: function(gamestats) {
            let rows = ''

            // clear the table
            $('#stats > tbody').empty();

            if (gamestats) {
                for (let i=0, l=gamestats.length; i < l; i++) {
                    rows += `<tr><td class="gameId">${gamestats[i].gameId}</td><td class="player1">${gamestats[i].player1}</td><td class="player2">${gamestats[i].player2}</td><td>${gamestats[i].result}</td></tr>`;
                }
                $('#stats > tbody').append(rows);
            }
        },
        build_board_table: function(gamestats) {
            let rows = ''

            // clear the table
            $('.gamestats #board > tbody').empty();
			$('#gameResult').empty();

            if (gamestats) {
				$player1.val(gamestats[0].player1);
				$player2.val(gamestats[0].player2);				
				
				if (gamestats[0].result != "Playing") {
					play = false;
					$('#gameResult').html(gamestats[0].result);
				} else {
					play = true;
				}
				
				$('#gameInfo').html('Player1 ' + gamestats[0].player1 + '(X)&emsp;VS&emsp;' + 'Player2 ' + gamestats[0].player2 + '(O)&emsp;<button id="delete" value="' + gamestats[0].gameId + '">Delete</button>');
                for (let i=1; i < 10; i++) {					
					if (jQuery.inArray(i + '', gamestats[0].status.status0)!='-1') {
						var ID = 'spot' + i;
						$('#' + ID).html('X');
					} else if (jQuery.inArray(i + '', gamestats[0].status.status1)!='-1') {
						var ID = 'spot' + i;
						$('#' + ID).html('O');
					} else {
						var ID = 'spot' + i;
						$('#' + ID).html('');
					}					
                }								
            }
        },		
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $player1 = $('#player1'),
        $player2 = $('#player2');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(player1, player2) {
        return player1 !== "" && player2 !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let player1 = $player1.val(),
            player2 = $player2.val();

        e.preventDefault();

        if (validate(player1, player2)) {
            model.create(player1, player2)
        } else {
            alert('Problem with player1 or player2 name input');
        }
    });

    $('#update').click(function(e) {
        let player1 = $player1.val(),
            player2 = $player2.val(),
			gameId = $('#delete').val(),
			result = $('#gameResult').html(),
			status0 = [],
			status1 = [];
			
		if (result == "") {
			result = "Playing"
		}
		
		for (let i=1; i < 10; i++) {
			var ID = 'spot' + i;			
			if ($('#' + ID).html() == "X") {
				status0.push("" + i); 
			}
			
			if ($('#' + ID).html() == "O") {
				status1.push("" + i);				
			}
		}		

        e.preventDefault();

        if (validate(player1, player2)) {
            model.update(gameId, player1, player2, result, status0, status1)
        } else {
            alert('Problem with player1 or player2 name input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })
	
	$('#board').on('click', '#delete', function(){
		model.delete(this.value)
		// clear the table
		$('#board > caption').empty();
		for (let i=1; i < 10; i++) {
			var ID = 'spot' + i;
			$('#' + ID).empty();
		}		
	});

	$('#board > tbody > tr > td').click(function() {
		if ($('#board > caption').text() != "") {
			if ($(this).text()=="" && play) {				
				$(this).html(findNextMove());
				
				if (checkForWinner()!=-1 && checkForWinner()!="") { 
					if (checkForWinner()=="X") { $('#gameResult').html("Player1 wins!"); }
					else { $('#gameResult').html("Player2 wins!"); }
					play = false; 
				} else {
					if (checkForDraw()=="Draw") {
						$('#gameResult').html("Game tied!");
						play = false;
					}
				}
			}			
		}
	});	
	
	function findNextMove() {
		let status0Count = 0,
			status1Count = 0;
		
		for (let i=1; i < 10; i++) {
			var ID = 'spot' + i;
			if ($('#' + ID).html() == "X") {
				status0Count++;
			}
			if ($('#' + ID).html() == "O") {
				status1Count++;
			}			
		}

		if (status0Count == status1Count) {
			return "X";
		} else {
			return "O";
		}
	}
	
	function checkForDraw() {
		for (let i=1; i < 10; i++) {
			var ID = 'spot' + i;
			if ($('#' + ID).html() == "") {
				return "No Draw";
			}
		}
		
		return "Draw";		
	}	
	
	function checkForWinner() {
		var space1 = $("#board tr:nth-child(1) td:nth-child(1)").text();
		var space2 = $("#board tr:nth-child(1) td:nth-child(2)").text();
		var space3 = $("#board tr:nth-child(1) td:nth-child(3)").text();
		var space4 = $("#board tr:nth-child(2) td:nth-child(1)").text();
		var space5 = $("#board tr:nth-child(2) td:nth-child(2)").text();
		var space6 = $("#board tr:nth-child(2) td:nth-child(3)").text();
		var space7 = $("#board tr:nth-child(3) td:nth-child(1)").text();
		var space8 = $("#board tr:nth-child(3) td:nth-child(2)").text();
		var space9 = $("#board tr:nth-child(3) td:nth-child(3)").text();
		// check rows
		if      ((space1==space2) && (space2==space3)) { return space3; }
		else if ((space4==space5) && (space5==space6)) { return space6; }	
		else if ((space7==space8) && (space8==space9)) { return space9; }
		// check columns
		else if ((space1==space4) && (space4==space7)) { return space7; }
		else if ((space2==space5) && (space5==space8)) { return space8; }
		else if ((space3==space6) && (space6==space9)) { return space9; }
		// check diagonals
		else if ((space1==space5) && (space5==space9)) { return space9; }
		else if ((space3==space5) && (space5==space7)) { return space7; }
		// no winner
		return -1;
  }	

    $('#stats > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
		gameId,
		ajax_options;
		
        gameId = $target
            .parent()
            .find('td.gameId')
            .text();
		
		ajax_options = {
            type: 'GET',
            url: 'api/games/' + gameId,
            accepts: 'application/json',
            dataType: 'json'
        }
		
        $.ajax(ajax_options)
        .done(function(data) {
            $event_pump.trigger('model_read_one_success', [data]);
        })
        .fail(function(xhr, textStatus, errorThrown) {
            $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
        })		
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });
	
    $event_pump.on('model_read_one_success', function(e, data) {
        view.build_board_table(data);
    });	

    $event_pump.on('model_create_success', function(e, data) {
		// clear the table
		$('#gameResult').empty();		
		$('#board > caption').empty();
		for (let i=1; i < 10; i++) {
			var ID = 'spot' + i;
			$('#' + ID).empty();
		}		
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
		// clear the table
		$('#gameResult').html("Game updated!");		
		$('#board > caption').empty();
		for (let i=1; i < 10; i++) {
			var ID = 'spot' + i;
			$('#' + ID).empty();
		}		
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
		$('#gameResult').html("Game deleted!");
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));


