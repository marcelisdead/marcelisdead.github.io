let currentIndex = 0;
let data = { pieces: [] };

// Get JSON file path from HTML
const jsonPathData = document.getElementById("jsonPath").textContent;
const jsonFilePath = JSON.parse(jsonPathData).file;

// DOM Elements
const imageList = document.getElementById("imageList");
const selectedImage = document.getElementById("selectedImage");
const title = document.getElementById("title");
const text = document.getElementById("text");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Fetch JSON Data
fetch(jsonFilePath)
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData;
    populateImageList();
    selectPiece(0);
  })
  .catch(error => console.error("Error loading JSON data:", error));

// Populate the image list
function populateImageList() {
  data.pieces.forEach((piece, index) => {
    const img = document.createElement("img");
    img.src = piece.image;
    img.alt = piece.title;
    img.dataset.index = index;
    img.addEventListener("click", () => selectPiece(index));
    imageList.appendChild(img);
  });
}

// Update the selected piece
function selectPiece(index) {
  currentIndex = index;
  const piece = data.pieces[index];
  selectedImage.src = piece.image;
  title.textContent = piece.title;
  text.textContent = piece.description;
}

// Navigate to the previous piece
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + data.pieces.length) % data.pieces.length;
  selectPiece(currentIndex);
});

// Navigate to the next piece
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % data.pieces.length;
  selectPiece(currentIndex);
});

// Initialize the page
populateImageList();
selectPiece(0);
