var xCoordinates=[];
var yCoordinates=[];

var length_coordinates = 0;
var index = 0;

var k=0;
var radian=0;
var coneLength=100;

var canvasCopies = ["copyCanvas1", "copyCanvas2", "copyCanvas3"]

var connectionTable = [];

var kConfirm = false;

var showProj = true;

var canvas = document.getElementById("myCanvas");

canvas.addEventListener("mousedown", function(event) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    var x = parseFloat(((event.clientX - rect.left + Math.random() - 0.5) * scaleX).toFixed(2));
    var y = parseFloat(((event.clientY - rect.top + Math.random() - 0.5) * scaleY).toFixed(2));
    console.log("Add x, y: ", x, y); 

    xCoordinates.push(x);
    yCoordinates.push(y);
    length_coordinates++;
    drawCircle(xCoordinates[length_coordinates-1],yCoordinates[length_coordinates-1]);
    displayPoints();
});

function myFunction(){
    document.getElementById("demo").innerHTML="我的第一个 JavaScript 函数";
}

function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}

function saveCanvas(index){
    var c=document.getElementById("myCanvas");
    var copyCanvas=document.getElementById(canvasCopies[index]);
    copyCanvasCtx = copyCanvas.getContext('2d');
    copyCanvasCtx.clearRect(0, 0, c.width, c.height);
    copyCanvasCtx.drawImage(c, 0, 0);
}

function readCanvas(index){
    var c=document.getElementById("myCanvas");
    var copyCanvas=document.getElementById(canvasCopies[index]);
    var ctx=c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.drawImage(copyCanvas, 0, 0);
}

function clearCanvas(){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
}

function drawLine(start, end, color, dashed){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.beginPath();
    if (dashed){
        ctx.setLineDash([5, 3]);
    } else{
        ctx.setLineDash([]);
    }
    ctx.strokeStyle = color;
    ctx.moveTo(start[0],start[1]);
    ctx.lineTo(end[0],end[1]);
    ctx.stroke();
}

function drawCircle(xValue,yValue){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.fillStyle="#FF0000";
    ctx.beginPath();
    ctx.arc(xValue,yValue,4,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

function displayPoints(){
    clearBox("pointsDisplay");
    var p = document.createElement('p');
    p.innerHTML = "Points inserted: ";
    document.getElementById("pointsDisplay").appendChild(p);
    for (let i = 0; i < length_coordinates; i++){
        var p = document.createElement('p');
        p.innerHTML = "(" + String(xCoordinates[i])+", "+String((500.00 - yCoordinates[i]).toFixed(2)) + ")";
        document.getElementById("pointsDisplay").appendChild(p);
        if (i >= 15){
            var p = document.createElement('p');
            p.innerHTML = "...("+String(length_coordinates-1-i)+" more points)";
            document.getElementById("pointsDisplay").appendChild(p);
            break;
        }
    }
}

function displayCaption(caption){
    clearBox("captionDisplay");
    var p = document.createElement('p');
    p.innerHTML = "What is happening: ";
    document.getElementById("captionDisplay").appendChild(p);
    var p = document.createElement('p');
    p.innerHTML = caption;
    document.getElementById("captionDisplay").appendChild(p);
}

function addPointsSpecific(){
    let xCoord = parseInt(document.getElementById("xCoord").value); // get x
    let yCoord = parseInt(document.getElementById("yCoord").value); // get y
    console.log("Add x, y: ", xCoord, yCoord); 
    xCoordinates.push(xCoord);
    yCoordinates.push(yCoord);
    length_coordinates++;
    drawCircle(xCoordinates[length_coordinates-1],yCoordinates[length_coordinates-1]);
    displayPoints();
}

function addPoints(){
    xCoordinates.push(parseFloat((Math.random() * (496 - 4) + 4).toFixed(2)));
    yCoordinates.push(parseFloat((Math.random() * (496 - 4) + 4).toFixed(2)));
    length_coordinates++;
    drawCircle(xCoordinates[length_coordinates-1],yCoordinates[length_coordinates-1]);
    displayPoints();
}

function undoPoint(){
    if (length_coordinates == 0){return;}
    xCoordinates.pop();
    yCoordinates.pop();
    length_coordinates--;
    displayPoints();
    clearCanvas();
    for (let i = 0; i < length_coordinates; i++){
        drawCircle(xCoordinates[i], yCoordinates[i]);
    }
}

function drawCone(xLocation, yLocation) {
    var x,y;
    for (let i = 0; i < k; i++){
        console.log("Draw cone at:", xLocation, yLocation, "i = ", i);
        x = xLocation + coneLength * Math.cos(radian * i);
        y = yLocation + coneLength * Math.sin(radian * i);
        var s = [xLocation,yLocation];
        var t = [x,y];
        drawLine(s,t,"#000000", false);
        // ctx.moveTo(xLocation,yLocation);
        // ctx.lineTo(x,y);
        console.log("Drawing", xLocation, yLocation, "to", x, y);
    }
}

function connectLines(xLocation, yLocation, highlight){
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
            if ((angle >= radian*i && angle < radian*(i+1)) || (angle >= radian*i+2*Math.PI) && (angle < radian*(i+1)+2*Math.PI)){
                console.log("Found inside cone!!");
                var a = [x,y];
                candidates.push(a);
            }
        }
        console.log(candidates);
        for (let j = 0; j < candidates.length; j++){
            angle = Math.atan(((500 - candidates[j][1])-(500 - yLocation)) / (candidates[j][0]-xLocation));
            projDist = Math.abs(Math.cos(angle-radian*(i+0.5))) * Math.sqrt((candidates[j][0]-xLocation)**2 + ((500 - candidates[j][1]) - (500 - yLocation))**2);
            if (Math.abs(Math.cos(radian * (i+0.5))) < 0.000000001){
                projDist = Math.abs(candidates[j][1] - yLocation);
            }
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
        if (highlight){
            drawLine([xLocation,yLocation],selectedPoints[i], "#FF2E2E", false);
        } else{
            drawLine([xLocation,yLocation],selectedPoints[i], "#68BBE3", false);
        }
    }
}

function drawProjections(xLocation, yLocation){
    for (let i = 0; i < k; i++){
        let candidates = [];
        let projectPoints = [];
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
            console.log("Finding points in cone current point: ",x , (500-y), angle );
            if ((angle >= radian*i && angle < radian*(i+1)) || (angle >= radian*i+2*Math.PI) && (angle < radian*(i+1)+2*Math.PI)){
                console.log("Found inside cone!!");
                var a = [x,y];
                candidates.push(a);
                // y = qx + n, q = sin/cos
                let q = Math.sin(radian * (i+0.5)) / Math.cos(radian * (i+0.5));
                // n = y - qx
                let n = (500-yLocation) - (q * xLocation);
                // y = px + m
                let p = - (1 / q);
                // m = y - px
                let m = (500 - y) - (p * x);
                // qx + n = px + m
                // x = (m-n)/(q-p)
                xProj = (m-n)/(q-p);
                // y = qx + n,
                yProj = q * xProj + n;
                if (Math.abs(Math.cos(radian * (i+0.5))) < 0.000001){
                    yProj = 500 - y;
                    xProj = xLocation;
                }
                console.log("sin:", Math.sin(radian * (i+0.5)));
                console.log("cos:", Math.cos(radian * (i+0.5)));
                console.log("q:",q);
                console.log("n:",n);
                console.log("p:",p);
                console.log("m:",m);
                console.log("xProj:",xProj);
                console.log("yProj:",yProj);
                let s = [x,y];
                let t = [xProj,500 - yProj];
                drawLine(s, t, "#81B622", true);
            }
        }
        let xDir = xLocation + 1000 * Math.cos(radian * (i+0.5));
        let yDir = yLocation + 1000 * Math.sin(radian * (i+0.5));
        let s = [xLocation,yLocation];
        let t = [xDir,yDir];
        drawLine(s,t,"#81B622", false);

    }
}

