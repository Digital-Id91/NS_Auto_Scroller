let isScrolling = false; // Variable to track the scrolling state

// Get the button element
const toggleButton = document.getElementById("toggleButton");

// Set initial button text based on stored state
chrome.storage.local.get(["isScrolling", "scrollSpeed", "scrollDelay", "pauseAtBottom", "pauseAtTop"], (result) => {
  isScrolling = result.isScrolling || false;
  toggleButton.textContent = isScrolling ? "Turn Off" : "Turn On";

  // Set the input fields to the saved values or defaults
  document.getElementById("scrollSpeed").value = result.scrollSpeed || 0.5;
  document.getElementById("scrollDelay").value = result.scrollDelay || 25;
  document.getElementById("pauseAtBottom").value = result.pauseAtBottom || 3000;
  document.getElementById("pauseAtTop").value = result.pauseAtTop || 2000;
});

// Toggle scrolling on button click
toggleButton.addEventListener("click", () => {
  isScrolling = !isScrolling;
  toggleButton.textContent = isScrolling ? "Turn Off" : "Turn On";

  // Get the values from input fields
  const scrollSpeed = parseFloat(document.getElementById("scrollSpeed").value);
  const scrollDelay = parseInt(document.getElementById("scrollDelay").value);
  const pauseAtBottom = parseInt(document.getElementById("pauseAtBottom").value);
  const pauseAtTop = parseInt(document.getElementById("pauseAtTop").value);

  // Store the current state and settings
  chrome.storage.local.set({ isScrolling, scrollSpeed, scrollDelay, pauseAtBottom, pauseAtTop });

  // Send a message to the content script with the new settings
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { isScrolling, scrollSpeed, scrollDelay, pauseAtBottom, pauseAtTop });
  });
});
