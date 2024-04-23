let questionData=[];
let optionData=[];
let answerData=[];

const nameSpace = document.getElementById('nameSpace');
const resultContainer = document.getElementById('result');
const questionContainer = document.getElementById('questions');
const optionContainer = document.getElementById('options');
let currentIndex = parseInt(sessionStorage.getItem('currentIndex')) || 0;//using sessionStorage so we won't lose data when switching to another html file
let score = parseInt(sessionStorage.getItem('score')) || 0;
let attempt = parseInt(sessionStorage.getItem('attempt')) || 1;
let incorrectAnswers = JSON.parse(sessionStorage.getItem('incorrectAnswers')) || [];
let currentQuestion = currentIndex < questionData.length ? questionData[currentIndex] : null; //setting defaul data in case index exceed array length
let currentOption = currentIndex < optionData.length ? optionData[currentIndex] : null;
let currentAnswer = currentIndex < answerData.length ? answerData[currentIndex] : null;
let wrongAnswerIndex=0;

//using conditional +  function to check which html page we're on
if (window.location.href.includes('quizSide.html')) {
  (async () =>{await fetchData();
  start();
})();
}
else if(window.location.href.includes('resultSide.html')){
  (async () =>{await fetchData();
    displayResult();
  })();
}

async function fetchData(){//function to fetch data from a json-server and pass it into array
  try{
      const response = await fetch(`http://localhost:3000/data`);
      const data = await response.json();
      if(!response.ok){
          throw new Error ("Could not fetch data");
  }
      else{
          for (let i=0; i < data.length; i++){
          questionData[i]=data[i].question;
          optionData[i]=data[i].options;
          answerData[i]=data[i].answer;
          }
      }
  }
  catch(error){
      console.error(error);
  }
}
//function to start, prompting user to input their name (won't close unless a name is input)
function start(){
    let playerName=sessionStorage.getItem('playerName') || 'Guest';
    while(playerName=="Guest" || playerName==""){
    playerName = window.prompt("Please enter your name");}
    sessionStorage.setItem('playerName', playerName);

    nameSpace.textContent=`${playerName} - Attempt: ${attempt}`;
    nameSpace.style.display="block";
    displayQuestion();
}
//check if user has answered all the question, move onto result if no more questions left.
//checking if the question is multiple choice or input-reliant
function displayQuestion(){
  console.log(`Index: ${currentIndex}, Question length: ${questionData.length}`)
  if (currentIndex >= questionData.length){
    goResult();
  }
  else {
    optionContainer.innerHTML = '';
    questionContainer.textContent = '';
    currentQuestion = questionData[currentIndex];
    currentOption = optionData[currentIndex];
    currentAnswer = answerData[currentIndex];
    questionContainer.textContent=currentQuestion;
    if ((optionData[currentIndex]==null)){ //check if multiple choice or open question
    generateInput();
    }
    else{
    generateOption();
    }
}
}
//generate input field for input-reliant question (no options in array object)
function generateInput(){
  const newOption = document.createElement('input');
  newOption.type='text';  
  newOption.maxLength='40';
  optionContainer.appendChild(newOption);

}
//generate radio buttons for each options in array object
function generateOption(){
  for (let i=0; i<currentOption.length;i++){
    const newOption = document.createElement('input');
    newOption.type='radio';
    newOption.classList.add("option");
    newOption.id='option'+i;
    newOption.name='options';
    newOption.value=currentOption[i];
    
    const optionLabel = document.createElement('label');
    optionLabel.textContent=currentOption[i];
    optionLabel.setAttribute('for', 'option'+i);

    const lineBreak = document.createElement('br');

    optionContainer.appendChild(newOption);
    optionContainer.appendChild(optionLabel);
    optionContainer.appendChild(lineBreak);
}
}
//submit function that check answer + what type it is, give points based on difficulty
//increment the question index to move onto the next question
function submitAction(){
  const checkedRadio = optionContainer.querySelector('input[type="radio"]:checked');
  const textInput = optionContainer.querySelector('input[type="text"]');
  if(checkedRadio !== null|| (textInput !== null && textInput.value.trim() !=='')){//check if there has been an input
    const userAnswer = checkedRadio ? checkedRadio.value : textInput.value;
    if (userAnswer.toLowerCase() === currentAnswer.toLowerCase()) {
      if (textInput) {
        score += 2; // Add 2 points for text input type
      } 
      else if (checkedRadio) {
        score += 1; // Add 1 point for radio input type
      }
    }
    else{
          incorrectAnswers.push({
            wrongAnswer: userAnswer,
            wrongIndex: currentIndex
          });
          console.log(`wrong answer: ${incorrectAnswers[wrongAnswerIndex].wrongAnswer}, 
                      Question index: ${incorrectAnswers[wrongAnswerIndex].wrongIndex}`);
          wrongAnswerIndex++;
      }
    currentIndex ++;
    sessionStorage.setItem('currentIndex', currentIndex); //pushing index to sessionStorage for use later
    sessionStorage.setItem('score', score);
    console.log(`question number: ${currentIndex}`);
    console.log(`score ${score}`);
    sessionStorage.setItem('incorrectAnswers', JSON.stringify(incorrectAnswers));
    displayQuestion();
  }
  else{
    window.alert("You are leaving the answer field empty!");
  }
}
//function to go to the next html file
function goResult(){
  location.href = 'resultSide.html';
}
//function to display question answered + score
function displayResult(){
  document.getElementById('score').textContent=`You answered: ${questionData.length-incorrectAnswers.length}/${questionData.length}
                                                Your score: ${score}`;
                                                console.log(incorrectAnswers);
                                                for (let i=0; i<incorrectAnswers.length; i++){
                                                  const incorrectQuestion = document.createElement('h4');
                                                  incorrectQuestion.textContent=`${i+1}. ${questionData[incorrectAnswers[i].wrongIndex]}`;
                                                  const incorrectAnswer = document.createElement('p');
                                                  incorrectAnswer.textContent=`Your Answer: ${incorrectAnswers[i].wrongAnswer}`;
                                                  const correctAnswer = document.createElement('p');
                                                  correctAnswer.textContent=`Correct Answer: ${answerData[incorrectAnswers[i].wrongIndex]}`;
                                                  resultContainer.appendChild(incorrectQuestion);
                                                  resultContainer.appendChild(incorrectAnswer);
                                                  resultContainer.appendChild(correctAnswer);
                                                }
                                                
}

//function to reset the index, score, increment attempt and go back to the quiz.
function retryAction(){
  sessionStorage.removeItem('currentIndex');
  sessionStorage.removeItem('score');
  sessionStorage.removeItem('incorrectAnswers');
  attempt++;
  sessionStorage.setItem(`attempt`, attempt);
  location.href='quizSide.html';
}
//function to display the questions that were answered wrong + the correct answer.
function showAction(){
  if(window.getComputedStyle(resultContainer).display === 'none'){
    resultContainer.style.display='block';
    document.getElementById('showAnswer').textContent='Hide Wrong Answer';
  }
  else{
    resultContainer.style.display='none';
    document.getElementById('showAnswer').textContent='Show Wrong Answer';
  }
}