function getDegree(){
    kConfirm = true;
    document.getElementById("confirm").style.display = "inline";
    k = parseInt(document.getElementById("k").value); // get k
    console.log(k);
    radian = 360 / k; // calculate degree by k
    radian *= Math.PI / 180; // dgree to radian

    clearBox("angleDisplay");
    var p = document.createElement('p');
    p.innerHTML = "The angle of cone is: "+String(360 / k)+" in degree.";
    document.getElementById("angleDisplay").appendChild(p);
}

function connectNextPoint(){
    if (!kConfirm) {return;}
    if (document.querySelector('#nextBtn').textContent == "By step: Move to next cones"){
        if (!showProj){
            document.querySelector('#nextBtn').textContent = "By step: Connect the points";
        } else {
            document.querySelector('#nextBtn').textContent = "By step: Check distance of Projections";
        }
        if (index == 0){saveCanvas(0);}
        clearCanvas();
        readCanvas(0);
        if (index <= coneLength){
            drawCone(xCoordinates[index],yCoordinates[index]);
            displayCaption("Examine each cone of the point,\nthere is at most one connection in a cone. The angle of each cone is calculated by 360 / k.");
        }
    } else if (document.querySelector('#nextBtn').textContent == "By step: Check distance of Projections"){
        document.querySelector('#nextBtn').textContent = "By step: Connect the points";
        if(showProj){
            drawProjections(xCoordinates[index],yCoordinates[index]);
            displayCaption("Find projections of the points(which are within the cones) onto the center line of each cones.");
        }
    } else{
        document.querySelector('#nextBtn').textContent = "By step: Move to next cones";
        clearCanvas();
        readCanvas(0);
        connectLines(xCoordinates[index],yCoordinates[index],false);
        saveCanvas(0);
        if(showProj){
            drawProjections(xCoordinates[index],yCoordinates[index]);
        }
        drawCone(xCoordinates[index],yCoordinates[index]);
        connectLines(xCoordinates[index],yCoordinates[index],true);
        displayCaption("Within each cone, the point with the minimum distance between its proejction and the current point is connected.")
        index++;

    }
    
}

function showProjections(){
    if (document.querySelector('#showProj').textContent == "Toggle: Hide Projections"){
        document.querySelector('#showProj').textContent = "Toggle: Show Projections";
        showProj = true;
    } else{
        document.querySelector('#showProj').textContent = "Toggle: Hide Projections";
        showProj = false;
    }
}

function resetGraph(){
    saveCanvas(2);
    document.getElementById("copyCanvas3").style.display = "inline";
    document.getElementById("newConst").style.display = "block";
    document.getElementById("oldConst").style.display = "inline";
    document.getElementById("pointsDisplay").style.left = "620";
    document.getElementById("pointsDisplay").style.top = "-620";
    document.getElementById("captionDisplay").style.left = "50";
    document.getElementById("captionDisplay").style.top = "835";
    clearCanvas();
    for (let j = 0; j < length_coordinates; j++){
        drawCircle(xCoordinates[j],yCoordinates[j]);
    }
    index = 0;
    saveCanvas(0);
    saveCanvas(1);
}

function seeResult(){
    index = 0;
    clearCanvas();
    for (let j = 0; j < length_coordinates; j++){
        drawCircle(xCoordinates[j],yCoordinates[j]);
        connectLines(xCoordinates[j], yCoordinates[j]);
    }
}