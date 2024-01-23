let refreshBtn = document.getElementById("refreshBtn");
let vid = document.getElementById("vid");

refreshBtn.addEventListener('click', randVid);

function randVid(){
    let randNum = getRandomNumber(1,101);
    vid.setAttribute("src", "./videos/"+randNum+".mp4");
    console.log(randNum);
}


function getRandomNumber(min, max) {
    const randomFraction = Math.random();
    const randomInteger = Math.floor(randomFraction * (max - min + 1)) + min;
    return randomInteger;
}








// window.onload = function () 
// };
