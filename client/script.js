let totalVids = 247;
let isLooping = true;
let isLiked = false;
let viewUpdated = 0;
let likeUpdated = 0;
let vidDur, vidCur, vidSize, vidNum = -1
let viewRetryInterval, likeRetryInterval, metaRetryInterval, superlikeRetryInterval
let likeRetryCounter = 0, viewRetryCounter = 0, metaRetryCounter = 0, superlikeRetryCounter = 0;
const maxRetries = 4;
let vidMeta = null;
let superlikedOnly = false;
let allVids = []


let title = document.getElementById("title");
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
let stats = document.querySelector('#stats');
let likesHolder = document.querySelector('#likesHolder');
let mood = document.querySelector('#mood');

title.addEventListener('click', toggleSuperlike);
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
mood.addEventListener('click', toggleMood);
// stats.addEventListener('click', showStats);


document.addEventListener("DOMContentLoaded", function () {
    randVid();
})


function logger(output) {
    if(!(settingsPanel.classList.contains('hidden')))
        console.log(`4am -- ${output}`);

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
    vidMeta = undefined; resetLike(); resetView(); resetMetaData(); resetSuperlike();
    if (superlikedOnly && allVids.length > 0) {
        vidNum = allVids[getRandomNumber(1, allVids.length)];
    } else {
        vidNum = getRandomNumber(1, totalVids);
    }
    vid.setAttribute("src", "./videos/" + vidNum + ".mp4");
    let inited = await initVideo(vidNum);
    logger(vidNum);
    updateProgBar()
    sendView()     // sending 👁️ VIEW
    getMetaData()    // fetching META data
}




function checkIfVideoEnded() {
    vidDur = vid.duration  // Duration in seconds
    vidCur = vid.currentTime
    if (superlikedOnly && vidMeta && allVids.length > 0 && !(vidMeta.isSuperliked)) {
        randVid();
    }
    if (likeUpdated > 1 || viewUpdated > 1) {
        location.reload();
    }
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
        if (!viewUpdated) { viewRetryCounter = 0; clearInterval(viewRetryInterval); sendView(); }
        if (!vidMeta) { resetMetaData(); getMetaData(); }
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


function toggleMood() {
    if (superlikedOnly) {
        superlikedOnly = false;
        mood.innerHTML = 'All';
        allVids = []
    } else {
        superlikedOnly = true;
        mood.innerHTML = 'Superliked';
        getAllVidsData();
        // logger(allVids);
        // allVids = allVids.filter(vid => vid.isSuperliked === true).map(vid => vid.vidNum);
        // logger(allVids);
    }
    logger(`Superliked only mode : ${superlikedOnly}`)
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
    likesHolder.innerHTML = '0'
    isLiked = false;
    likeUpdated = 0;
    likeRetryCounter = 0;
    clearInterval(likeRetryInterval)
    logger("isLiked : reset");
}

function resetSuperlike() {
    title.classList.remove('border-2');
    superlikeRetryCounter = 0;
    clearInterval(superlikeRetryInterval)
    logger("superlike : reset");
}

function resetMetaData() {
    title.classList.remove('border-2');
    vidMeta = null;
    metaRetryCounter = 0;
    clearInterval(metaRetryInterval)
    logger("metaData : reset");
}

function resetView() {
    vidDur = undefined;
    vidSize = undefined;
    viewUpdated = 0;
    viewRetryCounter = 0;
    clearInterval(viewRetryInterval)
}


function playNext() {
    if (!isLooping) {
        logger("Not looping");
        randVid();
    }
    else {
        viewUpdated = 0;
        sendView();        // sending 👁️ VIEW
        resetMetaData(); getMetaData();     // fetch META data
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

function updateMarkers() {
    vidMeta.isSuperliked ?
        title.classList.add('border-2') :
        title.classList.remove('border-2');
    likesHolder.innerHTML = vidMeta.likes ? vidMeta.likes : 0;
}

function sendLike() {
    if (isLiked) {
        likeRetryInterval = setInterval(() => {
            if (!likeUpdated && vidSize && vidDur) {
                sendLikeReq()
                clearInterval(likeRetryInterval)
            } else {
                logger("Retrying sending like request")
                likeRetryCounter++
                if (likeRetryCounter > maxRetries) {
                    likeRetryCounter = 0
                    clearInterval(likeRetryInterval)
                }
            }
        }, 500)
    }
}

function sendView() {
    viewRetryInterval = setInterval(() => {
        if (!viewUpdated && vidSize && vidDur) {
            sendViewReq()
            clearInterval(viewRetryInterval)
        } else {
            logger("Retrying sending view request")
            viewRetryCounter++
            if (viewRetryCounter > maxRetries) {
                viewRetryCounter = 0
                clearInterval(viewRetryInterval)
            }
        }
    }, 500)
}

function getMetaData() {
    metaRetryInterval = setInterval(() => {
        if (!vidMeta && vidSize && vidDur) {
            metaDataReq()
            clearInterval(metaRetryInterval)
        } else {
            logger(`Retrying sending meta data request`)
            metaRetryCounter++
            if (metaRetryCounter > maxRetries) {
                metaRetryCounter = 0
                clearInterval(metaRetryInterval)
            }
        }
    }, 500)
}

function toggleSuperlike() {
    superlikeRetryInterval = setInterval(() => {
        if (vidSize && vidDur) {
            toggleSuperlikeReq()
            resetSuperlike()
            clearInterval(superlikeRetryInterval)
        } else {
            logger(`Retrying sending superlike request`)
            superlikeRetryCounter++
            if (superlikeRetryCounter > maxRetries) {
                superlikeRetryCounter = 0
                clearInterval(superlikeRetryInterval)
            }
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
            duration: `${Math.floor(vidDur)}`,
            vidNum: vidNum
        })
    })
        .then(response => {
            likeUpdated++;
            resetMetaData(); getMetaData();
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
            duration: `${Math.floor(vidDur)}`,
            vidNum: vidNum
        })
    })
        .then(response => {
            viewUpdated++
            return response.json()
        })
        .then(data => logger(data))
        .catch(error => {
            console.error('Problem adding the VIEW', error);
        });
}

function metaDataReq() {
    fetch('https://4am-xi.vercel.app/meta/data', {
        // fetch('http://localhost:3000/meta/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            size: `${vidSize}`,
            duration: `${Math.floor(vidDur)}`,
            vidNum: vidNum
        })
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            vidMeta = data;
            updateMarkers();
            logger(data);
        })
        .catch(error => {
            console.error('Problem fetching meta data', error);
        });
}


function toggleSuperlikeReq() {
    fetch('https://4am-xi.vercel.app/meta/superlike', {
        // fetch('http://localhost:3000/meta/superlike', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            size: `${vidSize}`,
            duration: `${Math.floor(vidDur)}`,
            vidNum: vidNum
        })
    })
        .then(response => {
            resetMetaData(); getMetaData();
            return response.json()
        })
        .then(data => logger(data))
        .catch(error => {
            console.error('Problem updating superLIKE', error);
        });
}

function getAllVidsData() {
    fetch('https://4am-xi.vercel.app/meta/show-all', {
        // fetch('http://localhost:3000/meta/show-all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            allVids = data.filter(vid => vid.isSuperliked === true).map(vid => vid.vidNum);
            logger(`Total superliked vids : ${allVids.length}`);
        })
        .catch(error => {
            console.error('Problem getting AllVidsData', error);
        });
}

// function showStats() {
//     window.location.href = "./stats/stats.html";
// }