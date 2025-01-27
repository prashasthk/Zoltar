import { produceRandomNumbers } from '../fortunes.js';
import { convertArrToReadableString, state } from '../ticket.js';
import { chooseOptionFromArr } from '../util.js';
import { saveState } from '../storage.js';
import { updateticketHistoryCount } from './ticketHistory.js';

const LOADING_DELAY = 500;
const OPEN = 1;
const CLOSE = 0;
const AUDIO_LOW = 0.3;
const IMAGE_FRONT = 'assets/images/image-bank-front/header-';
const IMAGE_BACK = 'assets/images/image-bank-back/background-card-';

let domContent = {};
let backgroundmp3;
let thundermp3;
let responses;
let frontImages;
let backImages;
let muteAudio;
let disableZoltar = false;
let muteBackgroundAudio = true;
let ticketOnScreen = false;

/**
 * Flips the main ticket
 */
function flipCard() {
	domContent.frontSide.classList.toggle('rotate');
	domContent.backSide.classList.toggle('rotate');
} /* flipCard */

/**
 * Checks if ticket is on screen
 * @param none
 * @returns boolean
 */
export function isTicketOnScreen() {
	return ticketOnScreen;
} /* isTicketOnScreen */

/**
 * Shakes document body
 * @param none
 */
function shakeScreen() {
	domContent.body.classList.add('shake');
} /* shakeZoltar */

/**
 * Slides ticket onto screen
 * @param none
 */
function displayTicket() {
	domContent.ticket.classList.add('visible');
} /* displayTicket */

/**
 * Displays the ticket prompt
 * @param none
 */
function displayTicketPrompt() {
	domContent.storeTicketPrompt.style.display = 'inline';
} /* displayTicketPrompt */

/**
 * Removes ticket from screen and allows Zoltar to pressed again
 * @param none
 */
function closeTicket() {
	domContent.body.classList.remove('shake');
	domContent.ticket.classList.remove('visible');
	displayTicketPrompt();
} /* closeTicket */

/**
 * Removes the ticket prompt
 * @param none
 */
function removeTicketPrompt() {
	domContent.storeTicketPrompt.style.display = 'none';
	disableZoltar = false;
	ticketOnScreen = false;
} /* removeTicketPrompt */

/**
 * Stores the ticket if called with the saveTicket Button, otherwise
 * will just discard it (do nothing)
 * @param {string} id Button id
 */
function storeButtonHandler(id) {
	removeTicketPrompt();
	if (id === 'saveTicket') {
		if (saveState(state, '2d')) updateticketHistoryCount();
	}
} /* storeButtonHandler */

/**
 * Gets List of responses from Json file
 * @param none
 */
async function getResponses() {
	fetch('assets/json/responses.json')
		.then((response) => response.json())
		.then((json) => { responses = json; });
} /* getResponses */

/**
 * Gets list of images from Json file
 * @param none
 */
async function getImages() {
	fetch('assets/json/images.json')
		.then((response) => response.json())
		.then((json) => {
			frontImages = json.front;
			backImages = json.back;
		});
} /* getImages */

/**
 * Assigns fortune and lucky numbers to the ticket
 * @param none
 */
function assignTicketContent() {
	state.currentImageBack = chooseOptionFromArr(backImages);
	state.currentImageFront = chooseOptionFromArr(frontImages);
	state.currentMessage = chooseOptionFromArr(responses.fortunes).message;
	state.currentNumbers = produceRandomNumbers(4, 1, 100);

	domContent.ticketFrontImage.src = `${IMAGE_BACK}${state.currentImageBack}.png`;
	domContent.ticketHeaderImage.src = `${IMAGE_FRONT}${state.currentImageFront}.png`;
	domContent.fortuneOutput.textContent = state.currentMessage;
	domContent.fortuneNumber.textContent = `Your lucky numbers are: 
		${convertArrToReadableString(state.currentNumbers)}`;
} /* assignTicketContent */

/**
 * When called with OPEN, plays thunder, shakes Zoltar, and displays the ticket and disables
 * Zoltar to prevent new tickets reappearing
 * WHen called with CLOSE, simply closes the ticket.
 * @param {boolean} action CLOSE = 0, OPEN = 1
 */
function ticketHandler(action) {
	if (action) {
		if (thundermp3) thundermp3.play();
		shakeScreen();
		assignTicketContent();
		disableZoltar = true;
		setTimeout(() => {
			displayTicket();
		}, 1300);
		ticketOnScreen = true;
	} else if (ticketOnScreen) {
		displayTicketPrompt();
		closeTicket();
	}
} /* ticketHandler */

/**
 * Toggles muteAudio and volume icons when called. Sets muteAudio to localStorage so that
 * setting is persistent between page loads.
 * @param none
 */
function toggleAudio() {
	muteAudio = !muteAudio;
	localStorage.setItem('MuteAudio', muteAudio);
	backgroundmp3.volume = muteAudio ? 0 : AUDIO_LOW;
	thundermp3.volume = muteAudio ? 0 : AUDIO_LOW;

	domContent.volumeOn.style.display = muteAudio ? 'none' : 'inline';
	domContent.volumeOff.style.display = muteAudio ? 'inline' : 'none';
} /* toggleAudio */

