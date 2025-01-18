//builds and controls portfolio

const imageList = document.getElementById("imageList");
const selectedWindow = document.querySelector(".selected-window");
const selectedImage = document.getElementById("selectedImage");
const title = document.getElementById("title");
const text = document.getElementById("text");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");

///// BUILD FROM JSON ////

// Get JSON file path from HTML
const jsonPathData = document.getElementById("jsonPath").textContent;
const jsonFilePath = JSON.parse(jsonPathData).file;

let data = { pieces: [] };

// Fetch JSON Data
fetch(jsonFilePath)
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData;
    populateImageList();
    selectPiece(0);
    startAutoCycle(); // Start cycling by default
  })
  .catch(error => console.error("Error loading JSON data:", error));

// Populate the image list
function populateImageList() {
  data.pieces.forEach((piece, index) => {
    const img = document.createElement("img");
    img.src = piece.image;
    img.alt = piece.title;
    img.dataset.index = index;
    img.addEventListener("click", () => {stopAutoCycle(index)}); // Stops auto-cycle on click
    imageList.appendChild(img);
  });

  adjustImageListLayout();
}


/////// SELECTION ////////////

let currentIndex = 0;

// Update the selected piece
function selectPiece(index) {
  currentIndex = index;
  const piece = data.pieces[index];

  // Update main image display
  selectedImage.src = piece.image;
  title.textContent = piece.title;
  text.innerHTML = piece.description;

  resetZoom(); // Reset zoom when switching images

  // Remove 'selected' class from all images
  document.querySelectorAll("#imageList img").forEach(img => img.classList.remove("selected"));

  // Add 'selected' class to the current image
  const selectedThumbnail = document.querySelector(`#imageList img[data-index='${index}']`);
  if (selectedThumbnail) {
    selectedThumbnail.classList.add("selected");
  }
}


///// SELECTION CYCLING //////

let hasInteracted = false; // Track if user has clicked
let autoCycleInterval;

// Auto-cycle slectedimages unless user interacts
function startAutoCycle() {
  if (!hasInteracted) {
    autoCycleInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % data.pieces.length;
      selectPiece(currentIndex);
    }, 4000); // Change every 4 seconds
  }
}

function stopAutoCycle(index = null) {
  if (!hasInteracted) {
    clearInterval(autoCycleInterval);
    hasInteracted = true; // Marks that user has interacted (stopping auto-cycle permanently)
  }
  if (index !== null) {
    selectPiece(index);
  }
}

// Stop cycling when the user **clicks** any interactive element
prevBtn.addEventListener("click", () => stopAutoCycle((currentIndex - 1 + data.pieces.length) % data.pieces.length));
nextBtn.addEventListener("click", () => stopAutoCycle((currentIndex + 1) % data.pieces.length));

zoomInBtn.addEventListener("click", () => stopAutoCycle());
zoomOutBtn.addEventListener("click", () => stopAutoCycle());

selectedImage.addEventListener("wheel", () => stopAutoCycle());
selectedImage.addEventListener("gesturechange", () => stopAutoCycle()); // For touch pinch zoom
selectedImage.addEventListener("mousedown", () => stopAutoCycle());
selectedImage.addEventListener("touchstart", () => stopAutoCycle(), { passive: false });

function adjustImageListLayout() {
  const imageList = document.querySelector(".image-list");
  const images = imageList.querySelectorAll("img");

  if (images.length === 0) return; // Exit if no images

      // Check if screen is in vertical (portrait) mode
  const isVertical = window.innerHeight > window.innerWidth;
  if (isVertical) {
      imageList.classList.remove("centered"); // Ensure normal layout in vertical mode
      return;
  }

  const imageHeight = images[0].clientHeight || 100; // Approximate single image height
  const listHeight = imageList.clientHeight;
  const totalImagesHeight = images.length * imageHeight;

  if (totalImagesHeight < listHeight) {
      imageList.classList.add("centered"); // Apply centered layout
  } else {
      imageList.classList.remove("centered"); // Revert to grid
  }
}


/////////// PANNING ///////////////////

let isPanning = false, startX = 0, startY = 0, currentX = 0, currentY = 0;
let scale = 1, maxScale = 5, minScale = 1;
let imgOffsetX = 0, imgOffsetY = 0;

selectedImage.addEventListener("mousedown", startPan);
selectedImage.addEventListener("touchstart", startPan, { passive: false });

function startPan(event) {
  event.preventDefault();
  isPanning = true;
  startX = (event.touches ? event.touches[0].clientX : event.clientX) - imgOffsetX;
  startY = (event.touches ? event.touches[0].clientY : event.clientY) - imgOffsetY;
  selectedImage.style.cursor = "grabbing";
}

document.addEventListener("mousemove", panImage);
document.addEventListener("touchmove", panImage, { passive: false });

