// Attach an event listener to the document
import { textToSpeech } from './AI.js';

var d = 1;
var x = 0;

document.addEventListener("keydown", function (event) {
    // Check if the key pressed was "f"
    if (event.key === "f") { 
      let elements = document.querySelectorAll('.vote-overlay');
      // Loop over each element
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.toggle('hide');
      }
      // Get the element with id "text2"
      var element = document.getElementById("text2");
      var or_text = document.getElementById("or-text")
  
      // Check if the element exists
      if (element) {
        // Change the id of the element to the random number
        if(d === 1)
        {
          element.innerHTML = d;
          d = 2;
          //applyAnimation('image1', 'animate');
          applyAnimation('image1', 'zigzag');
          applyAnimation('line', 'colorLine')
          or_text.style.fontSize = "x-large";
          or_text.innerHTML = "⌛"
          applyAnimation('or-text', 'rotatetheOR');

          PlayAudio("AI.mp3");
        } else if(d === 2)
        {
          element.innerHTML = d;
          d = 1;
          //removeAnimation('image1', 'animate');
          removeAnimation('image1', 'zigzag');
          or_text.style.fontSize = "medium";
          or_text.innerHTML = "OR"
          removeAnimation('line', 'colorLine')
          removeAnimation('or-text', 'rotatetheOR');

          StopAudio();
        }
        
      } else {
        console.log('Element with id "option2" does not exist');
      }
    }
});

function applyAnimation(itemID, animation) {
  var element = document.getElementById(itemID);
  if (element) {
    element.classList.add(animation);
  } else {
    console.log('Element with id "image1" does not exist');
  }
}

function removeAnimation(itemID, animation) {
  var element = document.getElementById(itemID);
  if (element) {
    element.classList.remove(animation);
  } else {
    console.log('Element with id "image1" does not exist');
  }
}

function PlayAudio(fileName) {
  var audioElement = document.getElementById("audioElement");
  if (audioElement) {
    audioElement.src = fileName ? fileName : "Audios/clock.mp3"; // Set the audio source to the provided file
    audioElement.play();
  } else {
    console.log('Audio element not found');
  }
}

function StopAudio() {
  var audioElement = document.getElementById("audioElement");
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0; // Reset the audio to the beginning
  } else {
    console.log('Audio element not found');
  }
}

// Function to fetch and populate the HTML elements with JSON data
function populateHTMLWithJSON() {
  fetch('statements.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonData) {
      jsonData.forEach(function (item) {
        var imageElement = document.getElementById("image" + item.id);
        var textElement = document.getElementById("text" + item.id);

        if (imageElement) {
          imageElement.src = item.imagePath;
        }

        if (textElement) {
          textElement.textContent = item.statement;
        }
      });
    })
    .catch(function (error) {
      console.error('Error fetching data:', error);
    });
}

// Call the function to populate the HTML with JSON data
populateHTMLWithJSON();