const quizData = [
    {
      question: 'Which year did world war 2 start?',
      options: ['1945', '1939', '1909', '1911'],
      answer: '1939',
    },
    {
      question: 'Who is the father of computer science?',
      options: ['Albert Einstein', 'Bill Gates', 'Alan Turing', 'Hideo Kojima'],
      answer: 'Alan Turing',
    },
    {
      question: 'Which country won the FIFA World Cup in 2018?',
      options: ['Brazil', 'Germany', 'France', 'Argentina'],
      answer: 'France',
    },
    {
      question: 'Which computer language is the newest',
      options: ['C#', 'C', 'C++', 'JavaScript'],
      answer: 'C#',
    },
    {
      question: 'Which is the largest ocean on Earth?',
      options: [
        'Pacific Ocean',
        'Indian Ocean',
        'Atlantic Ocean',
        'Arctic Ocean',
      ],
      answer: 'Pacific Ocean',
    },
    {
      question: 'What is the name of the giant Japanese monster who was born by radiation?',
      options: null,
      answer: 'Godzilla',
    },
    {
      question: 'How many bits are in a byte?',
      options: null,
      answer: '8',
    },
    {
      question: 'Which planet was demoted to a dwarf-plant in 2006?',
      options: null,
      answer: 'Pluto',
    },
    {
      question: 'Which video game has the biggest esport scene in 2023?',
      options: null,
      answer: 'League of Legends',
    },
    {
      question: 'Which Greek Demi-god did Disney make a movie about?',
      options: null,
      answer: 'Hercules',
    },
  ];

const nameSpace = document.getElementById('nameSpace');
const resultContainer = document.getElementById('result');
const questionContainer = document.getElementById('questions');
const optionContainer = document.getElementById('options');
//localStorage.clear();
let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;//using localStorage so we won't lose data when switching to another html file
let score = parseInt(localStorage.getItem('score')) || 0;
let attempt = parseInt(localStorage.getItem('attempt')) || 1;
let incorrectAnswers = JSON.parse(localStorage.getItem('incorrectAnswers')) || [];
let currentQuestion = currentIndex < quizData.length ? quizData[currentIndex].question : null; //setting defaul data in case index exceed array length
let currentOption = currentIndex < quizData.length ? quizData[currentIndex].options : null;
let currentAnswer = currentIndex < quizData.length ? quizData[currentIndex].answer : null;
let wrongAnswerIndex=0;

//using conditional +  function to check which html page we're on
if (window.location.href.includes('quizSide.html')) {
  start();
}
else if(window.location.href.includes('resultSide.html')){
  displayResult();
}
//function to start, prompting user to input their name (won't close unless a name is input)
function start(){
    let playerName="Guest";
    while(playerName=="Guest" || playerName==""){
    playerName = window.prompt("Please enter your name");}

    nameSpace.textContent=`${playerName} - Attempt: ${attempt}`;
    nameSpace.style.display="block";
    displayQuestion();
}
//check if user has answered all the question, move onto result if no more questions left.
//checking if the question is multiple choice or input-reliant
function displayQuestion(){
  console.log(`Index: ${currentIndex}, Question length: ${quizData.length}`)
  if (currentIndex >= quizData.length){
    goResult();
  }
  else {
    optionContainer.innerHTML = '';
    questionContainer.textContent = '';
    currentQuestion = quizData[currentIndex].question;
    currentOption = quizData[currentIndex].options;
    currentAnswer = quizData[currentIndex].answer;
    questionContainer.textContent=currentQuestion;
    if ((quizData[currentIndex].options==null)){
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
  if(checkedRadio || textInput){
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
    localStorage.setItem('currentIndex', currentIndex);
    localStorage.setItem('score', score);
    console.log(`question number: ${currentIndex}`);
    console.log(`score ${score}`);
    localStorage.setItem('incorrectAnswers', JSON.stringify(incorrectAnswers));
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
  document.getElementById('score').textContent=`You answered: ${quizData.length-incorrectAnswers.length}/${quizData.length}
                                                Your score: ${score}`;
}

//function to reset the index, score, increment attempt and go back to the quiz.
function retryAction(){
  localStorage.removeItem('currentIndex');
  localStorage.removeItem('score');
  localStorage.removeItem('incorrectAnswers');
  attempt++;
  localStorage.setItem(`attempt`, attempt);
  location.href='quizSide.html';
}
//function to display the questions that were answered wrong + the correct answer.
function showAction(){
  console.log(incorrectAnswers);
  for (let i=0; i<incorrectAnswers.length; i++){
    const incorrectQuestion = document.createElement('h4');
    incorrectQuestion.textContent=`${i+1}. ${quizData[incorrectAnswers[i].wrongIndex].question}`;
    const incorrectAnswer = document.createElement('p');
    incorrectAnswer.textContent=`Your Answer: ${incorrectAnswers[i].wrongAnswer}`;
    const correctAnswer = document.createElement('p');
    correctAnswer.textContent=`Correct Answer: ${quizData[incorrectAnswers[i].wrongIndex].answer}`;
    resultContainer.appendChild(incorrectQuestion);
    resultContainer.appendChild(incorrectAnswer);
    resultContainer.appendChild(correctAnswer);
  }
}