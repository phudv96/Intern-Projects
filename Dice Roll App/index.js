/*console.log(`Hello`);
console.log(`I love you`);

window.alert(`This is an alert`);
window.alert(`I like pizza`);
*/
function rollDice(){

    const numOfDice = document.getElementById("diceNum").value;
    const diceResult=document.getElementById("diceResult");
    const diceImages=document.getElementById("diceImages");
    const values=[];
    const Images=[];

    for(let i=1; i<=numOfDice; i++){
        const value = Math.floor(Math.random()*(6-1+1)+1);
        values.push(value);
        Images.push(`<img src="dice_image/${value}.png">`);
    }
    diceResult.textContent=`dice: ${values.join(', ')}`;
    diceImages.innerHTML = Images.join('');
}
