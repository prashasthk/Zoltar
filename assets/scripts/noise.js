let gainNode;
let backgroundSource;
let audioContext;

/**
 * Starts background noise, fading in over 5 seconds
 * @param none
 */
export function playBackgroundNoise() {
	gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
	gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 3);
	backgroundSource.start();
} /* playBackgroundNoise */

function init() {
	// background noise setup
	audioContext = new window.AudioContext();
	backgroundSource = audioContext.createBufferSource();
	gainNode = audioContext.createGain();
	backgroundSource.connect(gainNode);
	gainNode.connect(audioContext.destination);

	fetch('./assets/audio/background.wav')
		.then((response) => response.arrayBuffer())
		.then((data) => audioContext.decodeAudioData(data))
		.then((buffer) => {
			backgroundSource.buffer = buffer;
			backgroundSource.loop = true;
		});
} /* init */

document.addEventListener('DOMContentLoaded', init);
