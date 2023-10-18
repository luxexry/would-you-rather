// Attach an event listener to the document
var d = 1;
var x = 0;

function myFunction() {
  
}

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
          applyAnimation();
        } else if(d === 2)
        {
          element.innerHTML = d;
          d = 1;
          removeAnimation();
        }

        // Call applyAnimation after updating the innerHTML
        
        
      } else {
        console.log('Element with id "option2" does not exist');
      }
    }
});

function applyAnimation() {
  var element = document.getElementById('image1');
  if (element) {
    element.classList.add('animate');
  } else {
    console.log('Element with id "image1" does not exist');
  }
}

function removeAnimation() {
  var element = document.getElementById('image1');
  if (element) {
    element.classList.remove('animate');
  } else {
    console.log('Element with id "image1" does not exist');
  }
}