function panImage(event = null) {
  let rect = selectedWindow.getBoundingClientRect(); // Get container size
  let { width: imgWidth, height: imgHeight } = getDisplayedImageSize(); // Get actual displayed image size

  // Calculate max allowed panning based on current zoom level
  let maxOffsetX = Math.max(0, ((imgWidth * scale) - rect.width) / 2);
  let maxOffsetY = Math.max(0, ((imgHeight * scale) - rect.height) / 2);

  if (event) {
    if (!isPanning) return;

    // Get new pan position from event
    let newX = (event.touches ? event.touches[0].clientX : event.clientX) - startX;
    let newY = (event.touches ? event.touches[0].clientY : event.clientY) - startY;

    // Restrict panning within legal bounds
    imgOffsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, newX));
    imgOffsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, newY));
  } else {
    // If no event, just reapply limits (useful after zooming)
    imgOffsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, imgOffsetX));
    imgOffsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, imgOffsetY));
  }

  updateTransform();
}

document.addEventListener("mouseup", stopPan);
document.addEventListener("touchend", stopPan);

function stopPan() {
  isPanning = false;
  selectedImage.style.cursor = "grab";
}


/////// ZOOMING ////////

// Restrict zooming within container
selectedImage.addEventListener("wheel", zoomImage);
selectedImage.addEventListener("gesturechange", zoomImage);


// Set Zoom Levels
const zoomStep = 0.2; // Each click increases/decreases zoom by 20%

function zoomImage(event) {
  event.preventDefault();

  let rect = selectedWindow.getBoundingClientRect(); // Get window size

  // Determine zoom direction
  let delta = event.deltaY ? -event.deltaY / 500 : (event.scale - 1) * 0.5;
  let newScale = Math.max(minScale, Math.min(maxScale, scale + delta));

  // Get displayed image size (adjusted for `object-fit: contain`)
  let { width: imgWidth, height: imgHeight } = getDisplayedImageSize();

  // Get zoom point (mouse cursor or pinch center)
  let zoomX, zoomY;
  if (event.touches && event.touches.length === 2) {
    // Pinch zoom: Calculate midpoint between two touch points
    zoomX = (event.touches[0].clientX + event.touches[1].clientX) / 2 - rect.left;
    zoomY = (event.touches[0].clientY + event.touches[1].clientY) / 2 - rect.top;
  } else {
    // Mouse wheel zoom
    zoomX = (event.clientX || rect.width / 2) - rect.left;
    zoomY = (event.clientY || rect.height / 2) - rect.top;
  }

  // Adjust offsets to zoom towards the cursor
  let zoomFactor = newScale / scale - 1;
  imgOffsetX -= zoomFactor * (zoomX - rect.width / 2); 
  imgOffsetY -= zoomFactor * (zoomY - rect.height / 2); 

  scale = newScale;

  // Reapply panning limits to prevent going out of bounds
  panImage();

  updateTransform();
}

// Apply transformations
function updateTransform() {
  selectedImage.style.transform = `translate(${imgOffsetX}px, ${imgOffsetY}px) scale(${scale})`;
}

function getDisplayedImageSize() {
  let rect = selectedWindow.getBoundingClientRect(); // Get container size
  let naturalRatio = selectedImage.naturalWidth / selectedImage.naturalHeight;
  let containerRatio = rect.width / rect.height;

  let displayWidth, displayHeight;

  if (naturalRatio > containerRatio) {
    // Image is wider than container, so width is maxed out
    displayWidth = rect.width;
    displayHeight = rect.width / naturalRatio;
  } else {
    // Image is taller than container, so height is maxed out
    displayHeight = rect.height;
    displayWidth = rect.height * naturalRatio;
  }
  return { width: displayWidth, height: displayHeight };
}

zoomInBtn.addEventListener("click", () => {
  zoomImage({ deltaY: -100, preventDefault: () => {} });
});

zoomOutBtn.addEventListener("click", () => {
  zoomImage({ deltaY: 100, preventDefault: () => {} });
});

// Reset zoom & position when switching images
function resetZoom() {
  scale = 1;
  imgOffsetX = 0;
  imgOffsetY = 0;
  updateTransform();
}

//////// MOBILE FIX ///////

// updating page size to keep everything above brower bar on mobile

function handleViewportResize() {
  const container = document.querySelector(".container");
  const selectedWindow = document.querySelector(".selected-window");

  // Get dynamic viewport height (fixes mobile resizing)
  let newHeight = window.innerHeight - 40; // Adjust for nav height
  container.style.height = `${newHeight}px`;
  selectedWindow.style.height = `${newHeight * 0.6}px`;

  // Force reapply image layout and pan position
  adjustImageListLayout();
  panImage();
}

// Trigger recalculation when the viewport changes (e.g., address bar hides)
window.addEventListener("resize", handleViewportResize);

// Run once on page load
handleViewportResize();