let totalVids = 131;

let refreshBtn = document.getElementById("refreshBtn");
let vidHolder = document.getElementById("vidHolder");
let vid = document.getElementById("vid");
let playDiv = document.querySelector('#play');
let pauseDiv = document.querySelector('#pause');

refreshBtn.addEventListener('click', randVid);
vidHolder.addEventListener('click', playpause);

randVid();

function randVid(){
    let randNum = getRandomNumber(1,totalVids);
    vid.setAttribute("src", "./videos/"+randNum+".mp4");
    console.log(randNum);
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





// window.onload = function () 
// };
