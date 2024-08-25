let totalVids = 187;
let isLooping = true;
let isLiked = false;

let refreshBtn = document.getElementById("refreshBtn");
let vidHolder = document.getElementById("vidHolder");
let vid = document.getElementById("vid");
let playDiv = document.querySelector('#play');
let pauseDiv = document.querySelector('#pause');
let loopToggleBtn = document.querySelector('#loopToggle');
let likeToggleBtn = document.querySelector('#likeToggle');
let playlist = document.querySelector('#playlist');
let loop = document.querySelector('#loop');
let settingsBtn = document.querySelector('#settings');
let settingsPanel = document.querySelector('#settingsPanel');
let closeSettingsBtn = document.querySelector('#closeSettings');
let logDisplay = document.querySelector('#log');
let progBar = document.querySelector('#progBar');
let likeEmpty = document.querySelector('#likeEmpty');
let likeFull = document.querySelector('#likeFull');
let vidDur, vidCur, vidSize, vidNum

refreshBtn.addEventListener('click', randVid);
vid.addEventListener('click', playpause);
loopToggleBtn.addEventListener('click', toggleLoopMode);
likeToggleBtn.addEventListener('click', toggleLike);
vid.addEventListener('loadedmetadata', onVideoLoadedMetadata);
vid.addEventListener('timeupdate', checkIfVideoEnded);
vid.addEventListener('ended', playNext);
settingsBtn.addEventListener('click', handleSettingClick);
closeSettingsBtn.addEventListener('click', handleSettingClick);


document.addEventListener("DOMContentLoaded", function () {
    randVid();
})


function logger(output) {
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

function randVid() {
    let vidNum = getRandomNumber(1, totalVids);
    vid.setAttribute("src", "./videos/" + vidNum + ".mp4");
    logger(vidNum);
    updateProgBar()
}

function checkIfVideoEnded() {
    vidDur = vid.duration  // Duration in seconds
    vidCur = vid.currentTime
    vidSize = vid.fileSize  // Size in bytes
    updateProgBar()
    if (vid.currentTime >= vid.duration - 0.25) {
        sendView()
        isLiked && sendLike()
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


function playpause() {
    vid.setAttribute("autoplay", "")
    let whichDiv, otherDiv;
    if (vid.paused) {
        vid.play();
        logger("Played");
        whichDiv = playDiv;
        otherDiv = pauseDiv
    } else {
        vid.pause();
        logger("Paused");
        whichDiv = pauseDiv;
        otherDiv = playDiv
    }
    otherDiv.classList.add('hidden');
    whichDiv.classList.remove('hidden');
    setTimeout(() => { whichDiv.classList.add('hidden') }, 500);
}


function toggleLoopMode() {
    loop.classList.toggle("hidden");
    playlist.classList.toggle("hidden");
    isLooping = !isLooping;
    vid.loop = isLooping;
    logger("Looping : " + isLooping);
}

function toggleLike() {
    likeEmpty.classList.toggle("hidden");
    likeFull.classList.toggle("hidden");
    isLiked = !isLiked;
    logger("isLiked : " + isLiked);
}

function playNext() {
    sendView()
    if (!isLooping) {
        isLiked && sendLike()
        logger("Not looping");
        randVid();
    }
    else {
        vid.play();
        logger("Looping");
    }
}

let rotationVal = 0
function handleSettingClick() {
    settingsBtn.style.transform = `rotate(${rotationVal + 60}deg)`; rotationVal += 60;
    settingsPanel.classList.toggle("hidden");
}

function updateProgBar() {
    progBar.style = `width:${(vidCur / vidDur) * 100}%;`
}

function sendLike() {
    fetch('https://4am-xi.vercel.app/meta/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            size: `${vidSize}`,
            duration: `${vidDur}`,
            likes: `${isLiked ? 1 : 0}`,
        })
    })
        .then(response => response.json())
        .then(data => logger(data))
        .catch(error => {
            console.error('Problem adding the LIKE', error);
        });
}

function sendView() {
    fetch('https://4am-xi.vercel.app/meta/view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            size: `${vidSize}`,
            duration: `${vidDur}`
        })
    })
        .then(response => response.json())
        .then(data => logger(data))
        .catch(error => {
            console.error('Problem adding the VIEW', error);
        });
}


// window.onload = function ()
// };