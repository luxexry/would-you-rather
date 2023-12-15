var d = 1;
var x = 0;
var i = 0;
var id = 1;
var newID = 1;
var audioElement = document.getElementById("audioElement");

var statements = []; // Store the statements from the JSON file
toggleVoteOverlay();

function hasAnimation(element, animationName) {
  const styles = window.getComputedStyle(element);
  const animations = styles.animationName || styles.webkitAnimationName || '';

  // Split the list of animations into an array
  const animationArray = animations.split(',').map(name => name.trim());

  // Check if the desired animation name is in the array
  return animationArray.includes(animationName);
}

function ConsoleResult(element) {
  const text1Element = document.getElementById(element);
  const hasText1Animation = hasAnimation(text1Element, 'animateText');

  if (hasText1Animation) {
    console.log(element + " element has the animateText animation.");
  } else {
    console.log(element + " element has the animateText animation.");
  }
}

// Function to play the next audio in the queue
function playNextAudio() {
  if (statements.length > 0) {
    var nextStatement = statements.shift(); // Get and remove the first statement from the array
    PlayAudio("Would you rather " + nextStatement.statement);
  }
}

function playAudioById(id) {
  var statement = findStatementById(id);
  if (statement) {
    PlayAudio("Would you rather " + statement.statement);
  }
}

function findStatementById(id) {
  // Assuming statements is an array of objects with an 'id' property
  return statements.find(function (item) {
    return item.id === id;
  });
}

function toggleVoteOverlay() {
  const elements = document.querySelectorAll('.vote-overlay');
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.toggle('hide');
  }
}

async function onEnded() {
  console.log("inside removing event listener");
  applyAnimation('text1', 'animateText');
  applyAnimation('text2', 'animateText');
  applyAnimation('image1', 'animate');
  applyAnimation('image2', 'animate');
  ConsoleResult('text1');
  ConsoleResult('text2');
  playAudioById(newID);
  updateVoteOverlay(newID);
  console.log("Played new audio");
}

function WhooshSound () {
  PlayUtilityAudio("whoosh.mp3");
}

// EventCode function with a promise
function EventCode() {
  var element = document.getElementById("text2");
  var or_text = document.getElementById("or-text");
  return new Promise(async (resolve) => {
    // When the text-to-speech audio has finished playing, play the clock audio
    PlayUtilityAudio("clock.mp3");
    removeAnimation('image1', 'animate');
    removeAnimation('image2', 'animate');
    removeAnimation('text1', 'animateText');
    removeAnimation('text2', 'animateText');

    // Change the text
    or_text.innerHTML = "⌛";
    applyAnimation('or-text', 'rotatetheOR');
    await wait(3000);

    // Change the text again
    PlayUtilityAudio("ding.mp3");
    or_text.innerHTML = "OR";
    removeAnimation('or-text', 'rotatetheOR');

    // End Results
    toggleVoteOverlay();
    await wait(1000);
    StopAudio();
    await wait(3000);

    // Update the HTML with the new ID
    newID++;
    toggleVoteOverlay();
    await wait(400);
    populateHTMLWithJSON(newID);
    console.log("at the end of EventCode function");
    resolve(); // Resolve the promise when EventCode is completed
  });
}

// Modify PlayVideo to return a promise
async function PlayVideo() {
  return new Promise(async (resolve) => {
    var element = document.getElementById("text2");
    var or_text = document.getElementById("or-text");

    applyAnimation('image1', 'animate');
    applyAnimation('image2', 'animate');
    applyAnimation('text1', 'animateText');
    applyAnimation('text2', 'animateText');
    playAudioById(newID);

    // Add an "ended" event listener to the text-to-speech audio
    audioElement.addEventListener("ended", async function() {
      // Call the EventCode function and wait for it to complete
      await EventCode();
      onEnded();
      resolve(); // Resolve the promise when the audio playback and EventCode are completed
    });
  });
}

