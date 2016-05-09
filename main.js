//(function() {
  var gameOver = false;
  var timeElapsed = 0;
  var intervalId=0;
  var bW = 0;
  var bH = 0;
  var a;  // Board short-name
  // Choose a tile
  function init(){
    gameOver=false;
    timeElapsed=0;
    bW = 10;
    bH = 10;
    a = Board(bH,bW,9);
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
  // Make Board
  var Board = function(x,y,nb){
    // init struct
    var board=[]
    for(var i=0; i<y; i++)  board[i] = []
    // Randomize Mines
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
    if(r>0){
      uY=r-1
    }
    else{
      uY = 0
    }
    if(r<bH-1){
      dY=r+1
    }
    else{
      dY=bH-1
    }
    if(c>0){
      uX=c-1
    }
    else{
      uX=0
    }
    if(c<bW-1){
      dX=c+1
    }
    else{
      dX=bW-1
    }


    if(a[r][c]==0){
        $("#"+r+"_"+c).attr('style', 'border-style:inset')
        $("#"+r+"_"+c).unbind('click')
        $("#"+r+"_"+c).unbind('longclick')
    }

    console.log("rc", r,c)
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
  }
  function spaceClicked(e){
    if(timeElapsed===0) startTimer();
    $(e.currentTarget).attr('style', 'border-style:inset');
    // Unbind events (context menu still there) need to use mouse down
    $(e.currentTarget).unbind('click');
    $(e.currentTarget).unbind('longclick');
    var id = e.currentTarget.id;
    console.log(id)
    // get row/col from id
    var row = id.substring(0,id.indexOf('_'))*1
    var col = id.slice(id.indexOf('_')+1)*1
    console.log(row,col)
    if(a[row][col]===0){  // Mark all connecting Open spaces
      markZeros(row,col)  // And show the bordering weights
    }
    else if(a[row][col]===-1){        // Lose
      gameOver=true;
      clearInterval(intervalId);
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
    }
    else    // Valid Move
      $(e.currentTarget).text(a[row][col]);
  }
  // Flag a tile
  function spaceFlagged(e){console.log($(e.target).css('background-color'))
    var id = e.target.id;
    // get row/col from id
    var row = id.substring(0,id.indexOf('_'))*1
    var col = id.slice(id.indexOf('_')+1)*1
    if(!style(row,col) && !gameOver){
    if($(e.target).css('background-color')==='rgb(211, 211, 211)')
      $(e.target).attr('style', 'background-color:#ECD503');
    else
      $(e.target).attr('style', 'background-color:#D3D3D3');
    }
  }
  function startTimer(){
    var hours=$("#hours");
    var minutes=$("#minutes");
    var seconds=$("#seconds");
    intervalId = setInterval(function(){
      timeElapsed++;
      let h = Math.floor(timeElapsed / 3600);
      let m = Math.floor((timeElapsed-(h*3600))/60);
      let s = timeElapsed-h*3600-m*60;
      if(h!==0) $(hours).text(h > 9 ? "" + h + ":" : "0" + h + ":");
      if(m!==0) $(minutes).text(m > 9 ? "" + m + ":": "0" + m + ":");
      $(seconds).text(s > 9 ? "" + s: "0" + s);      
    },1000);
  }
  // TODO: Network turns/state
  console.log(bombCount(bH,bW))
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
    $('#new_game').on('click', ()=>{
      clearInterval(intervalId);
      $("#board ul li").unbind('click');
      $(document).unbind('contextmenu');
      $("#board").html("");
      init(); 
    });
    init();
  });
//})();
