var framerate = 30;
var loop = 0;
var width = window.innerWidth-10;
var height = window.innerHeight-10;


function $_GET(q,s) {
    s = (s) ? s : window.location.search;
    var re = new RegExp('&amp;'+q+'=([^&amp;]*)','i');
    return (s=s.replace(/^\?/,'&amp;').match(re)) ?s=s[1] :s='';
}
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}


//  do not go back if backspace is pressed
$(document).keydown(function(e) {
    var nodeName = e.target.nodeName.toLowerCase();

    if (e.which === 8) {
        if ((nodeName === 'input' && e.target.type === 'text') ||
            nodeName === 'textarea') {
            // do nothing
        } else {
            e.preventDefault();
        }
    }
});


var framerate = 30;
var getFramerate = findGetParameter('f');
if (getFramerate)
{
    framerate = Number(getFramerate);
}

var drag = 0.1;
var getDrag = findGetParameter('d');
if (getDrag)
{
    drag = Number(getDrag);
}

var startAngle = 40;
var getStartAngle = findGetParameter('a');
if (getStartAngle)
{
    startAngle = Number(getStartAngle);
}

var ratio = 0.51;
var getRatio = findGetParameter('r');
if (getRatio)
{
    ratio = Number(getRatio);
}


function startGame()
{
    canvasArea.start();
}


var canvasArea =
    {
	canvas : document.createElement("canvas"),
	start : function()
	{
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(updateCanvasArea, 1000/framerate);

	    // keyboard controls
            window.addEventListener('keydown', function (e) {
		canvasArea.keys = (canvasArea.keys || []);
		canvasArea.keys[e.keyCode] = true;
            })
            window.addEventListener('keyup', function (e) {
		canvasArea.keys[e.keyCode] = false;
		pressedKey = e.keyCode;
            })

	    // mouse controls
            window.addEventListener('mousemove', function (e) {
		canvasArea.moveX = e.pageX;
		canvasArea.moveY = e.pageY;
            })
            window.addEventListener('mousedown', function (e) {
		canvasArea.x = e.pageX;
		canvasArea.y = e.pageY;
            })
            window.addEventListener('mouseup', function (e) {
		canvasArea.x = false;
		canvasArea.y = false;
            })

	    // touch screen controls
            window.addEventListener('touchmove', function (e) {
		canvasArea.moveX = e.touches[e.touches.length-1].screenX;
		canvasArea.moveY = e.touches[e.touches.length-1].screenY;
            })
            window.addEventListener('touchstart', function (e) {
		canvasArea.x = e.touches[0].screenX;
		canvasArea.y = e.touches[0].screenY;
		canvasArea.moveX = e.touches[e.touches.length-1].screenX;
		canvasArea.moveY = e.touches[e.touches.length-1].screenY;
            })
            window.addEventListener('touchend', function (e) {
		canvasArea.x = false;
		canvasArea.y = false;
            })
	},
	clear : function()
	{
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function()
	{
            clearInterval(this.interval);
	}
    }






var centerx = width/2;
var centery = height/2;

var x = centerx + Math.cos(startAngle/180*Math.PI) * Math.min(width/2, height/2);
var y = centery + Math.sin(startAngle/180*Math.PI) * Math.min(width/2, height/2);
var oldx; var oldy;
var energyX = Math.abs(x - centerx);  var energyY = Math.abs(y - centery);



function updateCanvasArea()
{
    ctx = canvasArea.context;

    oldx = x;  oldy = y;
    if (energyX > 0) energyX -= drag;
    if (energyY > 0) energyY -= drag;
    y = centery + energyY * Math.sin(loop * ratio / 8);
    x = centerx + energyX * Math.sin(loop / 8);

    if (loop)
    {
	ctx.beginPath();
	ctx.moveTo(oldx, oldy);
	ctx.lineTo(x, y);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 0.5;
	ctx.stroke();
    }

    loop++;
}