// Video Compilation
function playVideoWithListener() {
  return new Promise(async (resolve, reject) => {
    try {
      document.addEventListener("keydown", async function (event) {
        // Check if the key pressed was "f"
        if (event.key === "f") {
          document.body.style.cursor = 'none';
          await PlayVideo();
          resolve(); // Resolve the promise when the video is played and the listener is added
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

document.addEventListener("keydown", async function (event) {
  // Check if the key pressed was "r"
  if (event.key === "r") {
    await processImages();
  }
});

// Usage
playVideoWithListener()
  .then(() => {
    console.log("Video played, listener added");
  })
  .catch((error) => {
    console.error("Error:", error);
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

var url = 'https://3000-luxexry-wouldyourather-bl4k4bu9chz.ws-us106.gitpod.io/text-to-speech';

function PlayAudio(text) {
  return new Promise(function (resolve, reject) {
    fetch(url, {
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
        url = 'http://localhost:3000/text-to-speech';
        PlayAudio(text);
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
          imageElement1.src = item.imagePath1;
        }

        if (imageElement2) {
          imageElement2.src = item.imagePath2;
        }

        const statement = item.statement;
        const sentences = statement.split(" or ");
        for (let i = 0; i < sentences.length; i++) {
          sentences[i] = sentences[i].trim();
        }
          
        if (sentences.length === 2) {
          if (textElement1) {
            textElement1.textContent = sentences[0];
          }
          if (textElement2) {
            textElement2.textContent = sentences[1];
          }
        }
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
          voteOverlayElement1.textContent = item.votes1 + '%';
          voteOverlayElement2.textContent = item.votes2 + '%';
          console.log("upadting votes");
          if(item.votes1 > item.votes2) {
            voteOverlayElement1.classList.remove('loser');
            voteOverlayElement1.classList.add('winner');            
            voteOverlayElement2.classList.remove('winner');
          } else {
            voteOverlayElement2.classList.remove('loser');
            voteOverlayElement2.classList.add('winner');
            voteOverlayElement1.classList.remove('winner');
          }
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
populateHTMLWithJSON(id);
updateVoteOverlay(id);

// wait function
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var hoverCounter = 0; // Initialize hoverCounter
var el;
var oldEl;
var AlreadyHovered = true;

function addHoverEffect(elementId) {
  var element = document.getElementById(elementId);

  element.addEventListener('click', function () {
    // Perform actions using the current id
    populateHTMLWithJSON(id);
    updateVoteOverlay(id);

    // Increment id and use modulo to cycle back to 1 if needed
    id = (id % statements.length) + 1;
    console.log("ID: " + id);
  });
  
  element.addEventListener('mouseover', function () {
    var children = this.children;
    for (var i = 0; i < children.length; i++) {
      if (!children[i].classList.contains('vote-overlay')) {
        children[i].classList.add('hovered');
        el = element; option2
      }
    }
  });

  element.addEventListener('mouseout', function () {
    var children = this.children;
    AlreadyHovered = haveRelationship(oldEl, el);
    oldEl = el; option1
    for (var i = 0; i < children.length; i++) {
      if (!children[i].classList.contains('vote-overlay')) {
        children[i].classList.remove('hovered');
      }
    }
  });
}


function haveRelationship(oldElement, newElement) {
  const gameContainer = document.getElementById('game-container');

  if (!oldElement || !newElement) {
      //console.log("One or both elements are undefined.");
      return false;
  }

  if (oldElement === newElement) {
      //console.log("Elements are the same");
      return true; // Same element
  }

  if (oldElement.parentElement === gameContainer || newElement.parentElement === gameContainer) {
      //console.log("game-container is involved");
      return false; // Disregard game-container
  }

  if (oldElement.contains && oldElement.contains(newElement)) {
      //console.log("newElement is a child of oldElement");
      return true;
  }

  if (
      oldElement.parentElement &&
      newElement.parentElement &&
      oldElement.parentElement === newElement.parentElement
  ) {
      return true;
  }

  //console.log("No relationship found");
  return false;
}

function isHovered(element) {
  var children = element.children;
  for (var i = 0; i < children.length; i++) {
    if (!children[i].classList.contains('vote-overlay')) {
      if (children[i].classList.contains('hovered') && AlreadyHovered === false) {
        AlreadyHovered = true;
        return true;
      }
    }
  }
}

setInterval(function () {
  if (isHovered(document.getElementById('option1'))) {
    hoverCounter++;
  } else if (isHovered(document.getElementById('option2'))) {
    hoverCounter++;
  }
  //console.log(hoverCounter);
}, 1000);

// Use the function

addHoverEffect('option1');
addHoverEffect('option2');

// function HoveringALotEffect() {
//   var audio = document.getElementById('audioElement');
//   // Check if hoverCounter is greater than or equal to 10

//   if (hoverCounter >= 10) {
//     if (audio.paused || audio.src.includes("clock.mp3")) {
//       PlayAudio("Bruh, choose one already");
//       hoverCounter = 0;
//       wait(2000);
//     } else {
//       hoverCounter = 0;
//     }
//   }
// }

// setInterval(HoveringALotEffect, 2000);

// Function to check if the image filename contains "-bg"
function hasBackground(imagePath) {
  return imagePath.includes('-bg');
}

// Function to get all image filenames from the "public/Images" folder
function getImageFilenames() {
  const imagesFolder = 'public/Images';

  try {
    const files = fs.readdirSync(imagesFolder);
    return files.filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png'));
  } catch (error) {
    console.error('Error reading image filenames:', error);
    return [];
  }
}

// Updated processImages function to automatically pull images from the folder
async function processImages() {
  try {
    const response = await fetch('/image-filenames');
    console.log(response.body);
    
    if (!response.ok) {
      console.error(`Error fetching image filenames. Status: ${response.status}, ${response.statusText}`);
      return;
    }

    const { imageFilenames } = await response.json();

    for (const imageName of imageFilenames) {
      if (!hasBackground(imageName)) {
        // Image does not have "-bg," send it to the server
        await sendImageToServer(imageName);
      }
    }
  } catch (error) {
    console.error('Error fetching image filenames:', error);
  }
}


var url2 = 'https://3000-luxexry-wouldyourather-bl4k4bu9chz.ws-us106.gitpod.io/removebg'
// Function to send image to the /removebg endpoint
async function sendImageToServer(imageName) {
  const imageUrl = `public/Images/${imageName}`;
  const formData = new FormData();
  formData.append('image', imageUrl);

  try {
    const response = await fetch(url2, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log(`Background removed successfully for ${imageName}`);
    } else {
      const errorBody = await response.json();
      console.error(`Error removing background for ${imageName}:`, errorBody);
    }
  } catch (error) {
    console.error(`Error sending image ${imageName} to server:`, error);
    url = 'http://localhost:3000/removebg';
    sendImageToServer(imageName);
  }
}