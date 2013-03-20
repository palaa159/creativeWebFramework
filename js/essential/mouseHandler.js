// variables
var mPosX = 0, 
mPosY = 0, 
canvas = window,
w = canvas.innerWidth, 
h = canvas.innerHeight;
// start
init();
// event listeners
function init(){
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('resize', onResize, false);
}
// functions
function onMouseMove(e) {
	mX = e.pageX/w;
	mY = e.pageY/h;
	mPosX = mX.toFixed(2);// 0.00 - 1.00
	mPosY = mY.toFixed(2);// 0.00 - 1.00
/* 	$('.debug').html(mPosX + " " + mPosY); */
}
function onMouseDown(e) {
/* 	$('.debug').html('clicked'); */
	window.removeEventListener('mousemove', onMouseMove, false);
	window.addEventListener('mousemove', onMouseDrag, false);
}

function onMouseDrag(e) {
	mX = e.pageX/w;
	mY = e.pageY/h;
	mPosX = mX.toFixed(2);// 0.00 - 1.00
	mPosY = mY.toFixed(2);// 0.00 - 1.00
/* 	$('.debug').html('is dragging' + " " + mPosX + " " + mPosY); */
}

function onMouseUp(e) {
	window.removeEventListener('mousemove', onMouseDrag, false);
	window.addEventListener('mousemove', onMouseMove, false);
/* 	$('.debug').html(mPosX + " " + mPosY); */
}

function onResize() {
	w = canvas.innerWidth;
	h = canvas.innerHeight;
/* 	$('.debug').html(w + " " + h); */
}