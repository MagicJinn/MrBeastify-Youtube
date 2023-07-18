const imagesPath = "images/";

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
  overlayImage.style.zIndex = "0"; // Ensure overlay is on top but below the time indicator
  if (flip) {
    overlayImage.style.transform = "scaleX(-1)"; // Flip the image horizontally
  }
  thumbnailElement.style.position = "relative"; // Style the thumbnailElement to handle absolute positioning

  // Append the overlay to the parent of the thumbnail
  thumbnailElement.parentElement.appendChild(overlayImage);
}

// Looks for all thumbnails and applies overlay
function applyOverlayToThumbnails() {
  // Query all YouTube video thumbnails on the page that haven't been processed yet
  // (ignores shorts thumbnails)
  const elementQuery =
    "ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element)";
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

// Get the URL of an image
function getImageURL(index) {
  return chrome.runtime.getURL(`${imagesPath}${index}.png`);
}

// Defines the N size of last images that will not be repeated.
const size_of_non_repeat = 10
// List of the index of the last N selected images.
const last_indexes = Array(size_of_non_repeat)

// Get a random image URL from a directory
function getRandomImageFromDirectory() {
  let randomIndex = -1

  // It selects a random index until it finds one that is not repeated
  while (last_indexes.includes(randomIndex) || randomIndex < 0) {
    randomIndex = Math.floor(Math.random() * highestImageIndex) + 1;
  }

  // When it finds the non repeating index, it eliminates the oldest value,
  // and pushes the current index.  
  last_indexes.shift()
  last_indexes.push(randomIndex)

  return getImageURL(randomIndex);
}

// Checks if an image exists in the image folder
async function checkImageExistence(index = 1) {
  const testedURL = getImageURL(index)

  try {
    // See if the image exists
    await fetch(testedURL);
    return true // Image exists
  } catch {
    return false // Image does not exist
  }
}

let highestImageIndex;
// Gets the highest index of an image in the image folder starting from 1
async function getHighestImageIndex() {
  // Avoid exponential search for smaller values
  let i = 4;

  // Increase i until i is greater than the number of images
  while (await checkImageExistence(i)) {
    i *= 2;
  }

  // Possible min and max values
  let min = i <= 4 ? 1 : i / 2;
  let max = i;

  // Binary search
  while (min <= max) {
    // Find the midpoint of possible max and min
    let mid = Math.floor((min + max) / 2);

    // Check if the midpoint exists
    if (await checkImageExistence(mid)) {
      // If it does, next min to check is one greater
      min = mid + 1;
    } else {
      // If it doesn't, max must be at least one less
      max = mid - 1;
    }
  }

  // Max is the size of the image array
  highestImageIndex = max;
}

getHighestImageIndex()
  .then(() => {
    setInterval(applyOverlayToThumbnails, 100);
    console.log(
      "MrBeastify Loaded Successfully, " + highestImageIndex + " images detected."
    );
  })