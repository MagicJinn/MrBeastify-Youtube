const imagesPath = "images/";
const images = [];

var isEnabled = false;
var facecamElement = null;

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
}

// Looks for all thumbnails and applies overlay
function applyOverlayToThumbnails() {
  if (!isEnabled) {
    return;
  }
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

// Get a random image URL from a directory
function getRandomImageFromDirectory() {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

// Checks for all images in the images folder instead of using a preset array, making the extension infinitely scalable
function checkImageExistence(index = 1) {
  const testedURL = chrome.runtime.getURL(`${imagesPath}${index}.png`);
  fetch(testedURL)
    .then((response) => {
      // Image exists, add it to the images array
      images.push(testedURL);
      // Check the next image in the directory
      checkImageExistence(index + 1);
    })
    .catch((error) => { // The function encountered a missing image. Start applying overlays
      setInterval(applyOverlayToThumbnails, 100);
      console.log(
        "Papaplattify Loaded Successfully, " + (index - 1) + " images detected."
      );
    });
}


// replace various elements
function replaceElements() {
  if (isEnabled) {
    replaceChannelNames();
    replaceTitles();
    replaceAvatars();
    replaceVideoTitle();
  }
}

function replaceChannelNames() {
  const elementQuery = "ytd-channel-name a";
  const channelNameElements = document.querySelectorAll(elementQuery);
  channelNameElements.forEach((channelNameElement) => {
    channelNameElement.innerHTML = 'Domo';
  })
}

function replaceTitles() {
  const elementQuery = "#video-title";
  const titleElements = document.querySelectorAll(elementQuery);
  titleElements.forEach((titleElement) => {
    if (titleElement.getAttribute("aria-label") === null) {
      titleElement.setAttribute("aria-label", titleElement.innerHTML)
    }
    titleElement.innerHTML = 'Papaplatte reagiert auf "' + titleElement.getAttribute("aria-label") + '"';
  })
}

function replaceAvatars() {
  const elementQuery = "#channel-thumbnail img, #avatar > img";
  const avatarElements = document.querySelectorAll(elementQuery);
  avatarElements.forEach((avatarElement) => {
    avatarElement.src = 'https://yt3.googleusercontent.com/ytc/AOPolaQka2LVeiBI_JbXJi0TjlY82pkLJiPAGFtemPF0=s176-c-k-c0x00ffffff-no-rj';
    avatarElement.style.visibility = 'visible';
  })
}

function addFacecam() {
  if (!isEnabled) {
    return;
  }

  const elementQuery = ".html5-video-container:not(:has(img))";
  const videoElement = document.querySelector(elementQuery);

  if (videoElement == null) {
    return;
  }

  videoElement.style.height = "100%";

  facecamElement = document.createElement("img");
  facecamElement.src = chrome.runtime.getURL('facecam.png');
  facecamElement.style.position = "absolute";

  facecamElement.style.width = "20%";
  facecamElement.style.zIndex = "0"; // Ensure overlay is on top

  positionFacecam();

  videoElement.style.position = "relative";

  videoElement.appendChild(facecamElement);
}

function positionFacecam() {
  if (!isEnabled) {
    return;
  }

  if (Math.random() >= 0.5) {
    facecamElement.style.left = "0";
    facecamElement.style.right = "auto";
  } else {
    facecamElement.style.right = "0";
    facecamElement.style.left = "auto";
  }

  if (Math.random() >= 0.5) {
    facecamElement.style.top = "0";
    facecamElement.style.bottom = "auto";
  } else {
    facecamElement.style.bottom = "0";
    facecamElement.style.top = "auto";
  }

}

function replaceVideoTitle(){
  const elementQuery = "#title h1:not(:has(p))";
  const titleElement = document.querySelector(elementQuery);

  if(titleElement == null){
    return;
  }

  titleElement.style.display = 'flex'

  const front = document.createElement("p")
  front.innerHTML = 'Papaplatte reagiert auf "';
  titleElement.prepend(front)

  const last = document.createElement("p")
  last.innerHTML = '"';
  titleElement.appendChild(last)
}

replaceVideoTitle()

checkImageExistence();
setInterval(replaceElements, 100);

setInterval(addFacecam, 100);

chrome.runtime.sendMessage({ action: 'getPapaplattify' }, function (response) {
  this.isEnabled = response.value;
});

