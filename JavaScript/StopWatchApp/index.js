const timeDisplay = document.getElementById("display"); 

let isRunning = false;
let startTime=0;
let elapsedTime=0;

function start(){
    if (!isRunning){
        startTime=Date.now()-elapsedTime;
        isRunning = true;
        timer=setInterval(update, 60);
    }
}
function stop(){
    if (isRunning){
        clearInterval(timer);
        elapsedTime = Date.now()-startTime;
        isRunning=false;
    }

}
function reset(){
    clearInterval(timer);
    elapsedTime=0;
    startTime=Date.now();
    if(isRunning){
        isRunning=false;
        start();
    }
    else{
        update();
    }
}

function update(){
    const currentTime=Date.now();
    elapsedTime= currentTime - startTime;
    const milisecond=(elapsedTime%1000).toString().slice(0,2).padStart(2,'0');
    const second=Math.floor((elapsedTime%(1000*60))/1000).toString().padStart(2,'0');
    const minute = Math.floor((elapsedTime%(1000*60*60))/(1000*60)).toString().padStart(2,'0');
    const hour = Math.floor(elapsedTime/(1000*60*60)).toString().padStart(2,'0');
    const displayedTime = `${hour}:${minute}:${second}:${milisecond}`;
    timeDisplay.textContent=displayedTime;
}