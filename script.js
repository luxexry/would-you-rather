// Attach an event listener to the document
var d = 1;
var x = 0;
var i = 0;
var audioElement = document.getElementById("audioElement");

var statements = []; // Store the statements from the JSON file

console.log(statements);

// Function to play the next audio in the queue
function playNextAudio() {
  if (statements.length > 0) {
    var nextStatement = statements.shift(); // Get and remove the first statement from the array
    PlayAudio("Would you rather " + nextStatement.statement);
  }
}

function toggleVoteOverlay() {
  const elements = document.querySelectorAll('.vote-overlay');
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.toggle('hide');
  }
}

document.addEventListener("keydown", function (event) {
  // Check if the key pressed was "f"
  if (event.key === "f") {
    toggleVoteOverlay();
    // Get the element with id "text2"
    var element = document.getElementById("text2");
    var or_text = document.getElementById("or-text");

    // Check if the element exists
    if (element) {
      // Change the id of the element to the random number
      if (d === 1) {
        d = 2;
        applyAnimation('image1', 'animate');

        applyAnimation('line', 'colorLine');
        or_text.style.fontSize = "x-large";
        or_text.innerHTML = "⌛";
        applyAnimation('or-text', 'rotatetheOR');

        playNextAudio();

        // Add an "ended" event listener to the text-to-speech audio
        audioElement.addEventListener("ended", function () {
          // When the text-to-speech audio has finished playing, play the clock audio
          PlayUtilityAudio("clock.mp3");
        });
      } else if (d === 2) {
        d = 1;
        removeAnimation('image1', 'animate');

        or_text.style.fontSize = "medium";
        or_text.innerHTML = "OR";
        removeAnimation('line', 'colorLine');
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

function PlayAudio(text) {
  return new Promise(function (resolve, reject) {
    fetch('http://localhost:3000/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const audioURL = URL.createObjectURL(blob);

        if (audioElement) {
          audioElement.src = audioURL;
          audioElement.play();
          audioElement.addEventListener("ended", function () {
            resolve(); // Resolve the promise when audio has finished playing
          });
        } else {
          console.log('Audio element not found');
          reject('Audio element not found');
        }
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
        reject(error);
      });
  });
}

function PlayUtilityAudio(path) {
  if (audioElement) {
    audioElement.src = "Audios/" + path;
    audioElement.play();
  } else {
    console.log('Audio element not found');
  }
}

function PauseAudio() {
  if (audioElement) {
    audioElement.pause();
  } else {
    console.log('Audio element not found');
  }
}

function StopAudio() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0; // Reset the audio to the beginning
  } else {
    console.log('Audio element not found');
  }
}

// Function to fetch and populate the HTML elements with JSON data
function populateHTMLWithJSON(id) {
  fetch('statements.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonData) {
      const item = jsonData.find(item => item.id === id);
      statements = jsonData; // Store the statements in the global variable
      if (item) {
        var imageElement1 = document.getElementById("image1");
        var imageElement2 = document.getElementById("image2");
        var textElement1 = document.getElementById("text1");
        var textElement2 = document.getElementById("text2");

        if (imageElement1) {
          console.log("FOUND IMAGE 1");
          imageElement1.src = item.imagePath1;
        }

        if (imageElement2) {
          console.log("FOUND IMAGE 2");
          imageElement2.src = item.imagePath2;
        }

        const statement = item.statement;
        console.log(
          'Item with ID ' + id + ' found in JSON. Statement: ' + statement);
        const sentences = statement.split(" or ");
        for (let i = 0; i < sentences.length; i++) {
          sentences[i] = sentences[i].trim();
        }
          
        if (sentences.length === 2) {
          if (textElement1) {
            console.log("FOUND TEXT 1");
            textElement1.textContent = sentences[0];
          }
          if (textElement2) {
            console.log("FOUND TEXT 2");
            textElement2.textContent = sentences[1];
          }
        }
      } else {
        console.error('Item with ID ' + id + ' not found in JSON.');
      }
    }) 
    .catch(function (error) {
      console.error('Error fetching data:', error);
    });
}

function updateVoteOverlay(id) {
  fetch('statements.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (statementsData) {
      const item = statementsData.find(item => item.id === id);
      if (item) {
        var voteOverlayElement1 = document.querySelector('#option1' + ' .vote-overlay');
        var voteOverlayElement2 = document.querySelector('#option2' + ' .vote-overlay');

        if (voteOverlayElement1 && voteOverlayElement2) {
          voteOverlayElement1.textContent = 'Votes:' + item.votes1 + '%';
          voteOverlayElement2.textContent = 'Votes:' + item.votes2 + '%';
        }
      } else {
        console.error('Item with ID ' + id + ' not found in JSON.');
      }
    })
    .catch(function (error) {
      console.error('Error fetching vote data:', error);
    });
}
// Call the function to populate the HTML with JSON data
var id = 2;
populateHTMLWithJSON(id);
updateVoteOverlay(id);
