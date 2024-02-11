let totalVids = 131;
let isLooping = true;

let refreshBtn = document.getElementById("refreshBtn");
let vidHolder = document.getElementById("vidHolder");
let vid = document.getElementById("vid");
let playDiv = document.querySelector('#play');
let pauseDiv = document.querySelector('#pause');
let loopToggleBtn = document.querySelector('#loopToggle');
let playlist = document.querySelector('#playlist');
let loop = document.querySelector('#loop');
let settingsBtn = document.querySelector('#settings');
let settingsPanel = document.querySelector('#settingsPanel');
let closeSettingsBtn = document.querySelector('#closeSettings');
let logDisplay = document.querySelector('#log');
let progBar = document.querySelector('#progBar');
let vidDur, vidCur

refreshBtn.addEventListener('click', randVid);
vid.addEventListener('click', playpause);
loopToggleBtn.addEventListener('click', toggleLoopMode);
vid.addEventListener('loadedmetadata', onVideoLoadedMetadata);
vid.addEventListener('timeupdate', checkIfVideoEnded);
vid.addEventListener('ended', playNext);
settingsBtn.addEventListener('click', toggleSettingsPanel);
closeSettingsBtn.addEventListener('click', toggleSettingsPanel);


document.addEventListener("DOMContentLoaded", function() {
randVid();
})


function logger(output)
{
    console.log(output);

    let btemp = document.createElement("span");
    btemp.textContent = output;
    btemp.classList.add("block");
    // logDisplay.appendChild(btemp);
    if (logDisplay.firstChild) {
        logDisplay.insertBefore(btemp, logDisplay.firstChild);
    } else {
        logDisplay.appendChild(btemp);
    }
}

function randVid(){
    let randNum = getRandomNumber(1,totalVids);
    vid.setAttribute("src", "./videos/"+randNum+".mp4");
    logger(randNum);
    startAnimation()
    updateProgBar()
}

function checkIfVideoEnded() {
    vidDur = vid.duration
    vidCur = vid.currentTime
    updateProgBar()
    if (vid.currentTime >= vid.duration - 0.25) {
        playNext();
    }
}

function onVideoLoadedMetadata() {
    logger("Video duration : " + vid.duration);

    if (vid.duration !== Infinity) {
        vid.addEventListener('timeupdate', checkIfVideoEnded);
    }
}


function getRandomNumber(min, max) {
    const randomFraction = Math.random();
    const randomInteger = Math.floor(randomFraction * (max - min + 1)) + min;
    return randomInteger;
}


function playpause(){
    let whichDiv;
    if (vid.paused) {
        vid.play();
        logger("Played");
        whichDiv = playDiv;
    } else {
        vid.pause();
        logger("Paused");
        whichDiv = pauseDiv;
    }
    whichDiv.classList.remove('hidden');
    setTimeout(()=>{whichDiv.classList.add('hidden')}, 500);
}


function toggleLoopMode(){
    loop.classList.toggle("hidden");
    playlist.classList.toggle("hidden");
    isLooping = !isLooping;
    logger("Toggled play mode : " + isLooping);
}

function playNext(){
    if(!isLooping){
        logger("Not looping");
        randVid();
    }
    else{
        vid.play();
        logger("Looping");
    }
}

function toggleSettingsPanel(){
    settingsPanel.classList.toggle("hidden");
}

function updateProgBar(){
    progBar.style = `width:${(vidCur/vidDur)*100}%;`
}


// window.onload = function () 
// };
