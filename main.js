//(function() {
  var bW = 0;
  var bH = 0;
  function init(){
    bW = 10;
    bH = 10;
  }
init()
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
  var style = function(_r,_c) { return document.getElementById(_r+"_"+_c).style.border==='inset'};
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
        $("#"+r+"_"+c).on('click', null)
    }

    console.log("rc", r,c)
    if(uY!==r & a[uY][c]===0 & !style(uY, c)){
       markZeros(uY,c) // up
     }
    else if(a[uY][c]!==0){
      console.log("Marking Up Edge", r, c, uY, a[uY][c])
      $("#"+uY+"_"+c).attr('style', 'border-style:inset')
      $("#"+uY+"_"+c).text(a[uY][c]);
      $("#"+uY+"_"+c).on('click', null)
    }
    if(dY!==r & a[dY][c]===0 & !style(dY, c)) {
      markZeros(dY,c) //down
    }
    else if(a[dY][c]!==0){
      console.log("Marking Down Edge", r, c, dY, a[dY][c])
      $("#"+dY+"_"+c).attr('style', 'border-style:inset')
      $("#"+dY+"_"+c).text(a[dY][c]);
      $("#"+dY+"_"+c).on('click', null)
    }
    if(uX!==c & a[r][uX]===0 & !style(r, uX)){
      markZeros(r,uX)  //left
    }
    else if(a[r][uX]!==0){
      console.log("Marking Left Edge", r,c, uX, a[r][uX])
      $("#"+r+"_"+uX).attr('style', 'border-style:inset')
      $("#"+r+"_"+uX).text(a[r][uX]);
      $("#"+r+"_"+uX).on('click', null)
    }
    if(dX!==c & a[r][dX]===0 & !style(r, dX)){
      markZeros(r,dX) //right
    }
    else if(a[r][dX]!==0){
      console.log("Marking Right Edge", r, c, dX, a[r][dX])
      $("#"+r+"_"+dX).attr('style', 'border-style:inset')
      $("#"+r+"_"+dX).text(a[r][dX]);
      $("#"+r+"_"+dX).on('click', null)
    }
// TODO: add diagnol auto marking
//    if(uY!==r & a[uY][uX]===0 & !style(uY, uX)) markZeros(uY,uX)  // upperleft
//    if(dX!==c & dY!==r & a[dY][dX]===0 & !style(dY, dX)) markZeros(dY,dX) //bottomright
  //  if(uX!==c & dY!==r & a[dY][uX]===0 & !style(dY, uX)) markZeros(dY,dX) //bottomleft

  }
  var a = Board(bH,bW,9);
  function spaceClicked(e){console.log(e)
    $(e.currentTarget).attr('style', 'border-style:inset');
    var id = e.currentTarget.id;
    console.log(id)
    var row = id.substring(0,id.indexOf('_'))*1
    var col = id.slice(id.indexOf('_')+1)*1
    console.log(row,col)
    if(a[row][col]===0){
      markZeros(row,col)
    }
    else if(a[row][col]===-1){
        $(e.currentTarget).text("*")
        $(e.currentTarget).attr('style','background-color:#B22222')
    }
    else
      $(e.currentTarget).text(a[row][col]);
  }
  function spaceFlagged(e){console.log($(e.target).css('background-color'))
    if($(e.target).css('background-color')==='rgb(211, 211, 211)')
      $(e.target).attr('style', 'background-color:#ECD503');
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
  });
//})();
