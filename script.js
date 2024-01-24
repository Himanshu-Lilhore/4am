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

refreshBtn.addEventListener('click', randVid);
vidHolder.addEventListener('click', playpause);
loopToggleBtn.addEventListener('click', toggleLoopMode);
vid.addEventListener('loadedmetadata', onVideoLoadedMetadata);
vid.addEventListener('timeupdate', checkIfVideoEnded);
vid.addEventListener('ended', playNext);

randVid();

function randVid(){
    let randNum = getRandomNumber(1,totalVids);
    vid.setAttribute("src", "./videos/"+randNum+".mp4");
    console.log(randNum);
}

function checkIfVideoEnded() {
    if (vid.currentTime >= vid.duration - 0.5) {
        playNext();
    }
}

function onVideoLoadedMetadata() {
    console.log("Video duration:", vid.duration);
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
        whichDiv = playDiv;
    } else {
        vid.pause();
        whichDiv = pauseDiv;
    }
    whichDiv.classList.remove('hidden');
    setTimeout(()=>{whichDiv.classList.add('hidden')}, 500);
}


function toggleLoopMode(){
    loop.classList.toggle("hidden");
    playlist.classList.toggle("hidden");
    isLooping = !isLooping;
    console.log("toggleed play mode : " + isLooping);
}

function playNext(){
    if(!isLooping){
        console.log("not looping");
        randVid();
    }
    else{
        vid.play();
        console.log("looping");
    }
}


// window.onload = function () 
// };
