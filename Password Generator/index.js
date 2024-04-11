function generatePassword(){
    const length = document.getElementById("inputLength").value;
    const lower = document.getElementById("lowerCaseCheck");
    const upper = document.getElementById("upperCaseCheck");
    const number = document.getElementById("numberCheck");
    const specialChars = document.getElementById("specialCharsCheck");
    let allowedChars = [];
    let generatedPassword = [];
    const lowerCaseChar = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChar = "0123456789";
    const specialChar = "!@#$%^&*()"
    if (lower.checked){
        allowedChars += lowerCaseChar;
    }
    if (upper.checked){
        allowedChars += upperCaseChar;
    }
    if (number.checked){
        allowedChars += numberChar;
    }
    if (specialChars.checked){
        allowedChars += specialChar;
    }
    for (let i=0; i<=length; i++){
        const randomIndex = Math.floor(Math.random()*allowedChars.length);
        generatedPassword[i]=allowedChars[randomIndex];
    }
    document.getElementById("generatedPassword").textContent=generatedPassword.join("");
    console.log("this is working well");
}