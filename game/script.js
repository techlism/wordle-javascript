'use strict'

const resultDiv = document.querySelector('.result');
let score = 0 ;
const restartButton = document.querySelector('button');
const forms = document.querySelectorAll('.wordle-form');
const scoreArea = document.querySelector('.scoreArea');

function getRandomNumber() {
    return Math.floor(Math.random() * 5757) + 1;
}
  
function getWord() {
    return new Promise((resolve, reject) => {
        fetch('words.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n'); // Split the text into an array of lines
            const lineNumber = getRandomNumber(); // Specify the line number you want to retrieve

            if (lineNumber >= 1 && lineNumber <= lines.length) {
            const desiredLine = lines[lineNumber - 1];
            resolve(desiredLine);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

// Function to reset the game state
const resetGame = (forms) => {
    // Clear the input fields and background colors
    for (let f = 0; f < forms.length; f++) {
        const inputs = forms[f].querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        input.value = '';
        input.style.backgroundColor = '';
        input.style.color="black";
        }
    }
    const nextRowInputs = forms[0].querySelectorAll('input');
    nextRowInputs[0].focus();
    resultDiv.style.visibility="collapse";
}

const compareWords = (word,inputWord,inputs)=>{
    let totalGreens = 0;
    word=word.toUpperCase();
    inputWord=inputWord.toUpperCase();
    for (let j = 0; j < inputWord.length; j++) {
        if (word.includes(inputWord[j]) && inputWord[j] === word[j]) {
            inputs[j].style.backgroundColor = '#00ac06';
            totalGreens++;
        } 
        else if (word.includes(inputWord[j]) && inputWord[j] !== word[j]) {
            inputs[j].style.backgroundColor = '#ffb405';
        } 
        else {
            inputs[j].style.backgroundColor = '#484848';
        }
        inputs[j].style.color="#fff";
    }
    return totalGreens;    
}

const startGame = function (forms) {
    let word = ''; // Store the generated word
  
    // Helper function to generate the word if needed
    const generateWord = async () => {
      if (!word) {
        try {
          word = await getWord(); // Fetch the word
          word = word.toUpperCase(); // Convert to uppercase
        } catch (error) {
          console.error(error);
        }
      }
    };
    
    for (let f = 0; f < forms.length; f++) {
      
        let inputWord = '';
        const inputs = forms[f].querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];

            input.addEventListener('input', e => {

                e.target.value = e.target.value.toUpperCase();
                const value = e.target.value;
                if (value.length === 1) {
                    inputWord += value;
                    if (i < inputs.length - 1) {
                        inputs[i + 1].focus(); // Move focus to the next input field
                    }
                }
                else if(value.length > 1){
                    e.target.value=e.target.value.slice(0,1);
                }
            
            });

            input.addEventListener('keydown',event=>{
                    if (event.key === 'Backspace' && input.value.length === 0 && i > 0) {
                    inputs[i - 1].focus(); // Move focus to the previous input field
                    inputWord = inputWord.slice(0, -1); // Remove the last character from the input word
                    }

                    if(event.key==='Enter' && inputWord.length===5){                        
                        generateWord().then(()=>{
                            const totalGreens =  compareWords(word,inputWord,inputs);
                            if(totalGreens===5){
                                //Need to restart the game (except updating the score).
                                score+=totalGreens;
                                scoreArea.textContent=`Score : ${score}`;
                                setTimeout(() => {
                                    resetGame(forms,inputs);
                                    startGame(forms);                                                        
                                }, 1300);
                            }
                            else if(totalGreens < 5 && f === forms.length -1){
                                // reached to the last and not able to guess (display the right answer and restart the game)
                                resultDiv.textContent=`${word}`;
                                resultDiv.style.visibility="visible";
    
                            }                            
                        });
                        if (f < forms.length - 1) {
                            const nextRowInputs = forms[f + 1].querySelectorAll('input');
                            nextRowInputs[0].focus(); // Move focus to the first input field of the next row
                        }                        
                    }
                })
            }
        }
};

window.addEventListener("DOMContentLoaded", () => {
    startGame(forms);
});

restartButton.addEventListener('click',()=>{
    resetGame(forms);
    startGame(forms);
});
  
