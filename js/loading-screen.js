/* This script displays a loading screen while the page loads */
window.addEventListener("DOMContentLoaded", () => {

  const loadingScreen = document.querySelector(".se-pre-con");

  loadingScreen.style.visibility = "hidden";
  loadingScreen.style.opacity = 0;
  loadingScreen.style.transition = "visibility 1.0s 0.5s, opacity 1s linear";

});
