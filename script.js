var idnum = 0
var moves = [0,1,0,1,0,1,0,1,0,1]
var prelimBufferLength = moves.length
var bufferLength = 10

var redPayout0 = 0
var redPayout100 = 6
var bluePayout0 = 4
var bluePayout100 = 10
var numMoves = 100
var payouts = []


function processButton(color){
	
	var score = calcScore(color);
	payouts.push(score);
	drawScore(score, color);
	idnum++
	makeNextInput(color);

	if (idnum == numMoves){

	    finishUp()
	}
}
	
	
function processMove(event){
    if (event.keyCode == 13) {
	document.getElementById("move".concat(idnum.toString())).readOnly = true;
	var tbv = document.getElementById("move".concat(idnum)).value;
	var score = calcScore(tbv);
	payouts.push(score);
	var color = calcColor(tbv);
	drawScore(score, color);
	idnum++

	if (idnum <= numMoves){
	makeNextInput();

	    document.getElementById("move".concat(idnum.toString())).select();
	} else {
	    finishUp()
	}
    }
}

function makeNextInput(color){
    var para = document.createElement("P");
    var t = document.createTextNode("Move #" + idnum.toString() +": " + color);
    para.appendChild(t)
   
    
    document.getElementById("maindiv").appendChild(para);
}

function drawScore(score, color){
    var width = 100;
    var c = document.getElementById("rewardChart");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 400, 400);
    ctx.beginPath();
    ctx.lineWidth="10";
    ctx.fillStyle = color;
    ctx.rect(50,400 - 20 * score,width,20 * score);
    ctx.fill();
}

function calcScore(current){
    if (current == "red"){
	moves.push(1)
    } else if (current == "blue") {
	moves.push(0)
    }
    buffer = getBuffer(moves, bufferLength)
    sumRed = buffer.reduce(function(a, b) { return a + b; }, 0);
    fracRed = sumRed / buffer.length
    redPayout = fracRed * redPayout100 + (1 - fracRed) * redPayout0
    bluePayout = fracRed * bluePayout100 + (1 - fracRed) * bluePayout0
    noise = Math.random() - .5;
    if (current == "red"){
	return Math.max(redPayout + noise, 0);
    } else if (current == "blue") {
	return Math.max(bluePayout + noise, 0);
    } else {
	return 0;
    }
}

function calcColor(current){
    if (current == "r"){
	color = "red";
    } else if (current == "b") {
	color = "blue";
    }
    return color
}

function getBuffer(moves, bufferLength){
    if (moves.length < bufferLength) {
	start = 0;
    } else {
	start = moves.length - bufferLength;
    }
    buffer = moves.slice(start);
    return buffer;
}

function finishUp(){
    alert("We are done. You will now save a file of your results. Please upload to Canvas, and we will discuss in class.");
    nickname = document.getElementById("nickname").value;
    var ownMoves = moves.slice(prelimBufferLength);
    var csvString = nickname + "_moves," + nickname + "_payouts" + "\n";
    for (i = 0; i < ownMoves.length; i++) { 
	csvString += ownMoves[i] + "," + payouts[i] + "\n";
    }
    var a         = document.createElement('a');
    a.href        = 'data:attachment/csv,' +  encodeURIComponent(csvString);
    a.target      = '_blank';
    a.download    = 'abe_demo_'.concat(nickname).concat('.csv');
    document.body.appendChild(a);
    a.click();
}