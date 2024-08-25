let totalVids = 187;
let isLooping = true;
let isLiked = false;
let viewUpdated = false;
let likeUpdated = false;
let vidDur, vidCur, vidSize, vidNum = -1
let viewRetryInterval, likeRetryInterval

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

refreshBtn.addEventListener('click', randVid);
vid.addEventListener('click', playpause);
loopToggleBtn.addEventListener('click', toggleLoopMode);
likeToggleBtn.addEventListener('click', toggleLike);
likeToggleBtn.addEventListener('click', sendLike);
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

async function randVid() {
    (vidNum !== -1 && isLiked) && sendLike();        // sending ❤️ LIKE
    resetLike(); resetView();
    vidNum = getRandomNumber(1, totalVids);
    vid.setAttribute("src", "./videos/" + vidNum + ".mp4");
    let inited = await initVideo(vidNum);
    logger(vidNum);
    updateProgBar()
    sendView()     // sending 👁️ VIEW
}



function checkIfVideoEnded() {
    vidDur = vid.duration  // Duration in seconds
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

async function getVideoSize(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return blob.size;
    } catch (error) {
        console.error('Error fetching video size:', error);
        return null;
    }
}

async function initVideo(vidNum) {
    let vidSrc = `./videos/${vidNum}.mp4`;

    vidSize = await getVideoSize(vidSrc);
    if (vidSize) {
        logger(`Video size: ${vidSize} bytes`);
    }

    vid.setAttribute("src", vidSrc);
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

function resetLike() {
    likeEmpty.classList.remove("hidden");
    likeFull.classList.add("hidden");
    isLiked = false;
    likeUpdated = false;
    clearInterval(likeRetryInterval)
    logger("isLiked : reset");
}

function resetView() {
    vidDur = undefined
    vidSize = undefined
    viewUpdated = false;
    clearInterval(viewRetryInterval)
}


function playNext() {
    if (!isLooping) {
        logger("Not looping");
        randVid();
    }
    else {
        viewUpdated = false;
        sendView();        // sending 👁️ VIEW
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
    if(isLiked) {
        likeRetryInterval = setInterval(() => {
            if(!likeUpdated && vidSize && vidDur) {
                sendLikeReq()
                clearInterval(likeRetryInterval)
            } else {
                logger("Retrying sending like request")
            }
        }, 500)
    }
}

function sendView() {
    viewRetryInterval = setInterval(() => {
        if(!viewUpdated && vidSize && vidDur) {
            sendViewReq()
            clearInterval(viewRetryInterval)
        } else {
            logger("Retrying sending view request")
        }
    }, 500)
}

function sendLikeReq() {
    fetch('https://4am-xi.vercel.app/meta/like', {
    // fetch('http://localhost:3000/meta/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            size: `${vidSize}`,
            duration: `${vidDur}`,
            vidNum: vidNum
        })
    })
        .then(response => {
            likeUpdated = true;
            return response.json()
        })
        .then(data => logger(data))
        .catch(error => {
            console.error('Problem adding the LIKE', error);
        });
}


function sendViewReq() {
    fetch('https://4am-xi.vercel.app/meta/view', {
    // fetch('http://localhost:3000/meta/view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            size: `${vidSize}`,
            duration: `${vidDur}`,
            vidNum: vidNum
        })
    })
        .then(response => {
            viewUpdated = true
            return response.json()
        })
        .then(data => logger(data))
        .catch(error => {
            console.error('Problem adding the VIEW', error);
        });
}


// window.onload = function ()
// };