<!-- how to use 
1. $('.debug')
2. getMicInput();
3. audio();

-->

<?php include 'header.php'; ?>
<style>
	.myBall {
		position: absolute;
		left: 100px;
		top: 100px;
		width:100px;
		height: 100px;
		background-color: red;
		border-radius: 999px;
		opacity: 0.5;
	}
</style>
<script>
getMicInput();
audio();

setInterval(function() {
	$('.myBall').css({
	'width': volume*500,
	'height': volume*500,
	'top': 0.05*($('.myBall').position().top) + 0.95*(h/2 - ($('.myBall').height())/2),
	'left': 0.05*($('.myBall').position().left) + 0.95*(w/2 - ($('.myBall').width())/2)
});
}, 1000/60);

</script>

<div class="myBall"></div>

<?php include 'footer.php'; ?>
