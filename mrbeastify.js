const imagesPath = "images/";
var useAlternativeImages
var flipBlacklist

// Apply the overlay
function applyOverlay(thumbnailElement, overlayImageURL, flip = false) {
  if (thumbnailElement.nodeName == "IMG") {
    // Create a new img element for the overlay
    const overlayImage = document.createElement("img");
    overlayImage.src = overlayImageURL;
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
    thumbnailElement.parentElement.appendChild(overlayImage);
  } else if (thumbnailElement.nodeName == "DIV") {
    thumbnailElement.style.backgroundImage = `url("${overlayImageURL}"), ` + thumbnailElement.style.backgroundImage;
  }
};

// Looks for all thumbnails and applies overlay
function applyOverlayToThumbnails() {
  // Query all YouTube video thumbnails on the page that haven't been processed yet
  // (ignores shorts thumbnails)
  const elementQueryThumbnail =
    "ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element),.ytp-videowall-still-image:not([style*='extension:'])";
  const thumbnailElements = document.querySelectorAll(elementQueryThumbnail);

  // Apply overlay to each thumbnail
  thumbnailElements.forEach((thumbnailElement) => {
    // Apply overlay and add to processed thumbnails
    let loops = Math.random() > 0.001 ? 1 : 20; // Easter egg

    for (let i = 0; i < loops; i++) {
      // Get overlay image URL from your directory
      const overlayImageIndex = getRandomImageFromDirectory();
      let flip = Math.random() < 0.25; // 25% chance to flip the image
      let overlayImageURL
      if (flipBlacklist && flip && flipBlacklist.includes(overlayImageIndex)) {
        if (useAlternativeImages) {
          overlayImageURL = getImageURL(`textFlipped/${overlayImageIndex}`);
          flip = false;
        } else {
          overlayImageURL = getImageURL(overlayImageIndex);
          flip = false;
        }
      } else {
        overlayImageURL = getImageURL(overlayImageIndex);
      }
      applyOverlay(thumbnailElement, overlayImageURL, flip);
    }
  });
}

// Get the URL of an image
function getImageURL(index) {
  return chrome.runtime.getURL(`${imagesPath}${index}.png`);
}

// Defines the N size of last images that will not be repeated.
const size_of_non_repeat = 8
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

  return randomIndex
}

// Checks if an image exists in the image folder
async function checkImageExistence(index) {
  const testedURL = getImageURL(index)

  return fetch(testedURL)
    .then(() => {
      return true
    }).catch(error => {
      return false
    })
}

var highestImageIndex;
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
var blacklistStatus

function GetFlipBlocklist() {
  fetch(chrome.runtime.getURL(`${imagesPath}flip_blacklist.json`))
    .then(response => response.json())
    .then(data => {
      useAlternativeImages = data.useAlternativeImages;
      flipBlacklist = data.blacklistedImages;

      blacklistStatus = "Flip blacklist found. " + (useAlternativeImages ? "Images will be substituted." : "Images won't be flipped.")
    })
    .catch((error) => {
      blacklistStatus = "No flip blacklist found. Proceeding without it."
    });
}

GetFlipBlocklist()

getHighestImageIndex()
  .then(() => {
    setInterval(applyOverlayToThumbnails, 100);
    console.log(
      "MrBeastify Loaded Successfully, " + highestImageIndex + " images detected. " + blacklistStatus
    );
  })