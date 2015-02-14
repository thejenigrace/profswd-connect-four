// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

var MAX_ROWS = 6;
var columns = [[], [], [], [], [], [], []];
var tokens;
var playing;
var currentPlayer;

$(document).ready(function() {
    initialize();

    $("#game_board td").click(function() {
        var col = $(this).index();
        var row = $(this).closest("tr").index();
        console.log("col = " + col + "; row = " + row);

        if(playing == true) {
            console.log("currentPlayer = " + currentPlayer);
            addTokenOnBoard(col,row);
            displayStatus();
        }
    });

    $("#new_game").click(function() {
        initialize();
        removeAllTokensFromGameBoard();
    });
});

var displayStatus = function() {
    var strPlayer = currentPlayer == "player1" ? "Player 1" : "Player 2";

    $("#turn").text("Turn Finished: " + strPlayer).show();

    if(currentPlayer == "player1")
        $("#token").css("background-color", "lightseagreen").show();
    else
        $("#token").css("background-color", "slateblue").show();
};

var initialize = function(newgame) {
    columns = [[], [], [], [], [], [], []];
    tokens = 0;
    playing = true;
    currentPlayer = "player1";

    $("#turn").hide();
    $("#winner").hide();
    $("#token").hide();
    //var strPlayer = currentPlayer == "player1" ? "Player 1" : "Player 2";
    //
    //$("#turn").text("Turn Finished: " + strPlayer).show();
    //$("#token").css("background-color", "lightseagreen");
};

var addTokenOnBoard = function(col,row) {
    console.log("Add Token On Board");

    var columnCapacity = columns[col].length;
    console.log("columnCapacity = " + columnCapacity);

    if(columnCapacity >= MAX_ROWS)
        return false;

    //else
    tokens++;
    console.log("tokens = " + tokens);
    var playerMark = tokens % 2;
    console.log("playerMark = " + playerMark);
    columns[col].push(playerMark);

    changePlayer(col, columnCapacity);

    if(isWinner(playerMark, col, columnCapacity)) {
        playing = false;
        $("#turn").hide();

        var strPlayer = currentPlayer == "player1" ? "Player 1" : "Player 2";
        $("#winner").text("Winner: " + strPlayer).show();

        if(currentPlayer == "player1")
            $("#token").css("background-color", "lightseagreen");
        else
            $("#token").css("background-color", "slateblue");

        alert("Winner: " + strPlayer);
    }

    if(playing && columns[col].length === MAX_ROWS)
        isDraw();

    return true;
};

var isWinner = function(playerMark, col, row) {
    if(!checkMarkedTokenPosition(playerMark, col, row))
        return false;

    //else
    var direction = [
        [1,0], //east to west
        [1,1], //northeast to southwest
        [0,1], //north to south
        [1,-1] //southeast to northwest
    ];
    var matches = 0;
    for(var i = 0; i < 4; i++) {
        for(var j = 1; ; j++)
            if(checkMarkedTokenPosition(playerMark, col + j * direction[i][0], row + j * direction[i][1]))
                matches++;
            else
                break;
        for(var j = 1; ; j++)
            if(checkMarkedTokenPosition(playerMark, col - j * direction[i][0], row - j * direction[i][1]))
                matches++;
            else
                break;
        if(matches >= 3)
            return true;
        matches = 0;
    }
    return false;
};

var isDraw = function() {
    for(var i = 0; i < columns.length; i++)
        if(columns[i].length < MAX_ROWS)
            return;

    playing = false;
    alert("DRAW!");
    $("#winner").text("DRAW!").show();
};

var checkMarkedTokenPosition = function(playerMark, col, row) {
    //console.log("Check Marked Token Position");

    if((col < 0) || (col > 6))
        return false;
    if((row < 0) || (row > MAX_ROWS - 1))
        return false;
    if(columns[col].length < (row + 1))
        return false;

    return (columns[col][row] === playerMark);
};

var changePlayer = function(col, columnCapacity) {
    console.log("Change Player");

    $(getCellQuery(col, MAX_ROWS - 1 - columnCapacity)).addClass(changePlayerToken());

    currentPlayer = changePlayerToken();
};

var changePlayerToken = function() {
    console.log("Change Player Token")

    if (tokens % 2 == 0) {
        return "player2";
    } else {
        return "player1";
    }
};

var getCellQuery = function(col, row) {
    console.log("Get Cell Query");

    return $("#game_board")[0].rows[row].cells[col];
};

var removeAllTokensFromGameBoard = function() {
    for (var col = 0; col < 7; col++)
        for (var row = 0; row < 6; row++)
            $(getCellQuery(col, row)).removeClass();
};
