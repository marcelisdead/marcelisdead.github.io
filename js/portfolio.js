//builds and controls portfolio

const imageList = document.getElementById("imageList");
const selectedWindow = document.querySelector(".selected-window");
const selectedImage = document.getElementById("selectedImage");
const title = document.getElementById("selected-title");
const text = document.getElementById("description-text");
const description = document.getElementById("description");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

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
  title.innerHTML = piece.title;
  title.href = piece.link || "#";
//the title is an a set its href to the pieces link
  text.innerHTML = piece.description;
  text.href = piece.link || "#";

  //resetZoom(); // Reset zoom when switching images

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
description.addEventListener("wheel", () => stopAutoCycle());
description.addEventListener("gesturechange", () => stopAutoCycle());
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
  //panImage();
}

// Trigger recalculation when the viewport changes (e.g., address bar hides)
window.addEventListener("resize", handleViewportResize);

// Run once on page load
handleViewportResize();

