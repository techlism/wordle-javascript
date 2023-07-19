'use strict'

const resultDiv = document.querySelector('.result');
let score = 0 ;
const restartButton = document.querySelector('button');
const forms = document.querySelectorAll('.wordle-form');
const scoreArea = document.querySelector('.scoreArea');
const apiUrl = "https://wordle-letters.onrender.com/random-word";


const getWord = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        redirect: 'follow'
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch random word');
      }
  
      const data = await response.json();
      return data.word;
    } catch (error) {
      console.error('Error fetching random word:', error.message);
      throw error;
    }
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

const compareWords = (word, inputWord, inputs) => {
    let totalGreens = 0;  
    for (let j = 0; j < inputs.length; j++) {
      const input = inputs[j];
      const char = inputWord[j];
  
      if (j >= inputWord.length) {
        // Clear the background color if the inputWord is shorter than the inputs
        input.style.backgroundColor = '';
        input.style.color = 'black';
      } 
      else if (word.includes(char) && char === word[j]) {
        input.style.backgroundColor = '#00ac06'; // Green
        totalGreens++;
      } 
      else if (word.includes(char) && char !== word[j]) {
        input.style.backgroundColor = '#ffb405'; // Yellow
      } 
      else {
        input.style.backgroundColor = '#484848'; // Greyish
      }
      input.style.color = '#fff';
    }
    return totalGreens;
};
  
const startGame = async function (forms) {
    try {
        let word = await getWord();
        word = word.toUpperCase();
      
        for (let f = 0; f < forms.length; f++) {
          let inputWord = '';
          const inputs = forms[f].querySelectorAll('input');
          for (let i = 0; i < inputs.length; ++i) {
            const input = inputs[i];
      
            input.addEventListener('input', (e) => {
              e.target.value = e.target.value.toUpperCase();
              const value = e.target.value;
              if (value.length === 1) {
                inputWord += value;
                if (i < inputs.length - 1) {
                  inputs[i + 1].focus(); // Move focus to the next input field
                }
              } else if (value.length > 1) {
                // To restrict the maximum input to 1
                e.target.value = e.target.value.slice(0, 1);
              }
            });
      
            input.addEventListener('keydown', async (event) => {
              if (event.key === 'Backspace' && input.value.length === 0 && i > 0 && i <= 4) {
                inputs[i - 1].focus(); // Move focus to the previous input field
                inputWord = inputWord.slice(0, -1); // Remove the last character from the input word
              }
      
              if (event.key === 'Enter' && inputWord.length > 4 && i >= 4) {
                  // word = await getWord(); // Fetch the word if not already fetched
                  // word = word.toUpperCase(); // Convert to uppercase
                  const totalGreens = compareWords(word, inputWord, inputs);
                  if (totalGreens === 5 || word === inputWord) {
                    // Need to restart the game (except updating the score).
                    score += totalGreens;
                    scoreArea.textContent = `Score : ${score}`;
                    setTimeout(() => {
                      resetGame(forms, inputs);
                      startGame(forms);
                    }, 1300);
                  } else if (totalGreens < 5 && f === forms.length - 1) {
                    // reached to the last and not able to guess (display the right answer and restart the game)
                    resultDiv.textContent = `${word}`;
                    resultDiv.style.visibility = 'visible';
                  }
                if (f < forms.length - 1) {
                  const nextRowInputs = forms[f + 1].querySelectorAll('input');
                  nextRowInputs[0].focus(); // Move focus to the first input field of the next row
                }
              }
            });
          }
        }        
    } 
    catch (error) {
     alert('Error! Please Refresh');   
    }
  }
  

window.addEventListener("DOMContentLoaded", () => {
    startGame(forms);
});

restartButton.addEventListener('click',()=>{
    resetGame(forms);
    startGame(forms);
});
