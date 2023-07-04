const imagesPath = "images/";
const images = [];

// Apply the overlay
function applyOverlay(thumbnailElement, overlayImageUrl, flip) {
  // Create a new img element for the overlay
  const overlayImage = document.createElement("img");
  overlayImage.classList = "mr-beast";
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
}

// Looks for all thumbnails and applies overlay
function applyOverlayToThumbnails() {
  // Query all YouTube video thumbnails on the page that haven't been processed yet
  // ignores shorts thumbnails and thumbnails that already have a mr beast on them
  const elementQuery =
    "ytd-thumbnail.ytd-rich-grid-media:not(.ytd-video-preview) > a > yt-image:not(:has(img.mr-beast)) > img.yt-core-image:not(.yt-core-attributed-string__image-element)";
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

function checkImageExistence(index) {
  const testedURL = chrome.runtime.getURL(`${imagesPath}${index}.png`);
  fetch(testedURL).then((response) => {
    if (response.status === 200) {
      // Image exists, add it to the images array
      images.push(testedURL);
      // Check the next image in the directory
      checkImageExistence(index + 1);
    }
  });
}

// Get a random image URL from a directory
function getRandomImageFromDirectory() {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

// Checks for all images in the images folder instead of using a preset array, making the extension infinitely scalable
let imageIndex = 1;
checkImageExistence(imageIndex);

setInterval(function () {
  applyOverlayToThumbnails();
}, 500);

console.log("MrBeastify Loaded Successfully");
