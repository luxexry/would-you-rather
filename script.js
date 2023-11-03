// Attach an event listener to the document
var d = 1;
var x = 0;
var audioElement = document.getElementById("audioElement"); // Define the audio element

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
    var or_text = document.getElementById("or-text");

    // Check if the element exists
    if (element) {
      // Change the id of the element to the random number
      if (d === 1) {
        element.innerHTML = d;
        d = 2;
        applyAnimation('image1', 'animate');

        applyAnimation('line', 'colorLine');
        or_text.style.fontSize = "x-large";
        or_text.innerHTML = "⌛";
        applyAnimation('or-text', 'rotatetheOR');

        PlayAudio("Would you rather be able to go crazy or be insanse");

        // Add an "ended" event listener to the text-to-speech audio
        audioElement.addEventListener("ended", function () {
          // When the text-to-speech audio has finished playing, play the clock audio
          PlayUtilityAudio("clock.mp3");
        });
      } else if (d === 2) {
        element.innerHTML = d;
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
  // Make a POST request to the server running on port 3000 to convert the text to speech
  fetch('http://localhost:3000/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      // Create a Blob URL from the audio data
      const audioURL = URL.createObjectURL(blob);

      if (audioElement) {
        // I want you to print the audioURL to a file called Log.txt
        audioElement.src = audioURL;
        audioElement.play();
      } else {
        console.log('Audio element not found');
      }
    })
    .catch((error) => {
      console.error('Error playing audio:', error);
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

function updateVoteOverlay() {
  fetch('statements.json') // Fetch the statements JSON file
    .then(function (response) {
      return response.json();
    })
    .then(function (statementsData) {
      statementsData.forEach(function (item) {
        var voteOverlayElement = document.querySelector('#option' + item.id + ' .vote-overlay');

        if (voteOverlayElement && item.votes) {
          voteOverlayElement.textContent = 'Votes: ' + item.votes + '%';
        }
      });
    })
    .catch(function (error) {
      console.error('Error fetching vote data:', error);
    });
}

// Call the function to populate the HTML with JSON data
populateHTMLWithJSON();
updateVoteOverlay();