/**
 * Zoltar image event Listener.
 * Disabled when ticket is already displayed
 * Thunder is played when Zoltar shakes, then a
 * ticket pops up.
 * @param none
 */
function zoltarHandler() {
	if (disableZoltar) {
		ticketHandler(CLOSE);
	} else {
		ticketHandler(OPEN);
	}
} /* zoltarHandler */

/**
 * Closes the ticket when 'esc' is pressed
 */
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		ticketHandler(CLOSE);
	} else if (event.key === ' ') {
		if (disableZoltar) {
			ticketHandler(CLOSE);
		} else {
			ticketHandler(OPEN);
		}
	}
});

/**
 * Gets Background audio
 * Gets thunderAudio
 * @param none
 */
function getAudio() {
	backgroundmp3 = new Audio('assets/audio/background.wav');
	backgroundmp3.loop = true;
	backgroundmp3.muted = true;
	backgroundmp3.volume = muteAudio ? 0 : AUDIO_LOW;

	thundermp3 = new Audio('assets/audio/thunder2d.wav');
	thundermp3.volume = muteAudio ? 0 : AUDIO_LOW;
} /* getAudio */

/**
 * Creates an event listener or to save or discard ticket so that
 * init does not exceed 25 lines.
 * @param {array} array store, delete button
 */
function createStoreButtonListener(array) {
	array.forEach((button) => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			storeButtonHandler(button.id);
			removeTicketPrompt();
			ticketOnScreen = false;
		});
	});
} /* createStoreButtonListener */

/**
 * Initiates audio when user clicks on splash screen
 * Fades the audio in over a period of 5 seconds
 * @param none
 */
function go() {
	getAudio();
	getResponses();
	getImages();
	backgroundmp3.play();
	domContent.splash.classList.add('hidden');
	window.removeEventListener('mousedown', go);
	window.removeEventListener('keydown', go);
	domContent.volumeOn.style.display = 'inline';

	// Fade in the background audio over 5 seconds
	let currentTime = 0;
	const fadeDuration = 5000; // 5 seconds
	const volumeIncrement = AUDIO_LOW / (fadeDuration / 100);

	const fadeInInterval = setInterval(() => {
		currentTime += 100;
		backgroundmp3.volume = Math.min(AUDIO_LOW, volumeIncrement * (currentTime / 1000));
		if (currentTime >= fadeDuration) {
			clearInterval(fadeInInterval);
			backgroundmp3.play();
		}
	}, 100);
} /* go */

/**
 * Opens starter project 8 ball on the same tab.
 * @param none
 */
export function openEightBall() {
	setTimeout(() => {
		window.location = ('https://cse110-sp23-group23.github.io/cse110-sp23-group23/source/8ball/');
	}, 500);
} /* openEightBall */

/**
 * Creates the Event Listeners required for the page to function.
 * @param none
 */
function createEventListeners() {
	window.addEventListener('mousedown' || 'keydown', go);
	window.addEventListener('keydown', go);
	domContent.eightball.addEventListener('click', openEightBall);
	domContent.volumeControl.addEventListener('click', toggleAudio);
	domContent.zoltar.addEventListener('click', zoltarHandler);
	domContent.ticketX.addEventListener('click', () => { ticketHandler(CLOSE); });
	createStoreButtonListener(domContent.storeButton);
	domContent.ticket.addEventListener('click', () => {
		if (ticketOnScreen) {
			flipCard();
		}
	});
} /* createEventListeners */

function init() {
	domContent = {
		body: document.querySelector('body'),
		fortuneOutput: document.querySelector('#fortune-output'),
		ticket: document.querySelector('#mainTicket'),
		zoltar: document.querySelector('#eightBallContainer'),
		ticketX: document.getElementById('closeTicket'),
		fortuneNumber: document.querySelector('#fortune-number'),
		volumeControl: document.querySelector('.volume-controls'),
		volumeOn: document.querySelector('#volumeOn'),
		volumeOff: document.querySelector('#volumeOff'),
		splash: document.querySelector('#splash-screen'),
		loadedMessage: document.querySelector('.loaded-message'),
		storeTicketPrompt: document.querySelector('#storeTicketPrompt'),
		storeButton: document.querySelectorAll('.storeButton'),
		ticketHeaderImage: document.querySelector('.back-side-image'),
		ticketFrontImage: document.querySelector('.ticket-front-image'),
		eightball: document.querySelector('#eight-ball-image'),
		backSide: document.querySelector('.back-side'),
		frontSide: document.querySelector('.front-side'),
	};
	createEventListeners();
	setTimeout(() => { domContent.loadedMessage.innerText = '[ press anywhere to continue ]'; }, LOADING_DELAY);
} /* init */

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('click', () => {
	if (muteBackgroundAudio) {
		backgroundmp3.play();
		backgroundmp3.muted = false;
		muteBackgroundAudio = false;
	}
});
