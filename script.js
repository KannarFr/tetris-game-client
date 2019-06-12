var canvas1 = document.getElementById('canvas1');
var canvas2 = document.getElementById('canvas2');
var ctx1 = canvas1.getContext('2d');
var ctx2 = canvas2.getContext('2d');

fetch("http://localhost:9000/match", {
  method: 'POST',
  mode: 'cors',
  cache: 'default',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'playersId': ['player_edfebb2b-1bfc-44da-a1fc-2dfd7803f3e9', 'player_fff2f0a0-33cf-4f8b-b90d-f5161dd16ef2'],
    'size': {'width': 12, 'height': 50}
  })
})
  .then(function(response) {
    console.log(response)
    return response.json();
  })
  .then(function(data) {
    console.log(data)
    var socket = null;
    try {
      socket = new WebSocket("ws://localhost:9000/matches/" + data + "/ws");
    } catch (exception) {
      console.error(exception);
    }
    socket.onerror = function(error) {
      console.error(error);
    };
  
    socket.onopen = function(event) {
      console.log("Connexion établie.");
      function rotateLeftR1() {
        socket.send(JSON.stringify({
          'playerId': 'player_fff2f0a0-33cf-4f8b-b90d-f5161dd16ef2',
          'action': 'rotateLeft'
        }))
      }

      function rotateLeftR2() {
        socket.send(JSON.stringify({
          'playerId': 'player_edfebb2b-1bfc-44da-a1fc-2dfd7803f3e9',
          'action': 'rotateLeft'
        }))
      }

      setInterval(rotateLeftR1, 300);
      setInterval(rotateLeftR2, 300)
    };

    socket.onclose = function(event) {
      console.log("Connexion terminée.");
    };
    socket.onmessage = function(event) {
      let boards = JSON.parse(event.data);
      boards.map(function(board, index) {
        if (index == 0) {
          clear(ctx1);
        }
        if (index == 1) {
          clear(ctx2);
        }
        let player = board[0];
        let playerBoard = board[1];
        playerBoard.map(function(block) {
          if (index == 0) {
            drawBlock(ctx1, block.x, block.y, block.color);
          }
          if (index == 1) {
            drawBlock(ctx2, block.x, block.y, block.color);
          }
          
        })
      })
    };
  });

var W = 200, H = 800;
var COLS = 12;
var ROWS = 50;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

function clear(canvasContext) {
  canvasContext.clearRect(0, 0, canvas1.width, canvas1.height);
}

function drawBlock(canvasContext, x, y, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  canvasContext.strokeStyle = "red";
  canvasContext.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}
