const display = document.getElementById("displayScreen");

function pushToDisplay(input){
    display.value += input;
}

function deleteButt(){
    const currentValue=display.value;
    const updatedValue=currentValue.slice(0,-1);
    display.value=updatedValue;
}

function clearDisplay(){
    display.value="";
}
function calculate(){
    try{
    display.value=eval(display.value);
    }
    catch(error){
        display.value="ERROR";
    }
}


