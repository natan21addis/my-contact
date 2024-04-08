// Get the header element
const header = document.querySelector("header");

// Listen for scroll events
window.addEventListener("scroll", function () {
  // Check if the page has been scrolled beyond a certain threshold
  if (window.scrollY > header.offsetHeight) {
    // If scrolled, change the background color of the header
    header.style.backgroundColor = "#0413e0"; // Change to desired color
  } else {
    // If not scrolled, revert back to the default background color
    header.style.backgroundColor = " white "; // Change to default color
  }
});
