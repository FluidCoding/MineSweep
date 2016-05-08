//(function() {
  var bW = 0;
  var bH = 0;
  function init(){
    bW = 10;
    bH = 10;
  }
init()
  var bombCount = function(x,y){
    var bC =0;
      for(var iY=0; iY<y; iY++){
        for(var iX=0; iX<x; iX++){
          if(a[iY][iX]===-1)bC++;
        }
      }
      return bC;
  }
  var Board = function(x,y,nb){
    var board=[]
    for(var i=0; i<y; i++)  board[i] = []

    while(nb>0){
      for(var iY=0; iY<y; iY++){
        for(var iX=0; iX<x; iX++){
          if((Math.round(Math.random()*100)%18)==0 & nb>0){
            if(board[iY][iX]!==-1){board[iY][iX]=-1;nb--;console.log(nb)}
          }
          else if(board[iY][iX] !== -1) board[iY][iX] = 0;
        }
      }
    }

    for(var iY=0; iY<y; iY++){
      for(var iX=0; iX<x; iX++){
        if(board[iY][iX]==-1){
          if(iY>0){
            if(board[iY-1][iX]!==-1)  board[iY-1][iX]++;  // up
            if(iX>0){
              if(board[iY-1][iX-1]!==-1) board[iY-1][iX-1]++; //upperleft
              if(board[iY][iX-1]!==-1)  board[iY][iX-1]++;  // left
            }
            if(iX<x-1){
              if(board[iY-1][iX+1]!==-1)  board[iY-1][iX+1]++;  // upperright
              if(board[iY][iX+1]!==-1) board[iY][iX+1]++; //right

              if(iY<y-1){
                if(board[iY+1][iX+1]!==-1)  board[iY+1][iX+1]++;  //bottomright
              }
            }
            if(iY<y-1){
              if(board[iY+1][iX-1]!==-1)  board[iY+1][iX-1]++;  //bottomleft
            }
          }
          else{
              if(iX>0){
                if(board[iY][iX-1]!==-1)  board[iY][iX-1]++;  // left
                if(iY<y-1){
                  if(board[iY+1][iX-1]!==-1)  board[iY+1][iX-1]++;  //bottomleft
                }
              }
              if(iX<x-1){
                if(board[iY][iX+1]!==-1) board[iY][iX+1]++; //right

                if(iY<y-1){
                  if(board[iY+1][iX+1]!==-1)  board[iY+1][iX+1]++;  //bottomright
                }
              }
          }
          if(iY<y-1){
            if(board[iY+1][iX]!==-1)  board[iY+1][iX]++;  //down
          }
        }
      }
    }
    return board;
  }
  var a = Board(bH,bW,9);
  function spaceClicked(e){console.log(e)
    $(e.currentTarget).attr('style', 'border-style:inset');
    $(e.currentTarget).text(a[0][2])
  }
  function spaceFlagged(e){console.log($(e.target).css('background-color'))
    if($(e.target).css('background-color')==='rgb(211, 211, 211)')
      $(e.target).attr('style', 'background-color:#B22222');
    else
      $(e.target).attr('style', 'background-color:#D3D3D3');
  }
  console.log(bombCount(bH,bW))

        var host = location.origin.replace(/^http/, 'ws')
        var ws = new WebSocket(host);
        ws.onmessage = function (event) {
        var li = document.createElement('li');
        li.innerHTML = JSON.parse(event.data);
        document.querySelector('#pings').appendChild(li);
      };
  $(function(){
    for(var i=0;i<bH;i++){
      var r = document.createElement('ul')
      r.id = 'r'+bH;

      for(var k = 0; k<bW; k++ ){
        let spot = document.createElement('li')
        spot.id='c'+bW;
        spot.innerHTML = a[i][k];
        r.appendChild(spot)
      }
      $("#board").append(r);
    }
    $("#board ul li").on("click", spaceClicked);
    $(document).on('contextmenu', function(e) {
    if ($(e.target).is("li") ){
        spaceFlagged(e);
       return false;
     }
    });
  });
//})();
