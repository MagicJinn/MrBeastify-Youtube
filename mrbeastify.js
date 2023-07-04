const imagesPath = "images/";
const images = [];

// Apply the overlay
function applyOverlay(thumbnailElement, overlayImageUrl, flip) {
  // Create a new img element for the overlay
  const overlayImage = document.createElement("img");
  overlayImage.src = overlayImageUrl;
  overlayImage.style.position = "absolute";
  overlayImage.style.top = "0";
  overlayImage.style.left = "0";
  overlayImage.style.width = "100%";
  overlayImage.style.height = "100%";
  overlayImage.style.zIndex = "0"; // Ensure overlay is on top

  if (flip) {
    overlayImage.style.transform = "scaleX(-1)"; // Flip the image horizontally
  }

  // Style the thumbnailElement to handle absolute positioning
  thumbnailElement.style.position = "relative";

  // Append the overlay to the parent of the thumbnail
  thumbnailElement.parentElement.appendChild(overlayImage);
  thumbnailElement.classList.add("processed");
}

// Looks for all thumbnails and applies overlay
function applyOverlayToThumbnails() {
  // Query all YouTube video thumbnails on the page that haven't been processed yet, and also ignores shorts thumbnails
  const elementQuery =
    "ytd-thumbnail:not(.ytd-rich-grid-slim-media) > a > yt-image > img.yt-core-image:not(.processed):not(.yt-core-attributed-string__image-element)";
  const thumbnailElements = document.querySelectorAll(elementQuery);

  // Apply overlay to each thumbnail
  thumbnailElements.forEach((thumbnailElement) => {
    // Apply overlay and add to processed thumbnails
    let loops = Math.random() > 0.001 ? 1 : 20; // Easter egg
    for (let i = 0; i < loops; i++) {
      // Get overlay image URL from your directory
      const overlayImageUrl = getRandomImageFromDirectory();
      const flip = Math.random() < 0.25; // 25% chance to flip the image
      applyOverlay(thumbnailElement, overlayImageUrl, flip);
    }
  });
}

function checkImageExistence(index = 1) { // Checks for all images in the images folder instead of using a preset array, making the extension infinitely scalable
  const testedURL = chrome.runtime.getURL(`${imagesPath}${index}.png`);
  fetch(testedURL).then(response => {
    if (response.status === 200) {
      // Image exists, add it to the images array
      images.push(testedURL);
      // Check the next image in the directory
      checkImageExistence(index + 1);
    }
  }).catch(error => {
    setInterval(applyOverlayToThumbnails, 100);
    console.log("MrBeastify Loaded Successfully, " + (index - 1) + " images detected.");
  });
}


checkImageExistence();


// Get a random image URL from a directory
function getRandomImageFromDirectory() {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}