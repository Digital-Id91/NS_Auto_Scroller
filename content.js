let scrollInterval;
let scrollingDown = true; // Track the direction of scrolling
let scrollSpeed, scrollDelay, pauseAtBottom, pauseAtTop;

// Function to scroll down and up in a loop
function scrollLoop() {
    const scrollElement = document.querySelector('.uir-list-body-wrapper.scrollarea');

    if (scrollElement) {
        scrollInterval = setInterval(() => {
            if (scrollingDown) {
                scrollElement.scrollBy(0, scrollSpeed); // Scroll down by 'scrollSpeed' pixels
                // If we reach the bottom, change direction and pause
                if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight) {
                    clearInterval(scrollInterval);
                    scrollingDown = false;
                    setTimeout(scrollLoop, pauseAtBottom); // Pause at the bottom
                }
            } else {
                scrollElement.scrollBy(0, -scrollSpeed); // Scroll up by 'scrollSpeed' pixels
                // If we reach the top, change direction and pause
                if (scrollElement.scrollTop <= 0) {
                    clearInterval(scrollInterval);
                    scrollingDown = true;
                    setTimeout(scrollLoop, pauseAtTop); // Pause at the top
                }
            }
        }, scrollDelay); // Adjust the interval delay here to slow down the scrolling
    }
}

// Function to stop scrolling
function stopScrolling() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        console.log("Scrolling stopped.");
    }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.isScrolling) {
        console.log("Starting scroll loop...");
        // Retrieve the updated settings from the request
        scrollSpeed = request.scrollSpeed;
        scrollDelay = request.scrollDelay;
        pauseAtBottom = request.pauseAtBottom;
        pauseAtTop = request.pauseAtTop;
        setTimeout(scrollLoop, 2000); // Initial 2-second pause before starting the scroll
    } else {
        console.log("Stopping scroll loop...");
        stopScrolling();
    }
});

// Automatically start scrolling if it was previously on, using stored settings
chrome.storage.local.get(["isScrolling", "scrollSpeed", "scrollDelay", "pauseAtBottom", "pauseAtTop"], (result) => {
    if (result.isScrolling) {
        scrollSpeed = result.scrollSpeed || 0.5;
        scrollDelay = result.scrollDelay || 25;
        pauseAtBottom = result.pauseAtBottom || 3000;
        pauseAtTop = result.pauseAtTop || 2000;
        setTimeout(scrollLoop, 2000); // Initial 2-second pause before starting the scroll
    }
});
