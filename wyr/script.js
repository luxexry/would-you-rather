// Attach an event listener to the document
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
  
      // Check if the element exists
      if (element) {
        // Change the id of the element to the random number
        if(d === 1)
        {
          element.innerHTML = d;
          d = 2;
          applyAnimation('image1', 'animate');
          applyAnimation('or-text', 'rotatetheOR');
        } else if(d === 2)
        {
          element.innerHTML = d;
          d = 1;
          removeAnimation('image1', 'animate');
          removeAnimation('or-text', 'rotatetheOR');
        }
        
      } else {
        console.log('Element with id "option2" does not exist');
      }
    }
});

function applyAnimation(image, animation) {
  var element = document.getElementById(image);
  if (element) {
    element.classList.add(animation);
  } else {
    console.log('Element with id "image1" does not exist');
  }
}

function removeAnimation(image, animation) {
  var element = document.getElementById(image);
  if (element) {
    element.classList.remove(animation);
  } else {
    console.log('Element with id "image1" does not exist');
  }
}

