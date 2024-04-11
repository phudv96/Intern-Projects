let testArray=[1,2,3,4,5,6];
let testArraySquared=testArray.map(square);
testArray.forEach(cube);
function cube(element, index, array){
    array[index]=Math.pow(element, 3);
}

function square(element){
    return Math.pow(element,2);
}
let string = "Hi, my name is Hiep";
let part = string
setTimeout(document.getElementById("emptySpace").textContent=part, 3000);
document.getElementById("emptySpaceTwo").textContent=testArraySquared;