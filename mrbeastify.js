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

// looks for all thumbnails and applies overlay
function applyOverlayToThumbnails() {
  // Query all YouTube video thumbnails on the page that haven"t been processed yet, and also ignores shorts thumbnails
  const elementQuery =
    "ytd-thumbnail:not(.ytd-rich-grid-slim-media) > a > yt-image > img.yt-core-image:not(.processed):not(.yt-core-attributed-string__image-element)";
  const thumbnailElements = document.querySelectorAll(elementQuery);

  // Apply overlay to each thumbnail
  thumbnailElements.forEach((thumbnailElement) => {
    // Apply overlay and add to processed thumbnails
    let loops = Math.random() > 0.001 ? 1 : 20;
    for (let i = 0; i < loops; i++) {
      // Get overlay image URL from your directory
      const overlayImageUrl = getRandomImageFromDirectory();
      const flip = Math.random() < 0.5; // 50% chance to flip the image
      applyOverlay(thumbnailElement, overlayImageUrl, flip);
    }
  });
}

// Get a random image URL from a directory
function getRandomImageFromDirectory() {
  const images = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  if (
    typeof chrome !== "undefined" &&
    chrome.runtime &&
    chrome.runtime.getURL
  ) {
    // Chrome or Edge
    return chrome.runtime.getURL(`${imagesPath}${images[randomIndex]}.png`);
  } else if (
    typeof browser !== "undefined" &&
    browser.extension &&
    browser.extension.getURL
  ) {
    // Firefox
    return browser.extension.getURL(`${imagesPath}${images[randomIndex]}`);
  }
}

setInterval(function () {
  applyOverlayToThumbnails();
}, 100);

console.log("MrBeastify Loaded Successfully");
