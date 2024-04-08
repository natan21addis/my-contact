function toggleNavMenu() {
   var navMenu = document.getElementById("nav-menu");
   var closeIcon = document.getElementById("closeIcon");
   var overlay = document.getElementById("overlay");
   var mainContent = document.getElementsByTagName("body")[0];

   if (navMenu.style.left === "-300px") {
      navMenu.style.left = "0";
      closeIcon.style.display = "block";
      overlay.style.display = "block";
      mainContent.style.marginLeft = "300px"; // Adjust main content margin
   } else {
      navMenu.style.left = "-300px";
      navMenu.style.display = "block";
      closeIcon.style.display = "none";
      overlay.style.display = "none";
      mainContent.style.marginLeft = "0"; // Reset main content margin
   }
}

// Get the header element
const header = document.querySelector("header");

// Get the footer element
const footer = document.querySelector("footer");
/// Listen for scroll events
window.addEventListener("scroll", function () {
   // Calculate the scroll position relative to the entire document height
   const scrollPosition = window.scrollY;
   const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
 
   // Calculate the percentage scrolled
   const scrollPercentage = (scrollPosition / totalHeight) * 100;
 
   // Define the start and end percentages for color change
   const startPercentage = 22; // Start changing color at 10% scrolled
   const endPercentage = 78; // Stop changing color at 90% scrolled
 
   // Adjusting the color change based on scroll percentage
   let colorChangeFactor = 1;
   if (scrollPercentage < startPercentage) {
     colorChangeFactor = 0; // No color change until startPercentage
   } else if (scrollPercentage > endPercentage) {
     colorChangeFactor = 1; // Full color change after endPercentage
   } else {
     colorChangeFactor = (scrollPercentage - startPercentage) / (endPercentage - startPercentage);
   }
 
   // Calculate the color based on the color change factor
   let color = `rgba(255, 255, 255, ${colorChangeFactor.toFixed(2)})`;
 
   // Check if the scroll position is in the footer
   if (scrollPercentage >= endPercentage) {
     color = "rgb(13, 44, 219)"; // Blue color
     header.style.outline = "none"; // Remove outline in the footer
   } else {
     header.style.outline = ""; // Add outline outside the footer
   }
 
   // Apply the calculated color to the header background
   header.style.backgroundColor = color;
 
   // Get all navigation links
   const navLinks = document.querySelectorAll(".nav-link");
 
   // Change color of navigation links
   navLinks.forEach(function(navLink) {
     if (scrollPercentage < endPercentage) {
       navLink.style.color = " #04107a"; // Change color to blue within the specified range
     } else {
       navLink.style.color = `rgba(247, 144, 10, ${colorChangeFactor.toFixed(2)})`; // Change color to yellowish outside the specified range
     }
   });
 });
