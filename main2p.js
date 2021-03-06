//(function() {
  var gameOver = false;
  var timeElapsed = 0;
  var intervalId=0;
  var bW = 0;
  var bH = 0;
  var turn = 0;
  var players = 1;
  var timeP0 = 1*30;
  var timeP1 = 1*30;
  var a;  // Board short-name
  // Choose a tile
  function init(){
    clearInterval(intervalId);
    intervalId=0;
    $("#bombcount").text("10");
    $("#minutes0").text("01:");
    $("#seconds0").text("00");
    $("#minutes1").text("01:");
    $("#seconds1").text("00");
    gameOver=false;
    timeElapsed=0;
    bW = 9;
    bH = 9;
    //a = Board(bH,bW,10);
    for(var i=0;i<bH;i++){
      var r = document.createElement('ul')
      r.id = 'r'+i;
      for(var k = 0; k<bW; k++ ){
        let spot = document.createElement('li')
        spot.id=i+'_'+k;
        //spot.innerHTML = a[i][k];
        spot.innerHTML = '&nbsp;'
        r.appendChild(spot)
      }
      $("#board").append(r);
    }
    $("#board ul li").on("click", spaceClicked);
    $("#board ul li").on("longclick", function(e){
      spaceFlagged(e);
    });
    $(document).on('contextmenu', function(e) {
      if ($(e.target).is("li") ){
        spaceFlagged(e);
       return false;
      }
    });
  }
  function init2PlayerRoom(){


  }
  // count bombs
  var bombCount = function(x,y){
    var bC =0;
      for(var iY=0; iY<y; iY++){
        for(var iX=0; iX<x; iX++){
          if(a[iY][iX]===-1)bC++;
        }
      }
      return bC;
  }
  /*
    Create a mine board given first click can't be a mine
    x: board width
    y: board height
    nb: #of Mines
    cX: first click x
    cY: first click y
  */
  var Board = function(x,y,nb,cX,cY){
    // init struct
    var board=[]
    for(var i=0; i<y; i++)  board[i] = []
    // Randomize Mines
    while(nb>0){
      for(var iY=0; iY<y; iY++){
        for(var iX=0; iX<x; iX++){
          if((iY===cY && iX===cX))  board[iY][iX] = 0;

          else if((Math.round(Math.random()*100)%18)==0 & nb>0){
            if(board[iY][iX]!==-1){
              board[iY][iX]=-1;
              nb--;console.log(nb)
            }
          }
          else if(board[iY][iX] !== -1) board[iY][iX] = 0;
        }
      }
    }
    // Fill in weights
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

  // isInset = style
  var style = function(_r,_c) { return document.getElementById(_r+"_"+_c).style.border==='inset'};
  /**
   * Traverse board mark any connecting 0 weight spaces and the edge integers.
   */
  function markZeros(r,c){
    var uY = 0
    var dY = 0
    var uX = 0
    var dX = 0
    if(r>0) uY=r-1
    else uY = 0
    if(r<bH-1) dY=r+1
    else dY=bH-1
    if(c>0) uX=c-1
    else uX=0
    if(c<bW-1)  dX=c+1
    else dX=bW-1

    // Mark Spot
    if(a[r][c]==0){
        $("#"+r+"_"+c).attr('style', 'border-style:inset')
        $("#"+r+"_"+c).unbind('click')
        $("#"+r+"_"+c).unbind('longclick')
    }

    // Crawl
    if(uY!==r & a[uY][c]===0 & !style(uY, c)){
       markZeros(uY,c) // up
     }
    else if(a[uY][c]!==0){
      console.log("Marking Up Edge", r, c, uY, a[uY][c])
      $("#"+uY+"_"+c).attr('style', 'border-style:inset')
      $("#"+uY+"_"+c).text(a[uY][c]);
      $("#"+uY+"_"+c).unbind('click');
      $("#"+uY+"_"+c).unbind('longclick');
    }
    if(dY!==r & a[dY][c]===0 & !style(dY, c)) {
      markZeros(dY,c) //down
    }
    else if(a[dY][c]!==0){
      console.log("Marking Down Edge", r, c, dY, a[dY][c])
      $("#"+dY+"_"+c).attr('style', 'border-style:inset')
      $("#"+dY+"_"+c).text(a[dY][c]);
      $("#"+dY+"_"+c).unbind('click');
      $("#"+dY+"_"+c).unbind('longclick');
    }
    if(uX!==c & a[r][uX]===0 & !style(r, uX)){
      markZeros(r,uX)  //left
    }
    else if(a[r][uX]!==0){
      console.log("Marking Left Edge", r,c, uX, a[r][uX])
      $("#"+r+"_"+uX).attr('style', 'border-style:inset')
      $("#"+r+"_"+uX).text(a[r][uX]);
      $("#"+r+"_"+uX).unbind('click');
      $("#"+r+"_"+uX).unbind('longclick');
    }
    if(dX!==c & a[r][dX]===0 & !style(r, dX)){
      markZeros(r,dX) //right
    }
    else if(a[r][dX]!==0){
      console.log("Marking Right Edge", r, c, dX, a[r][dX])
      $("#"+r+"_"+dX).attr('style', 'border-style:inset')
      $("#"+r+"_"+dX).text(a[r][dX]);
      $("#"+r+"_"+dX).unbind('click');
      $("#"+r+"_"+dX).unbind('longclick');
    }
    // TODO: add diagnol auto marking
    if(uY!==r & a[uY][uX]===0 & !style(uY, uX)) markZeros(uY,uX)
    else if(a[uY][uX]!==0){
      console.log("Marking UpLeft Edge", r, c, uY, a[uY][uX])
      $("#"+uY+"_"+uX).attr('style', 'border-style:inset')
      $("#"+uY+"_"+uX).text(a[uY][uX]);
      $("#"+uY+"_"+uX).unbind('click');
      $("#"+uY+"_"+uX).unbind('longclick');

    }  // upperleft
    if(dX!==c & a[uY][dX]===0 & !style(uY, dX)) markZeros(uY,dX)
    else if(a[uY][dX]!==0){
      console.log("Marking UpLeft Edge", r, c, uY, a[uY][dX])
      $("#"+uY+"_"+dX).attr('style', 'border-style:inset')
      $("#"+uY+"_"+dX).text(a[uY][dX]);
      $("#"+uY+"_"+dX).unbind('click');
      $("#"+uY+"_"+dX).unbind('longclick');
    }  // upperright
    if(dX!==c & dY!==r & a[dY][dX]===0 & !style(dY, dX)) markZeros(dY,dX) //bottomright
      else if(a[dY][dX]!==0){
      console.log("Marking bottom right Edge", r, c, dY, a[uY][dX])
      $("#"+dY+"_"+dX).attr('style', 'border-style:inset')
      $("#"+dY+"_"+dX).text(a[dY][dX]);
      $("#"+dY+"_"+dX).unbind('click');
      $("#"+dY+"_"+dX).unbind('longclick');
    }
     if(uX!==c & dY!==r & a[dY][uX]===0 & !style(dY, uX)) markZeros(dY,uX) //bottomleft
      else if(a[dY][uX]!==0){
        console.log("Marking bottom left Edge", r, c, dY, a[uY][uX])
        $("#"+dY+"_"+uX).attr('style', 'border-style:inset')
        $("#"+dY+"_"+uX).text(a[dY][uX]);
        $("#"+dY+"_"+uX).unbind('click');
        $("#"+dY+"_"+uX).unbind('longclick');
    }
  }// ----- End Select Click ---- \\



  /**
   *
   */
  function spaceClicked(e){
    var id = e.currentTarget.id;
    var row = id.substring(0,id.indexOf('_'))*1;
    var col = id.slice(id.indexOf('_')+1)*1;

    if(timeElapsed===0 && intervalId<=0) {
      startTimer();
      a = Board(bH,bW,10, col, row);
    }
    $(e.currentTarget).attr('style', 'border-style:inset');
    // Unbind events (context menu still there) need to use mouse down
    $(e.currentTarget).unbind('click');
    $(e.currentTarget).unbind('longclick');
    console.log('clicked', id)
    // get row/col from id

    console.log(row,col)
    if(a[row][col]===0){  // Mark all connecting Open spaces
      markZeros(row,col)  // And show the bordering weights
    }
    else if(a[row][col]===-1){        // Lose
      gameOver=true;
      clearInterval(intervalId);  intevalId=0;
      $(e.currentTarget).text("*")
      $(e.currentTarget).attr('style','background-color:#B22222')

      for(var i = 0; i<bH; i++){
        for(var k = 0; k<bW; k++){
          $("#"+i+"_"+k).unbind('click');
          $("#"+i+"_"+k).unbind('longclick');
          if(a[i][k]===-1){
            $("#"+i+"_"+k).attr('style','background-color:#B22222')
            $("#"+i+"_"+k).text("*")
          }
        }
      }
      showWinner(turn);
    }
    else{    // Valid Move
      $(e.currentTarget).text(a[row][col]);
    }
    var remainingTiles=0;
    // Check number of tiles left that arent flagged
    for(var i=0; i<bH; i++){
      for(var k=0; k<bW; k++){
        if(!style(i,k) && (a[i][k]!==-1) )
          remainingTiles++;
      }
    }
    if(remainingTiles===0){
      clearInterval(intervalId);
      alert("You Win!")
    }
    console.log("tiles", remainingTiles)
    turn=turn==1?0:1;
    console.log('turn', turn)
  }
  // Flag a tile
  function spaceFlagged(e){
    const id = e.target.id;
    // get row/col from id
    const row = id.substring(0,id.indexOf('_'))*1
    const col = id.slice(id.indexOf('_')+1)*1
    if(!style(row,col) && !gameOver){
      //var remMinesLabel = $("#bombcount");
      //var remMines = remMinesLabel.text()*1;
      if($(e.target).css('background-color')==='rgb(211, 211, 211)'){
        $(e.target).attr('style', 'background-color:#ECD503');
        //$(remMinesLabel).text(--remMines);
      }
      else{
        $(e.target).attr('style', 'background-color:#D3D3D3');
      //  $(remMinesLabel).text(++remMines);
      }
    }
  }
  function startTimer(){
    var minutes=$("[id^=minutes]")
    var seconds=$("[id^=seconds]")
    intervalId = setInterval(function(){
      if(turn===0){timeElapsed=--timeP0}
      else {timeElapsed=--timeP1}
      console.log(timeElapsed + "#seconds"+turn + "")
      let m = Math.floor((timeElapsed)/60);
      let s = timeElapsed-m*60;
      $(minutes[turn]).text(m > 9 ? "" + m + ":": "0" + m + ":");
      $(seconds[turn]).text(s > 9 ? "" + s: "0" + s);
    },1000);
  }
  function showWinner(winner){
    $("#winPopup").attr('style', 'display:block');
    $("#winPopup").html("<span>Player " + (winner+1) + "Loses!</span>");
    $("#winPopup span").on('click', (e)=> $("#winPopup").attr('style', 'display:none'));
  }
  // TODO: Network turns/state
 // console.log(bombCount(bH,bW))
  var host = location.origin.replace(/^http/, 'ws')
  var ws = new WebSocket(host);
/*  ws.onmessage = function (event) {
    var li = document.createElement('li');
    li.innerHTML = JSON.parse(event.data);
    document.querySelector('#pings').appendChild(li);
  };
  */
  // Build Board UI
  $(function(){
/*    $('#new_game').on('click', ()=>{
      $("#board ul li").unbind('click');
      $(document).unbind('contextmenu');
      $("#board").html("");
      init();
    });
    */
    $("#addPlayer").html('Share this link to play a friend: <span>' + window.location + '</span>');
    init();
  });
//})();
