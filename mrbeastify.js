const processedThumbnails = []
const failedThumbnails = []

function applyOverlayToThumbnails() {
    // Define the function to apply the overlay
    function applyOverlay(thumbnailElement, overlayImageUrl) {
        // Create a new img element for the overlay
        const overlayImage = document.createElement('img');
        overlayImage.src = overlayImageUrl;
        overlayImage.style.position = 'absolute';
        overlayImage.style.top = '0';
        overlayImage.style.width = '100%';
        overlayImage.style.height = '100%';

        // Append the overlay to the parent of the thumbnail
        thumbnailElement.parentElement.appendChild(overlayImage);
    }

    // Get overlay image URL from your directory
    
    // Query all YouTube video thumbnails on the page
    const thumbnailElements = document.querySelectorAll('#thumbnail');
    
    // Apply overlay to each thumbnail
    thumbnailElements.forEach((thumbnailElement) => {
        if (!processedThumbnails.includes(thumbnailElement)) {
            const overlayImageUrl = getRandomImageFromDirectory();
            applyOverlay(thumbnailElement, overlayImageUrl);
            processedThumbnails.push(thumbnailElement);
        }
    });
}

// Get a random image URL from a directory
function getRandomImageFromDirectory() {
    const images = ['1.png', '2.png', '3.png', '4.png'];
    const randomIndex = Math.floor(Math.random() * images.length);
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      // Chrome or Edge
      return chrome.runtime.getURL('images/' + images[randomIndex]);
    } else if (typeof browser !== 'undefined' && browser.extension && browser.extension.getURL) {
      // Firefox
      return browser.extension.getURL('images/' + images[randomIndex]);
    }
  }
  

setInterval(function () {
    // fetchAndModifyThumbnails();
    applyOverlayToThumbnails()
}, 1000);

console.log("MrBeastify Loaded Successfully");