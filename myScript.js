var xCoordinates=[];
var yCoordinates=[];
var length_coordinates = 0;
var index = 0;

var k=0;
var radian=0;
var coneLength=50;

var canvasCopies = ["copyCanvas1", "copyCanvas2", "copyCanvas3"]

var connectionTable = [];

function myFunction(){
    document.getElementById("demo").innerHTML="我的第一个 JavaScript 函数";
}

function saveCanvas(index){
    var c=document.getElementById("myCanvas");
    var copyCanvas=document.getElementById(canvasCopies[index]);
    copyCanvasCtx = copyCanvas.getContext('2d');
    copyCanvasCtx.drawImage(c, 0, 0);
}

function readCanvas(index){
    var c=document.getElementById("myCanvas");
    var copyCanvas=document.getElementById(canvasCopies[index]);
    var ctx=c.getContext("2d");
    ctx.beginPath();
    ctx.drawImage(copyCanvas, 0, 0);
}

function clearCanvas(){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
}

function drawLine(start,end){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(start[0],start[1]);
    ctx.lineTo(end[0],end[1]);
    ctx.stroke();
}

function drawCircle(x,y){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.fillStyle="#FF0000";
    ctx.beginPath();
    ctx.arc(x,y,15,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

function addPoints(){
    xCoordinates.push(Math.floor(Math.random() * 471) + 15);
    yCoordinates.push(Math.floor(Math.random() * 471) + 15);
    length_coordinates++;
    drawCircle(xCoordinates[length_coordinates-1],yCoordinates[length_coordinates-1]);
}

function drawCone(xLocation, yLocation) {
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    var x,y;
    ctx.beginPath();
    for (let i = 0; i < k; i++){
        x = xLocation + coneLength * Math.cos(radian * i);
        y = yLocation + coneLength * Math.sin(radian * i);
        ctx.moveTo(xLocation,yLocation);
        ctx.lineTo(x,y);
    }
    ctx.stroke();
}

function connectLines(xLocation, yLocation){
    console.log("connectLines");
    var selectedPoints = [];
    for (let i = 0; i < k; i++){
        console.log("In cone: "+String(i));
        console.log("Cone edges at degree: ", radian*i, "to", radian*(i+1));
        let candidates = [];
        let minProjDist = 10000;
        let selectedPoint = [0,0];
        for (let j = 0; j < length_coordinates; j++){
            var x = xCoordinates[j];
            var y = yCoordinates[j];
            if (x == xLocation){continue;}
            angle = Math.atan(((500 - y) - (500 - yLocation)) / (x - xLocation));
            if (x < xLocation){
                if ((500 - y) > (500 - yLocation)){
                    angle = Math.PI - (-angle);
                } else{
                    angle = Math.PI + angle;
                }
            } else {
                if ((500 - y) < (500 - yLocation)){
                    angle = 2*Math.PI - (-angle);
                }
            }
            console.log("Finding points in cone current point: ",x , y, angle );
            if ((angle > radian*i && angle < radian*(i+1)) || (angle > radian*i+2*Math.PI) && (angle < radian*(i+1)+2*Math.PI)){
                console.log("Found inside cone!!");
                var a = [x,y];
                candidates.push(a);
            }
        }
        console.log(candidates);
        for (let j = 0; j < candidates.length; j++){
            angle = Math.atan(((500 - candidates[j][1])-(500 - yLocation)) / (candidates[j][0]-xLocation));
            projDist = Math.abs(Math.cos(angle-radian*(i+0.5))) * Math.sqrt((candidates[j][0]-xLocation)**2 + ((500 - candidates[j][1]) - (500 - yLocation))**2);
            console.log("Finding candidate in candidates", angle, projDist);
            if (projDist<minProjDist){
                console.log("Found point to connect!!");
                minProjDist = projDist;
                selectedPoint = [candidates[j][0],candidates[j][1]]
            }
        }
        selectedPoints.push(selectedPoint);
        console.log("push points, x: "+String(selectedPoint[0])+",y: "+String(selectedPoint[1]));
    }
    console.log(selectedPoints);
    for (let i = 0; i < selectedPoints.length; i++){
        if (selectedPoints[i][0] == 0 && selectedPoints[i][1] == 0){continue;}
        // console.log("Drawing: ", selectedPoints[i]);
        // let a = [selectedPoints[i][0],selectedPoints[i][1]];
        // let b = [xLocation, yLocation];
        // let newConnection = [a,b];
        // connectionTable.push(newConnection);
        console.log("Connection table: ", connectionTable);
        drawLine([xLocation,yLocation],selectedPoints[i]);
    }
}


function getDegree(){
    btn = document.getElementById("confirm").style.display = "block";
    k = document.getElementById("k").value; // get k
    console.log(k);
    radian = 360 / k; // calculate degree by k
    radian *= Math.PI / 180; // dgree to radian
}

function connectNextPoint(){
    if (document.querySelector('#nextBtn').textContent == "Move to next cones"){
        document.querySelector('#nextBtn').textContent = "Connect the points";
        if (index == 0){saveCanvas(0);}
        clearCanvas()
        readCanvas(0);
        if (index <= coneLength){
            drawCone(xCoordinates[index],yCoordinates[index]);
        }
        

    } else{
        document.querySelector('#nextBtn').textContent = "Move to next cones";
        clearCanvas()
        readCanvas(0);
        connectLines(xCoordinates[index],yCoordinates[index]);
        saveCanvas(0);
        drawCone(xCoordinates[index],yCoordinates[index]);
        connectLines(xCoordinates[index],yCoordinates[index]);
        index++;

    }
    
}
