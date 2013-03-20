var source;
var buffer;
var audioBuffer;
var audioContext = new window.webkitAudioContext();
var processor;
var analyser;
var freqByteData;
var levels;
var isPlayingAudio = false;
var volume = 0;
var freq = 0;
var BEAT_HOLD_TIME = 80; //num of frames to hold a beat
var BEAT_DECAY_RATE = 0.99;
var beatCutOff = 0;
var beatTime = 0;
var bufferSize = 256;

function getMicInput() {
	//x-browser
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	if (navigator.getUserMedia) {
		navigator.getUserMedia({
			audio: true
		}, function(stream) {
			//called after user has enabled mic access
			source = audioContext.createBufferSource();
			analyser = audioContext.createAnalyser();
			analyser.fftSize = bufferSize*2;
			microphone = audioContext.createMediaStreamSource(stream);
			microphone.connect(analyser);
			// start analyze function
			startAnalyze();
		});
	}
}

function startAnalyze() {
	freqByteData = new Uint8Array(analyser.frequencyBinCount);
	levels = [];
	isPlayingAudio = true;
}

function updateAudio(time) {
	if (!isPlayingAudio) return;
	analyser.getByteFrequencyData(freqByteData);
	var length = freqByteData.length;
	//GET AVG LEVEL
	var sum = 0;
	for (var j = 0; j < length; ++j) {
		sum += freqByteData[j] * freqByteData[j];
	}
	// Calculate the average frequency of the samples in the bin
	var aveLevel = Math.sqrt(sum / length);
	volume = (aveLevel / 256) * 4; //volume
	//BEAT DETECTION
	if (volume > beatCutOff) {
		onBeat();
		beatCutOff = volume * 1.2;
		beatTime = 0;
	} else {
		if (beatTime < BEAT_HOLD_TIME) {
			beatTime++;
		} else {
			beatCutOff *= BEAT_DECAY_RATE;
		}
	}
	// freq
	// calc 
	var cycles = new Array;
	analyser.getByteTimeDomainData( buf );

	var i=0;
	// find the first point
	var last_zero = findNextPositiveZeroCrossing( 0 );

	var n=0;
	// keep finding points, adding cycle lengths to array
	// some guy wrote it.
	while ( last_zero != -1) {
		var next_zero = findNextPositiveZeroCrossing( last_zero + 1 );
		if (next_zero > -1)
			cycles.push( next_zero - last_zero );
		last_zero = next_zero;

		n++;
		if (n>1000)
			break;
	}

	// 1?: average the array
	var num_cycles = cycles.length;
	var sumx = 0;

	for (var k=0; k<num_cycles; k++) {
		sumx += cycles[i];
	}
	if (num_cycles) {
		sumx /= num_cycles;
		freq = audioContext.sampleRate/sumx;
		setInterval(function() {
			freq *= 0.95;
		}, 5000);
	}	
// confidence = num_cycles / num_possible_cycles = num_cycles / (audioContext.sampleRate/)
	var confidence = (num_cycles ? ((num_cycles/(freq * buflen / audioContext.sampleRate)) * 100) : 0);

	$('.debug').html( 
		"Volume: " + volume + "<br>" + 
/* 		" - average length: " + sum + "<br>" +  */
		" - freq: " + freq + "Hz " + "<br>"
/* 		" - confidence: " + confidence + "% " */
		);
}

function onBeat() {
	console.log('we have the beat!');
}

var buflen = bufferSize;
var buf = new Uint8Array( buflen );
var MINVAL = 132;  // 128 == zero.  MINVAL is the "minimum detected signal" level.

function findNextPositiveZeroCrossing( start ) {
	var i = Math.ceil( start );
	var last_zero = -1;
	// advance until we're zero or negative
	while (i<buflen && (buf[i] > 128 ) )
		i++;
	if (i>=buflen)
		return -1;

	// advance until we're above MINVAL, keeping track of last zero.
	while (i<buflen && ((t=buf[i]) < MINVAL )) {
		if (t >= 128) {
			if (last_zero == -1)
				last_zero = i;
		} else
			last_zero = -1;
		i++;
	}

	// we may have jumped over MINVAL in one sample.
	if (last_zero == -1)
		last_zero = i;

	if (i==buflen)	// We didn't find any more positive zero crossings
		return -1;

	// The first sample might be a zero.  If so, return it.
	if (last_zero == 0)
		return 0;

	// Otherwise, the zero might be between two values, so we need to scale it.

	var t = ( 128 - buf[last_zero-1] ) / (buf[last_zero] - buf[last_zero-1]);
	return last_zero+t;
}

function audio() {
	setTimeout(function() {
		window.requestAnimationFrame(audio);
	}, 1000 / 60);
	updateAudio();
}