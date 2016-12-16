'use strict';

/**
 * @ngdoc function
 * @name ticTacToeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ticTacToeApp
 */
angular.module('ticTacToeApp')
  .controller('MainCtrl', function ($scope) {
    var current_player=1;
    var choice;
    var nodes_count;
    var d = new Date();
    $scope.toggleValue = 0;
  	$scope.ImgUrl = [];
    var board=[0,0,0,0,0,0,0,0,0];

    $scope.status = false;
    $scope.changeStatus = function(){
      $scope.status = !$scope.status;
    };


    // init board
    for (var k = 0; k <= 8; k++) {
    	$scope.ImgUrl[k]="images/blanc.png";
    }


    // check box
    $scope.check_box=function(pos){
      if(winner(board) === 3){
      if (board[pos] === 0){
        if (current_player === 1){
          $scope.ImgUrl[pos]="images/x.png";
          board[pos]=change_turn();
          check_winner();
          computer_play();

        }else if (current_player === 2){
          $scope.ImgUrl[pos]="images/o.png";
          board[pos]=change_turn();
          check_winner();

        }
      }
      }

    };

    var computer_play = function(){
      nodes_count = 0;
      if ($scope.status === true) alphabeta(board,0,-Infinity,+Infinity);
      else minmax(board,0);
      $scope.check_box(choice);
      $scope.nodes=nodes_count;
      choice = [];
    };


    // minmax
    var minmax = function(game, height){
      if (winner(game) !== 3) return score(game,height);

      height ++;
      var scores = [];
      var moves = [];
      var move , possible_game , min_score_index, max_score_index;
      var available_moves = possible_moves(game);

      // loop on available moves
      for (var i =0;i<available_moves.length;i++){
        nodes_count ++;
        move = available_moves[i];
        possible_game = get_new_state(game,move);
        scores.push(minmax(possible_game,height));
        moves.push(move);
        game=undo_move(game,move);
      }

      // min then max calculation according to player
      if (current_player === 1){
        min_score_index = scores.indexOf(Math.min.apply(Math,scores));
        choice = moves[min_score_index];
        return scores[min_score_index];

      }else {
        max_score_index = scores.indexOf(Math.max.apply(Math,scores));
        choice = moves[max_score_index];
        return scores[max_score_index];
      }

    };

    // minmax with alfaBeta
    var alphabeta = function(game, height, alpha, beta) {
      if (winner(game) !== 3) return score(game,height);

      height ++;
      var available_moves = possible_moves(game);
      var move, result, possible_game;

      if (current_player === 2) {
        for (var i = 0; i < available_moves.length; i++) {
          nodes_count ++;
          move = available_moves[i];
          possible_game = get_new_state(game, move);
          result = alphabeta(possible_game, height, alpha, beta);
          game = undo_move(game, move);
          if (result > alpha) {
            alpha = result;
            if (height === 1)
              choice = move;
          } else if (alpha >= beta) {
            return alpha;
          }
        }
        return alpha;
      } else {
        for (var i = 0; i < available_moves.length; i++) {
          nodes_count ++;
          move = available_moves[i];
          possible_game = get_new_state(game, move);
          result = alphabeta(possible_game, height, alpha, beta);
          game = undo_move(game, move);

          if (result < beta) {
            beta = result;
            if (height === 1)
              choice = move;
          } else if (beta <= alpha) {
            return beta;
          }
        }
        return beta;
      }
    };



    // 1 human won
    // 2 computer won
    // 3 still no winner
    // 0 draw game
    var winner = function(game){

      // Check for horizontal win
      for(var i=0 ; i<9;i+=3){
        if(game[i] === 1 && game[i+1] === 1 &&game[i+2] === 1) return 1;
        else if (game[i] === 2 && game[i+1] === 2 &&game[i+2] === 2) return 2;
      }

      // Check for vertical win
      for(i=0 ; i<9 ; i++){
        if(game[i] === 1 && game[i+3] === 1 &&game[i+6] === 1) return 1;
        else if (game[i] === 2 && game[i+3] === 2 &&game[i+6] === 2) return 2;
      }

      // Check for diagonal win
      if(game[0] === 1 && game[4] === 1 && game[8] === 1) return 1;
      else if(game[0] === 2 && game[4] === 2 && game[8] === 2) return 2;
      else if(game[2] === 1 && game[4] === 1 && game[6] === 1) return 1;
      else if(game[2] === 2 && game[4] === 2 && game[6] === 2) return 2;

      // still no winner
      for (i = 0; i < 9; i++)
      {
        if (game[i] === 0)
          return 3;
      }

      // draw
      return 0;
    };

    var score = function(game,height){
      if (winner(game) === 1) return height - 10;
      else if (winner(game) === 2) return 10 - height;
      else return 0;
    };

    var possible_moves = function (game) {
      var possible_moves = [];
      for (var i = 0;i < 9; i++){
        if(game[i] === 0){
          possible_moves.push(i);
        }
      }
      return possible_moves;

    };

    var change_turn=function () {
      if (current_player === 1)
      {
        current_player = 2;
        return 1;
      }
      else if (current_player === 2) {
        current_player = 1;
        return 2;
      }
    };

    var get_new_state = function (game,move) {
      game[move] = change_turn();
      return game;
    };

    var undo_move = function (game, move) {
      game[move] = 0;
      change_turn();
      return game;
    };

    // show winner on scrren
    var check_winner = function(){
      if(winner(board) === 1) $scope.winner = "You won";
      else if (winner(board) === 2) $scope.winner ="Computer won";
      else if (winner(board) === 0) $scope.winner ="Draw";
    };



  });
